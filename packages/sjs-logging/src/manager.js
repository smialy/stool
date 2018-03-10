import {LEVELS} from './consts';
import {Logger} from './logger';
import {Mask} from './filter';

export class Manager extends Mask {

    constructor() {
        super();
        this._loggers = {};
        this.level = LEVELS.ALL;
        this.getLogger().level = LEVELS.ALL;
    }

    /**
     * Find logger by name. Create is not exits
     *
     * @param {string} [name='root'] name
     * @return {Logger}
     */
    getLogger(name='root') {
        if (!this._loggers[name]) {
            let logger = new Logger(name);
            this._fixTree(logger);
            logger.manager = this;
            this._loggers[name] = logger;
        }
        return this._loggers[name];
    }

    _fixTree(logger) {
        var parts = logger.name.split('.');
        while (parts.length) {
            parts.pop();
            var parent = this._loggers[parts.join('.') || 'root'];
            if (parent) {
                logger.parent = parent;
                break;
            }
        }
        if (logger.parent) {
            for (var i in this._loggers) {
                var item = this._loggers[i];
                if (item.parent && item.parent === logger.parent) {
                    var name = item.name;
                    if (item.name.substr(0, logger.name.length) === logger.name) {
                        item.parent = logger;
                    }
                }
            }
        }
    }
}
