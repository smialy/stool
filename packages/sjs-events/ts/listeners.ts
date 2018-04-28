export default class Listeners {
    /**
     * @param {Object} bind - Default context
     */
    private _listeners: Array<{listener: Function, bind: any}> = [];
    private _isFire: boolean = false;
    private _bind: any;

    constructor(bind: any = null) {
        // this._listeners = [];
        // this._isFire = false;
        this._bind = bind;
    }

    /**
     * Add listener
     *
     * @param {function} fn
     * @param {Object} bind Context
     */
    add(listener: Function, bind: any) {
        bind = bind || this._bind;
        if (this._find(listener, bind) === -1) {
            this._listeners.push({
                listener,
                bind
            });
        }
    }
    /**
     * Remove listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    remove(listener: Function, bind: any): void {
        bind = bind || this._bind;
        let i = this._find(listener, bind);
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
    has(listener: Function, bind: any): boolean {
        return this._find(listener, bind || this._bind) !== -1;
    }
    /**
     * Notify event for listeners
     *
     * @param {...Object} args
     */
    emit(...args: any[]): void {
        if (!this._isFire) {
            this._isFire = true;
            for (let {listener, bind} of this._listeners) {
                if (listener.apply(bind, args) === false) {
                    this._isFire = false;
                    return;
                }
            }
            this._isFire = false;
        }
    }
    /**
     * {@link Listeners.emit}
     */
    dispatch(...args: any[]){
        this.emit(...args);
    }
    /**
     * @access private
     * @param {function} fn
     * @param {Object} bind
     */
    _find(listener: Function, bind: any) {
        for (let i = 0, len = this._listeners.length; i < len; i+=1) {
            let info = this._listeners[i];
            if (info.listener === listener && info.bind === bind) {
                return i;
            }
        }
        return -1;
    }
}
