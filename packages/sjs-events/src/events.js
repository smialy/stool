import Listeners from './listeners';


export default class Events {
    /**
     * Add event listener
     *
     * @param {string} name Event name
     * @param {function} fn Callback
     * @param {Object} bind Custom context for callback
     */
    on(name, fn, bind) {
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
    once(name, fn, bind) {
        name = name.toLowerCase();
        let listeners = storage(this).get(name);
        let _fn = (...args) => {
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
    off(name, fn, bind) {
        name = name.toLowerCase();
        let types = storage(this);
        let listeners = types.get(name);
        listeners.remove(fn, bind);
        if (listeners.size() === 0) {
            types.delete(name);
        }
    }
    /**
     * Remove listeners
     *
     * @param {string} name
     */
    offs(name) {
        name = name.toLowerCase();
        storage(this).remove(name);
    }
    /**
     * Notify all listeners
     *
     * @param {...Object} args
     */
    emit(...args) {
        let name = args.shift().toLowerCase();
        let types = storage(this);
        if (types.has(name)) {
            types.get(name).emit(...args);
        }
    }
    /**
     * {@link Events.emit}
     */
    dispatch(...args) {
        this.emit(...args);
    }
    /**
     * Remove Listeners
     *
     * @param {string} name - Event name
     */
    removeListeners(name) {
        this.offs(name);
    }
    /**
     * Remove all listeners
     */
    removeAllListeners() {
        storage(this).removeAll();
    }
    /**
     * {@link Events.off}
     */
    removeListener(name, fn, bind) {
        this.off(name, fn, bind);
    }
    /**
     * {@link Events.on}
     */
    addListener(name, fn, bind) {
        this.on(name, fn, bind);
    }
    /**
     * Has event
     *
     * @param {string} name - Event name
     * @param {function} fn
     * @param {Object} bind - New context
     */
    hasListeners(name, fn, bind) {
        name = name.toLowerCase();
        let types = storage(this);
        if (typeof fn === 'undefined') {
            return types.has(name);
        }
        return types.has(name) && types.get(name).has(fn, bind);
    }
}

class ListenersMap extends Map {
    get(name) {
        if (!this.has(name)) {
            this.set(name, new Listeners());
        }
        return super.get(name);
    }
    remove(name) {
        this.delete(name);
    }
    removeAll() {
        this.forEach(listeners => listeners.clear());
        this.clear();
    }
}

let eventsMap = new WeakMap();

function storage(obj) {
    if (!eventsMap.has(obj)) {
        eventsMap.set(obj, new ListenersMap());
    }
    return eventsMap.get(obj);
}
