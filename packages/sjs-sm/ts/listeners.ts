import {
    IState,
    IStateEvent,
    IStateListener,
    IStateListeners
    } from './interfaces';


export class StateListeners implements IStateListeners {
    protected _listeners: Set<IStateListener> = new Set<IStateListener>();

    addListener(listener: IStateListener) {
        this._listeners.add(listener);
    }
    removeListener(listener: IStateListener) {
        this._listeners.delete(listener);
    }
    resetListeners() {
        this._listeners = new Set();
    }
    enter(event: IStateEvent) {
        for(let listener of Array.from(this._listeners)) {
            listener.onEnter(event);
        }
    }
    change(event: IStateEvent) {
        for(let listener of Array.from(this._listeners)) {
            listener.onChange(event);
        }
    }
    exit(event: IStateEvent) {
        for(let listener of Array.from(this._listeners)) {
            listener.onExit(event);
        }
    }
}
