import { LEVELS } from './consts';
import { Logger } from './logger';
import { checkLevel } from './utils';

export class Manager {
    public disable: number;

    private _loggers: Map<string, Logger>;
    private _root: Logger|null;

    constructor(root= null, level= LEVELS.NOTSET) {
        this._root = root;
        this._loggers = new Map();
        this.disable = checkLevel(level);
    }

    public setDisable(level: number) {
        this.disable = checkLevel(level);
    }

    /**
     * Find logger by name. Create is not exits
     */
    public getLogger(name= 'root'): Logger {
        if (!this._loggers.has(name)) {
            const logger = new Logger(name);
            this._fixTree(logger);
            logger.manager = this;
            this._loggers.set(name, logger);
        }
        return this._loggers.get(name) as Logger;
    }

    public _fixTree(logger: Logger) {
        const parts = logger.name.split('.');
        while (parts.length) {
            parts.pop();
            const name = parts.join('.') || 'root';
            const parent = this._loggers.get(name);
            if (parent) {
                logger.parent = parent;
                break;
            }
        }
        if (logger.parent) {
            for (const item of this._loggers.values()) {
                if (item.parent && item.parent === logger.parent) {
                    if (item.name.substr(0, logger.name.length) === logger.name) {
                        item.parent = logger;
                    }
                }
            }
        }
    }
}
