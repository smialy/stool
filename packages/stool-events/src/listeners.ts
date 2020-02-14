interface IListnerType {
    bind: any;
    listener(): any;
}

export default class Listeners {
    /**
     * @param {Object} bind - Default context
     */
    private _listeners: IListnerType[] = [];
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
    public add(listener: () => void, bind: any) {
        bind = bind || this._bind;
        if (this._find(listener, bind) === -1) {
            this._listeners.push({
                listener,
                bind,
            });
        }
    }
    /**
     * Remove listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    public remove(listener: () => void, bind: any): void {
        bind = bind || this._bind;
        const i = this._find(listener, bind);
        if (i !== -1) {
            this._listeners.splice(i, 1);
        }
    }
    /**
     * Get nubmer of listeners
     *
     * @return {number}
     */
    public size() {
        return this._listeners.length;
    }
    /**
     * Remove all listeners
     */
    public clear() {
        this._listeners.length = 0;
    }
    /**
     * Has listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    public has(listener: () => void, bind: any): boolean {
        return this._find(listener, bind || this._bind) !== -1;
    }
    /**
     * Notify event for listeners
     *
     * @param {...Object} args
     */
    public emit(...args: []): void {
        if (!this._isFire) {
            this._isFire = true;
            for (const {listener, bind} of this._listeners) {
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
    public dispatch(...args: []) {
        this.emit(...args);
    }
    /**
     * @access private
     * @param {function} fn
     * @param {Object} bind
     */
    public _find(listener: () => void, bind: any) {
        for (let i = 0, len = this._listeners.length; i < len; i += 1) {
            const info = this._listeners[i];
            if (info.listener === listener && info.bind === bind) {
                return i;
            }
        }
        return -1;
    }
}
