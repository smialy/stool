import { LEVELS } from './consts';
import { Logger } from './logger';
import { checkLevel } from './utils';


export class Manager {

    constructor(root, level=LEVELS.NOTSET) {
        this._loggers = new Map();
        this._root = root;
        this.disable = checkLevel(level);
    }

    setDisable(level){
        this.disable = checkLevel(level);
    }

    /**
     * Find logger by name. Create is not exits
     *
     * @param {string} [name='root'] name
     * @return {Logger}
     */
    getLogger(name='root') {
        if(!this._loggers.has(name)){
            let logger = new Logger(name);
            this._fixTree(logger);
            logger.manager = this;
            this._loggers.set(name, logger);
        }
        return this._loggers.get(name);
    }

    _fixTree(logger) {
        let parts = logger.name.split('.');
        while (parts.length) {
            parts.pop();
            let name = parts.join('.') || 'root';
            let parent = this._loggers.get(name);
            if (parent) {
                logger.parent = parent;
                break;
            }
        }
        if (logger.parent) {
            for (let item of this._loggers.values()) {
                if (item.parent && item.parent === logger.parent) {
                    if (item.name.substr(0, logger.name.length) === logger.name) {
                        item.parent = logger;
                    }
                }
            }
        }
    }
}
