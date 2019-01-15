import Listeners from './listeners';

export default class Events {
    /**
     * Add event listener
     *
     * @param {string} name Event name
     * @param {function} fn Callback
     * @param {Object} bind Custom context for callback
     */
    public on(name: string, fn: () => void, bind: any): void {
        name = name.toLowerCase();
        storage(this).get(name).add(fn, bind);
    }
    /**
     * Add event and remove it after fire
     *
     * @param {string} name Event name
     * @param {function} fn Callback
     * @param {Object} bind Custom context for callback
     */
    public once(name: string, fn: () => void, bind: any): void {
        name = name.toLowerCase();
        const listeners = storage(this).get(name);
        const _fn = (...args: any[]) => {
            listeners.remove(_fn, bind);
            if (!listeners.size()) {
                this.removeListeners(name);
            }
            // @ts-ignore
            return fn.apply(this, args);  
        };
        listeners.add(_fn, bind);
    }
    /**
     * Remove event
     *
     * @param {string} name - Event name
     * @param {function} fn
     * @param {Object} bind - New context
     */
    public off(name: string, fn: () => void, bind: any): void {
        name = name.toLowerCase();
        const types = storage(this);
        const listeners = types.get(name);
        listeners.remove(fn, bind);
        if (listeners.size() === 0) {
            types.remove(name);
        }
    }
    /**
     * Remove listeners
     *
     * @param {string} name
     */
    public offs(name: string): void {
        name = name.toLowerCase();
        storage(this).remove(name);
    }
    /**
     * Notify all listeners
     *
     * @param {...Object} args
     */
    public emit(...args: any[]): void {
        const name = args.shift().toLowerCase();
        const types = storage(this);
        if (types.has(name)) {
            types.get(name).emit(...args);
        }
    }
    /**
     * {@link Events.emit}
     */
    public dispatch(...args: any[]): void {
        this.emit(...args);
    }
    /**
     * Remove Listeners
     *
     * @param {string} name - Event name
     */
    public removeListeners(name: string): void {
        this.offs(name);
    }
    /**
     * Remove all listeners
     */
    public removeAllListeners(): void {
        storage(this).removeAll();
    }
    /**
     * {@link Events.off}
     */
    public removeListener(name: string, fn: () => void, bind: any): void {
        this.off(name, fn, bind);
    }
    /**
     * {@link Events.on}
     */
    public addListener(name: string, fn: () => void, bind: any): void {
        this.on(name, fn, bind);
    }
    /**
     * Has event
     *
     * @param {string} name - Event name
     * @param {function} fn
     * @param {Object} bind - New context
     */
    public hasListeners(name: string, fn: () => void, bind: any): boolean {
        name = name.toLowerCase();
        const types = storage(this);
        if (typeof fn === 'undefined') {
            return types.has(name);
        }
        return types.has(name) && types.get(name).has(fn, bind);
    }
}

class ListenersTypes {
    private _map: Map<string, Listeners>;
    constructor() {
        this._map = new Map();
    }
    public get(name: string): Listeners | undefined {
        if (!this._map.has(name)) {
            this._map.set(name, new Listeners());
        }
        return this._map.get(name);
    }
    public has(name: string): boolean {
        return this._map.has(name);
    }
    public remove(name: string): void {
        this._map.delete(name);
    }
    public removeAll(): void {
        this._map.forEach((listeners) => listeners.clear());
        this._map.clear();
    }
}

const eventsMap = new WeakMap();

function storage(obj: any): any {
    if (!eventsMap.has(obj)) {
        eventsMap.set(obj, new ListenersTypes());
    }
    return eventsMap.get(obj);
}
