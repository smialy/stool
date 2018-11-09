import { LEVEL_NAMES, LEVELS } from './consts';
import { Filterer } from './filter';
import { Handler } from './handlers';
import { IHandler, IRecord } from './interfaces';
import { checkLevel } from './utils';

export class Logger extends Filterer {
    public name: string;
    public manager?: any;
    public parent?: Logger;

    private level: number;
    private propagate: boolean = true;
    private _handlers: Set<IHandler>;

    /**
     * @param {string} name
     * @param {number} [level=LEVELS.NOTSET] level
     */
    constructor(name: string, level= LEVELS.NOTSET) {
        super();
        this.name = name;
        this.level = checkLevel(level);
        this.propagate = true;
        this._handlers = new Set();
    }

    public setLevel(level: number) {
        this.level = checkLevel(level);
    }
    /**
     *
     * @param {Handler} handler
     */
    public addHandler(handler: IHandler) {
        if (!(handler instanceof Handler)) {
            throw new Error('Expected sjs-logging.Handler');
        }
        if (!this._handlers.has(handler)) {
            this._handlers.add(handler);
        }
        return this;
    }
    /**
     * @param {Handler} handler
     */
    public removeHandler(handler: IHandler) {
        this._handlers.delete(handler);
        return this;
    }
    /**
     * @return {boolean}
     */
    public hasHandlers() {
        return this._handlers.size;
    }
    public getHandlers(): IHandler[] {
        return Array.from(this._handlers);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    public fatal(msg: string, exception?: any) {
        this.log(LEVELS.FATAL, msg, exception);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    public critical(msg: string, exception?: any) {
        this.log(LEVELS.CRITICAL, msg, exception);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    public error(msg: string, exception?: any) {
        this.log(LEVELS.ERROR, msg, exception);
    }

    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    public warn(msg: string, exception?: any) {
        this.log(LEVELS.WARN, msg, exception);
    }

    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    public warning(msg: string, exception?: any) {
        this.log(LEVELS.WARN, msg, exception);
    }

    /**
     *
     * @param {string} msg
     */
    public info(msg: string) {
        this.log(LEVELS.INFO, msg);
    }

    /**
     *
     * @param {string} msg
     */
    public debug(msg: string) {
        this.log(LEVELS.DEBUG, msg);
    }

    /**
     *
     * @param {Error} ex
     */
    public exception(exception: any) {
        this.log(LEVELS.ERROR, exception.message, exception);
    }

    /**
     * @param {number} level
     * @param {string} msg
     * @param {Error} exception
     */
    public log(level: number, msg: string, exception?: any) {
        level = checkLevel(level);
        if (this._isEnabledFor(level)) {
            this.handle({
                name: this.name,
                level,
                levelName: LEVEL_NAMES[level] as string,
                msg,
                exception,
            });
        }

    }
    public _isEnabledFor(level: number) {
        if (this.manager && this.manager.disable > level) {
            return false;
        }
        return level >= this._getParentLevel();

    }

    /**
     *
     * @param {Record} record
     */
    public handle(record: IRecord) {
        if (this.filter(record)) {
            let p = this as Logger;
            while (p) {
                const handlers = p.getHandlers();
                for (const handler of handlers) {
                    if (record.level >= handler.level) {
                        handler.handle(record);
                    }
                }
                if (!p.propagate) {
                    break;
                }
                p = p.parent as Logger;
            }
        }
    }

    public _getParentLevel() {
        let logger = this as Logger;
        while (logger) {
            if (logger.level) {
                return logger.level;
            }
            logger = logger.parent as Logger;
        }
        return LEVELS.NOTSET;
    }
}
