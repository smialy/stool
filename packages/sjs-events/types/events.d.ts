export default class Events {
    /**
     * Add event listener
     *
     * @param {string} name Event name
     * @param {function} fn Callback
     * @param {Object} bind Custom context for callback
     */
    on(name: string, fn: Function, bind: any): void;
    /**
     * Add event and remove it after fire
     *
     * @param {string} name Event name
     * @param {function} fn Callback
     * @param {Object} bind Custom context for callback
     */
    once(name: string, fn: Function, bind: any): void;
    /**
     * Remove event
     *
     * @param {string} name - Event name
     * @param {function} fn
     * @param {Object} bind - New context
     */
    off(name: string, fn: Function, bind: any): void;
    /**
     * Remove listeners
     *
     * @param {string} name
     */
    offs(name: string): void;
    /**
     * Notify all listeners
     *
     * @param {...Object} args
     */
    emit(...args: any[]): void;
    /**
     * {@link Events.emit}
     */
    dispatch(...args: any[]): void;
    /**
     * Remove Listeners
     *
     * @param {string} name - Event name
     */
    removeListeners(name: string): void;
    /**
     * Remove all listeners
     */
    removeAllListeners(): void;
    /**
     * {@link Events.off}
     */
    removeListener(name: string, fn: Function, bind: any): void;
    /**
     * {@link Events.on}
     */
    addListener(name: string, fn: Function, bind: any): void;
    /**
     * Has event
     *
     * @param {string} name - Event name
     * @param {function} fn
     * @param {Object} bind - New context
     */
    hasListeners(name: string, fn: Function, bind: any): boolean;
}
