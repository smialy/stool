import {LEVELS, LEVEL_NAMES} from './consts';
import {levelToMask, checkLevel} from './utils';
import { Handler } from './handler';
import { Filterer } from './filter';


export class Logger extends Filterer {

    /**
     * @param {string} name
     * @param {number} [level=LEVELS.NOTSET] level
     */
    constructor(name, level=LEVELS.NOTSET){
        super();
        this.name = name;
        this.level = checkLevel(level);
        this.parent =  null;
        this.propagate = true;
        this._handlers = [];
    }

    setLevel(level){
        this.level = checkLevel(level);
    }
    /**
     *
     * @param {Handler} handler
     */
    addHandler(handler) {
        if (!(handler instanceof Handler)) {
            throw new Error('Expected sjs-logging.Handler');
        }
        if(this._handlers.indexOf(handler) === -1){
            this._handlers.push(handler);
        }
        return this;
    }
    /**
     * @param {Handler} handler
     */
    removeHandler(handler) {
        this._handlers.remove(handler);
        return this;
    }
    /**
     * @return {boolean}
     */
    hasHandlers() {
        return this._handler.length;
    }
    getHandlers() {
        return this._handlers.concat();
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    fatal(msg, ex) {
        this.log(LEVELS.FATAL, msg, ex);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    critical(msg, ex) {
        this.log(LEVELS.CRITICAL, msg, ex);
    }
    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    error(msg, ex) {
        this.log(LEVELS.ERROR, msg, ex);
    }

    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    warn(msg, ex) {
        this.log(LEVELS.WARN, msg, ex);
    }

    /**
     *
     * @param {string} msg
     * @param {Error} ex
     */
    warning(msg, ex) {
        this.log(LEVELS.WARN, msg, ex);
    }

    /**
     *
     * @param {string} msg
     */
    info(msg) {
        this.log(LEVELS.INFO, msg);
    }

    /**
     *
     * @param {string} msg
     */
    debug(msg) {
        this.log(LEVELS.DEBUG, msg);
    }

    /**
     *
     * @param {Error} ex
     */
    exception(ex) {
        this.log(LEVELS.ERROR, ex.message, ex);
    }

    /**
     * @param {number} level
     * @param {string} msg
     * @param {Error} ex
     */
    log(level, msg, ex) {
        level = checkLevel(level);
        if (this._isEnabledFor(level)) {
            this.handle({
                name: this.name,
                level,
                levelName: LEVEL_NAMES[level],
                msg,
                ex
            });
        }

    }
    _isEnabledFor(level){
        if(this.manager && this.manager.disable > level){
            return false;
        }
        return level >= this._getParentLevel();

    }

    /**
     *
     * @param {Record} record
     */
    handle(record) {
        if(this.filter(record)){
            let p = this;
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
                p = p.parent;
            }
        }
    }

    _getParentLevel() {
        let logger = this;
        while (logger) {
            if (logger.level) {
                return logger.level;
            }
            logger = logger.parent;
        }
        return LEVELS.NOTSET;
    }
}
