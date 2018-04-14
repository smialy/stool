export default class Listeners{
    /**
     * @param {Object} bind - Default context
     */
    constructor(bind=null) {
        this._listeners = [];
        this._isFire = false;
        this._bind = bind;
    }

    /**
     * Add listener
     *
     * @param {function} fn
     * @param {Object} bind Context
     */
    add(fn, bind) {
        if (this._find(fn, bind) === -1) {
            this._listeners.push([fn, bind || this._bind]);
        }
    }
    /**
     * Remove listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    remove(fn, bind) {
        let i = this._find(fn, bind);
        if (i !== -1) {
            this._listeners.splice(i, 1);
        }
    }
    /**
     * Get nubmer of listeners
     *
     * @return {number}
     */
    size() {
        return this._listeners.length;
    }
    /**
     * Remove all listeners
     */
    clear() {
        this._listeners.length = 0;
    }
    /**
     * Has listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    has(fn, bind) {
        return this._find(fn, bind) !== -1;
    }
    /**
     * Notify event for listeners
     *
     * @param {...Object} args
     */
    emit(...args) {
        if (!this._isFire) {
            this._isFire = true;
            for (let i = 0, len = this._listeners.length; i < len; ++i) {
                let l = this._listeners[i];
                if (l[0].apply(l[1] || null, args) === false) {
                    this._isFire = false;
                    return false;
                }
            }
            this._isFire = false;
        }
    }
    /**
     * {@link Listeners.emit}
     */
    dispatch(...args){
        this.emit(...args);
    }
    /**
     * @access private
     * @param {function} fn
     * @param {Object} bind
     */
    _find(fn, bind) {
        let l;
        bind = bind || this._bind;
        for (let i = 0, len = this._listeners.length; i < len; ++i) {
            l = this._listeners[i];
            if (l) {
                if (l[0] === fn && l[1] === bind) {
                    return i;
                }
            }
        }
        return -1;
    }
}
