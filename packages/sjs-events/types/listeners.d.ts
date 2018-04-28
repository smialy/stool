export default class Listeners {
    /**
     * @param {Object} bind - Default context
     */
    private _listeners;
    private _isFire;
    private _bind;
    constructor(bind?: any);
    /**
     * Add listener
     *
     * @param {function} fn
     * @param {Object} bind Context
     */
    add(listener: Function, bind: any): void;
    /**
     * Remove listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    remove(listener: Function, bind: any): void;
    /**
     * Get nubmer of listeners
     *
     * @return {number}
     */
    size(): number;
    /**
     * Remove all listeners
     */
    clear(): void;
    /**
     * Has listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    has(listener: Function, bind: any): boolean;
    /**
     * Notify event for listeners
     *
     * @param {...Object} args
     */
    emit(...args: any[]): void;
    /**
     * {@link Listeners.emit}
     */
    dispatch(...args: any[]): void;
    /**
     * @access private
     * @param {function} fn
     * @param {Object} bind
     */
    _find(listener: Function, bind: any): number;
}
