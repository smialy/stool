import { IHandler, IRecord } from './interfaces';
import { LEVELS, LEVEL_NAMES } from './consts';
import { checkLevel } from './utils';
import { Handler } from './handlers';
import { Filterer } from './filter';


export class Logger extends Filterer {

    private level: number;
    private propagate: boolean = true;
    private _handlers: Set<IHandler>;
    public name: string;
    public manager?: any;
    public parent?: Logger;

    /**
     * @param {string} name
     * @param {number} [level=LEVELS.NOTSET] level
     */
    constructor(name: string, level=LEVELS.NOTSET){
        super();
        this.name = name;
        this.level = checkLevel(level);
        this.propagate = true;
        this._handlers = new Set();
    }

    setLevel(level: number){
        this.level = checkLevel(level);
    }
    /**
     *
     * @param {Handler} handler
     */
    addHandler(handler: IHandler) {
        if (!(handler instanceof Handler)) {
            throw new Error('Expected sjs-logging.Handler');
        }
        if(!this._handlers.has(handler)){
            this._handlers.add(handler);
        }
        return this;
    }
    /**
     * @param {Handler} handler
     */
    removeHandler(handler: IHandler) {
        this._handlers.delete(handler);
        return this;
    }
    /**
     * @return {boolean}
     */
    hasHandlers() {
        return this._handlers.size;
    }
    getHandlers(): Array<IHandler> {
        return Array.from(this._handlers);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    fatal(msg: string, exception?: any) {
        this.log(LEVELS.FATAL, msg, exception);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    critical(msg: string, exception?: any) {
        this.log(LEVELS.CRITICAL, msg, exception);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    error(msg: string, exception?: any) {
        this.log(LEVELS.ERROR, msg, exception);
    }

    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    warn(msg: string, exception?: any) {
        this.log(LEVELS.WARN, msg, exception);
    }

    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    warning(msg: string, exception?: any) {
        this.log(LEVELS.WARN, msg, exception);
    }

    /**
     *
     * @param {string} msg
     */
    info(msg: string) {
        this.log(LEVELS.INFO, msg);
    }

    /**
     *
     * @param {string} msg
     */
    debug(msg: string) {
        this.log(LEVELS.DEBUG, msg);
    }

    /**
     *
     * @param {Error} ex
     */
    exception(exception: any) {
        this.log(LEVELS.ERROR, exception.message, exception);
    }

    /**
     * @param {number} level
     * @param {string} msg
     * @param {Error} exception
     */
    log(level: number, msg: string, exception?: any) {
        level = checkLevel(level);
        if (this._isEnabledFor(level)) {
            this.handle({
                name: this.name,
                level,
                levelName: <string>LEVEL_NAMES[level],
                msg,
                exception
            });
        }

    }
    _isEnabledFor(level: number){
        if(this.manager && this.manager.disable > level){
            return false;
        }
        return level >= this._getParentLevel();

    }

    /**
     *
     * @param {Record} record
     */
    handle(record: IRecord) {
        if(this.filter(record)){
            let p = <Logger>this;
            while (p) {
                let handlers = p.getHandlers();
                for (let handler of handlers) {
                    if (record.level >= handler.level) {
                        handler.handle(record);
                    }
                }
                if(!p.propagate){
                    break;
                }
                p = <Logger>p.parent;
            }
        }
    }

    _getParentLevel() {
        let logger = <Logger>this;
        while (logger) {
            if (logger.level) {
                return logger.level;
            }
            logger = <Logger>logger.parent;
        }
        return LEVELS.NOTSET;
    }
}
