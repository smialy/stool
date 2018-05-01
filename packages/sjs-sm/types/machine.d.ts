import { IState, IStateListener, IStateListeners } from './interfaces';
export default class StateMachine implements IStateListeners {
    private _states;
    private _currentState;
    private _previousState;
    private _history;
    private _stateQueue;
    private _pending;
    private _listeners;
    start(stateName: string, payload?: null): void;
    goto(action: string, payload?: any): void;
    addState(state: IState): void;
    getState(name: string): IState | undefined;
    readonly states: [string, IState][];
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
