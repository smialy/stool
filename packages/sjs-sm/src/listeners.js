export class StateListeners {
    constructor() {
        this._listeners = new Set();
    }
    addListener(listener) {
        this._listeners.add(listener);
    }
    removeListener(listener) {
        this._listeners.delete(listener);
    }
    resetListeners() {
        this._listeners = new Set();
    }
    enter(event) {
        for (let listener of Array.from(this._listeners)) {
            listener.onEnter(event);
        }
    }
    change(event) {
        for (let listener of Array.from(this._listeners)) {
            listener.onChange(event);
        }
    }
    exit(event) {
        for (let listener of Array.from(this._listeners)) {
            listener.onExit(event);
        }
    }
}
