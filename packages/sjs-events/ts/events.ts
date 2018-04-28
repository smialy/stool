import Listeners from './listeners';


export default class Events {
    /**
     * Add event listener
     *
     * @param {string} name Event name
     * @param {function} fn Callback
     * @param {Object} bind Custom context for callback
     */
    on(name: string, fn: Function, bind: any): void {
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
    once(name: string, fn: Function, bind: any): void {
        name = name.toLowerCase();
        let listeners = storage(this).get(name);
        let _fn = (...args: any[]) => {
            listeners.remove(_fn, bind);
            if (!listeners.size()) {
                this.removeListeners(name);
            }
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
    off(name: string, fn: Function, bind: any): void {
        name = name.toLowerCase();
        let types = storage(this);
        let listeners = types.get(name);
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
    offs(name: string): void {
        name = name.toLowerCase();
        storage(this).remove(name);
    }
    /**
     * Notify all listeners
     *
     * @param {...Object} args
     */
    emit(...args: any[]): void {
        let name = args.shift().toLowerCase();
        let types = storage(this);
        if (types.has(name)) {
            types.get(name).emit(...args);
        }
    }
    /**
     * {@link Events.emit}
     */
    dispatch(...args: any[]): void {
        this.emit(...args);
    }
    /**
     * Remove Listeners
     *
     * @param {string} name - Event name
     */
    removeListeners(name: string): void {
        this.offs(name);
    }
    /**
     * Remove all listeners
     */
    removeAllListeners(): void {
        storage(this).removeAll();
    }
    /**
     * {@link Events.off}
     */
    removeListener(name: string, fn: Function, bind: any): void {
        this.off(name, fn, bind);
    }
    /**
     * {@link Events.on}
     */
    addListener(name: string, fn: Function, bind: any): void {
        this.on(name, fn, bind);
    }
    /**
     * Has event
     *
     * @param {string} name - Event name
     * @param {function} fn
     * @param {Object} bind - New context
     */
    hasListeners(name: string, fn: Function, bind: any): boolean {
        name = name.toLowerCase();
        let types = storage(this);
        if (typeof fn === 'undefined') {
            return types.has(name);
        }
        return types.has(name) && types.get(name).has(fn, bind);
    }
}

class ListenersTypes {
    private _map: Map<string, Listeners>;
    constructor(){
        this._map = new Map();
    }
    get(name: string): Listeners | undefined{
        if (!this._map.has(name)) {
            this._map.set(name, new Listeners());
        }
        return this._map.get(name);
    }
    has(name: string): boolean {
        return this._map.has(name);
    }
    remove(name: string): void {
        this._map.delete(name);
    }
    removeAll(): void {
        this._map.forEach(listeners => listeners.clear());
        this._map.clear();
    }
}

let eventsMap = new WeakMap();

function storage(obj: any): any {
    if (!eventsMap.has(obj)) {
        eventsMap.set(obj, new ListenersTypes());
    }
    return eventsMap.get(obj);
}
