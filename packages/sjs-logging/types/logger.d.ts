import { IHandler, IRecord } from './interfaces';
import { Filterer } from './filter';
export declare class Logger extends Filterer {
    private level;
    private propagate;
    private _handlers;
    name: string;
    manager?: any;
    parent?: Logger;
    /**
     * @param {string} name
     * @param {number} [level=LEVELS.NOTSET] level
     */
    constructor(name: string, level?: number);
    setLevel(level: number): void;
    /**
     *
     * @param {Handler} handler
     */
    addHandler(handler: IHandler): this;
    /**
     * @param {Handler} handler
     */
    removeHandler(handler: IHandler): this;
    /**
     * @return {boolean}
     */
    hasHandlers(): number;
    getHandlers(): Array<IHandler>;
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    fatal(msg: string, exception?: any): void;
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    critical(msg: string, exception?: any): void;
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    error(msg: string, exception?: any): void;
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    warn(msg: string, exception?: any): void;
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    warning(msg: string, exception?: any): void;
    /**
     *
     * @param {string} msg
     */
    info(msg: string): void;
    /**
     *
     * @param {string} msg
     */
    debug(msg: string): void;
    /**
     *
     * @param {Error} ex
     */
    exception(exception: any): void;
    /**
     * @param {number} level
     * @param {string} msg
     * @param {Error} exception
     */
    log(level: number, msg: string, exception?: any): void;
    _isEnabledFor(level: number): boolean;
    /**
     *
     * @param {Record} record
     */
    handle(record: IRecord): void;
    _getParentLevel(): number;
}
