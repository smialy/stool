import {
    IState,
    IStateEvent,
    IStateListener,
    IStateListeners,
    } from './interfaces';

export class StateListeners implements IStateListeners {
    protected _listeners: Set<IStateListener> = new Set<IStateListener>();

    public addListener(listener: IStateListener) {
        this._listeners.add(listener);
    }
    public removeListener(listener: IStateListener) {
        this._listeners.delete(listener);
    }
    public resetListeners() {
        this._listeners = new Set();
    }
    public enter(event: IStateEvent) {
        for (const listener of Array.from(this._listeners)) {
            listener.onEnter(event);
        }
    }
    public change(event: IStateEvent) {
        for (const listener of Array.from(this._listeners)) {
            listener.onChange(event);
        }
    }
    public exit(event: IStateEvent) {
        for (const listener of Array.from(this._listeners)) {
            listener.onExit(event);
        }
    }
}
