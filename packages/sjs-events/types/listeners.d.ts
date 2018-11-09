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
    add(listener: () => void, bind: any): void;
    /**
     * Remove listener
     *
     * @param {function} fn
     * @param {Object} bind - New context
     */
    remove(listener: () => void, bind: any): void;
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
    has(listener: () => void, bind: any): boolean;
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
    _find(listener: () => void, bind: any): number;
}
