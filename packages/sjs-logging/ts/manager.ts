import { LEVELS } from './consts';
import { Logger } from './logger';
import { checkLevel } from './utils';


export class Manager {

    private _loggers: Map<string, Logger>;
    private _root: Logger|null;
    public disable: number;

    constructor(root=null, level=LEVELS.NOTSET) {
        this._root = root;
        this._loggers = new Map();
        this.disable = checkLevel(level);
    }

    setDisable(level: number){
        this.disable = checkLevel(level);
    }

    /**
     * Find logger by name. Create is not exits
     *
     * @param {string} [name='root'] name
     * @return {Logger}
     */
    getLogger(name='root'): Logger {
        if(!this._loggers.has(name)){
            let logger = new Logger(name);
            this._fixTree(logger);
            logger.manager = this;
            this._loggers.set(name, logger);
        }
        return <Logger>this._loggers.get(name);
    }

    _fixTree(logger: Logger) {
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