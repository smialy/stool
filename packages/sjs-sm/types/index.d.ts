import { IState, IStateEvent, IStateListener, IStateListeners } from './interfaces';
export declare class StateEvent implements IStateEvent {
    readonly state: IState;
    readonly action: string;
    readonly payload: any;
    constructor(state: IState, action: string, payload?: any);
}
export default class StateMachine implements IStateListeners {
    private _states;
    private _currentState;
    private _previousState;
    private _history;
    private _stateQueue;
    private _pending;
    private _listeners;
    static build(config: any): StateMachine;
    start(stateName: string, payload?: null): void;
    goto(action: string, payload?: any): void;
    addState(state: IState): void;
    getState(name: string): IState | undefined;
    removeState(name: string): boolean;
    currentState(): IState | null;
    addListener(listener: IStateListener): void;
    removeListener(listener: IStateListener): void;
    resetListeners(): void;
    private _transition(nextState, action, payload?);
    private _beginTransition();
    private _endTransition();
    isPending(): boolean;
    private _next();
}
