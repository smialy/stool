import {LEVELS, LEVEL_NAMES, LEVEL_TO_MASK} from './consts';
import { Handler } from './handler';
import { Filterer } from './filter';


export class Logger extends Filterer{

    /**
     * @param {string} name
     * @param {number} [level=LEVELS.NOTSET] level
     */
    constructor(name, level=LEVELS.NOTSET){
    	  super();
    	  this.level = level;
        this.name = name;
        this.parent =  null;
    	  this.propagate = true;
        this._handlers = [];
    }

    /**
     *
     * @param {Handler} handler
     */
    addHandler(handler) {
        if (!(handler instanceof Handler)) {
            throw new Error('Expected sjs-log.Handler');
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
        level = _checkLevel(level);
        if (!this.manager || (this.manager && this.manager.mask & level)) {
            if (this._getParentMask() & level) {
                var record = {
                    name: this.name,
                    level: level,
                    levelName: LEVEL_NAMES[level],
                    mask: LEVEL_TO_MASK(level),
                    msg: msg,
                    ex: ex
                };
                this.handle(record);
            }
        }
    }
    _getParentMask() {
        var logger = this;
        while (logger) {
            if (logger._mask) {
                return logger._mask;
            }
            logger = logger.parent;
        }
        return LEVELS.NOTSET;
    }
    /**
     *
     * @param {Record} record
     */
    handle(record) {
        var handler, p = this;
        while (p) {
            for (var i = 0, j = p._handlers.length; i < j; i++) {
                handler = p._handlers[i];
                if (handler.mask & record.level) {
                    handler.handle(record);
                }
            }
            p = p.propagate ? p.parent : null;
        }
    }
}

/**
* Return level as number
*
* @param {Number|string} level
* @return {Number}
* @throw TypeError
*/
function _checkLevel(level) {
    if (LEVEL_NAMES.hasOwnProperty(level)) {
        if (typeof level === 'string') {
            return LEVEL_NAMES[level];
        }
        return level;
    }
    throw new TypeError('Unknown level: ' + level);
}
