import { IDisposable } from './lifecycle';

interface ListenersHandler<T> {
    (callback: (event: T) => void, bind?: any): () => void;
}
interface Listener<T> {
    (event: T): void;
}
export class Events<T> implements IDisposable {

    private _handlers: ListenersHandler<T> | undefined;
    private _listeners: Set<Listener<T>> | undefined;
    private _disposed: boolean = false;

    constructor() {

    }
    fire(event: T) {
        if (this._listeners) {
            const listeners = [...this._listeners];
            for(const listener of listeners) {
                try {
                    listener(event);
                } catch(err) {
                    console.error(err); // @TODO add global error handler
                }
            } 
        }
    }
    handlers(): ListenersHandler<T> {
        this._handlers ??= (callback: (event: T) => void, bind?: any) => {
            if (this._disposed) {
                return () => {};
            }
            if (bind) {
                callback = callback.bind(bind);
            }
            if (!this._listeners) {
                this._listeners = new Set();
            }
            this._listeners.add(callback)
            return () => this._listeners?.delete(callback);
        };
        return this._handlers;
    }
    size() {
        return this._listeners?.size || 0;
    }
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._listeners = undefined;
        }
    }
}
