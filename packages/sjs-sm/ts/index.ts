import State from './state';
import { IState, IStateEvent, IStateListener, IStateListeners } from './interfaces';
import { StateListeners } from './listeners';


const noop = () => {};
const prepareStateListener = (listener: any): IStateListener => ({
    onEnter: listener.onEnter || noop,
    onExit: listener.onExit || noop,
    onChange: listener.onChange || noop
});

export class StateEvent implements IStateEvent{
    public readonly state: IState;
    public readonly action: string;
    public readonly payload: any;

    constructor(state: IState, action: string, payload?: any){
        this.state = state;
        this.action = action;
        this.payload = payload;
    }
}

export default class StateMachine implements IStateListeners {

    private _states: Map<string, IState> = new Map<string, IState>();
    private _currentState: IState | null = null;
    private _previousState: IState | null = null;
    private _history: Array<string> = [];
    private _stateQueue: Array<{action: string, payload:any }> = [];
    private _pending: boolean = false;
    private _listeners: StateListeners = new StateListeners();

    static build(config: any) {
        const sm = new StateMachine();
        for(const item of config.transition) {
            let state = new State(item.name);
            for(let transition of item.transitions) {
                state.addTransition(transition.action, transition.target);
            }
            if(item.listeners){
                state.addListener(prepareStateListener(item.listeners));
            }
            sm.addState(state);
        }
        return sm;
    }
    start(stateName: string, payload=null){
        const state = this._states.get(stateName);
        if(state){
            return this._transition(state, '', payload);
        }
        throw new TypeError(`Not found state: ${stateName}`);
    }
    goto(action: string, payload: any = null) {
        this._stateQueue.push({action, payload});
        this._next();
    }
    addState(state: IState): void {
        if(this._states.has(state.name)) {
            throw new TypeError(`State: ${state.name} already exists`);
        }
        this._states.set(state.name, state);
    }
    getState(name: string){
        if(!this._states.has(name)) {
            throw new TypeError(`State: ${name} doesn't exists`);
        }
        return this._states.get(name);
    }
    removeState(name: string): boolean {
        return this._states.delete(name);
    }
    currentState(): IState | null {
        return this._currentState;
    }
    addListener(listener: IStateListener) {
        this._listeners.addListener(listener);
    }
    removeListener(listener: IStateListener) {
        this._listeners.removeListener(listener);
    }
    resetListeners(): void {
        this._listeners.resetListeners();
    }
    private _transition(nextState: IState, action: string, payload: any = null): void {
        // console.log('_transition', nextState, action, payload);
        this._beginTransition()
        if(this._currentState){
            const prevEvent = new StateEvent(this._currentState, action, payload);
            this._currentState.exit(prevEvent);
            this._listeners.exit(prevEvent);
        }
        const event = new StateEvent(nextState, action, payload);
        nextState.enter(event);
        this._listeners.enter(event);

        if(this._currentState) {
            this._history.push(this._currentState.name);
        }
        this._currentState = nextState;
        this._currentState.change(event);
        this._listeners.change(event);

        this._endTransition();
        this._next();
    }
    private _beginTransition(): void {
        this._pending = true;
    }
    private _endTransition(): void {
        this._pending = false;
    }

    public isPending(): boolean {
        return this._pending;
    }

    private _next() {
        if(this.isPending()){
            return;
        }
        const state = this._stateQueue.shift();
        if(state) {
            let {action, payload} = state;
            if(this._currentState){
                const target = this._currentState.getTarget(action);
                if(target){
                    const state = this._states.get(target);
                    if(state){
                        return this._transition(state, action, payload);
                    }
                }
            }
            this._next();
        }
    }
}
