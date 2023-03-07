import { LEVEL_NAMES, Levels, ROOT_LOGGER_NAME } from './consts';
import { Filterer } from './filter';
import { IHandler, ILogger, ILoggerFactory, IRecord, LevelType } from './types';
import { checkLevel, isException } from './utils';

type TExtra = Record<string, any>;

export class Logger extends Filterer implements ILogger {
    public manager?: any;

    private _parent?: ILogger;
    private _propagate: boolean;
    private _handlers: Set<IHandler>;

    constructor(public readonly name: string, private level = Levels.NOTSET) {
        super();
        this.name = name;
        this.level = checkLevel(level);
        this._handlers = new Set();
        this._propagate = true;
    }

    public get parent() {
        return this._parent;
    }

    public setParent(parent: ILogger): void {
        this._parent = parent;
    }

    public setLevel(level: LevelType) {
        this.level = checkLevel(level);
    }

    public addHandler(handler: IHandler): ILogger {
        if (!this._handlers.has(handler)) {
            this._handlers.add(handler);
        }
        return this;
    }

    public removeHandler(handler: IHandler): ILogger {
        this._handlers.delete(handler);
        return this;
    }

    public hasHandlers(): boolean {
        return this._handlers.size > 0;
    }

    public getHandlers(): IHandler[] {
        return Array.from(this._handlers);
    }

    public fatal(msg: string, exception?: any, extra?: TExtra) {
        this.log(Levels.FATAL, msg, exception, extra);
    }

    public critical(msg: string, exception?: any, extra?: TExtra) {
        this.log(Levels.CRITICAL, msg, exception, extra);
    }

    public error(msg: string, exception?: any, extra?: TExtra) {
        this.log(Levels.ERROR, msg, exception, extra);
    }

    public warn(msg: string, exception?: any, extra?: TExtra) {
        this.log(Levels.WARN, msg, exception, extra);
    }

    public warning(msg: string, exception?: any, extra?: TExtra) {
        this.log(Levels.WARN, msg, exception, extra);
    }

    public info(msg: string, extra?: TExtra) {
        this.log(Levels.INFO, msg, extra);
    }

    public debug(msg: string) {
        this.log(Levels.DEBUG, msg);
    }

    public exception(exception: any) {
        this.log(Levels.ERROR, exception.message, exception);
    }

    public log(level: number, msg: string, exception?: any, extra?: any): void {
        if (exception && !isException(exception)) {
            extra = exception;
            exception = undefined;
        }
        level = checkLevel(level);
        if (this._isEnabledFor(level)) {
            const now = new Date();
            this.handle({
                created: now,
                timestamp: Math.floor(now.getTime() / 1000),
                name: this.name,
                level,
                levelName: LEVEL_NAMES[level] as string,
                msg,
                exception,
                extra,
            });
        }
    }

    private _isEnabledFor(level: number) {
        if (this.manager && this.manager.disable > level) {
            return false;
        }
        return level >= this._getParentLevel();
    }

    private handle(record: IRecord) {
        if (this.filter(record)) {
            let p = this as Logger;
            while (p) {
                const handlers = p.getHandlers();
                for (const handler of handlers) {
                    if (record.level >= handler.level) {
                        handler.handle(record);
                    }
                }
                if (!p._propagate) {
                    break;
                }
                p = p.parent as Logger;
            }
        }
    }

    private _getParentLevel() {
        let logger = this as Logger;
        while (logger) {
            if (logger.level) {
                return logger.level;
            }
            logger = logger.parent as Logger;
        }
        return Levels.NOTSET;
    }
}


export class LoggerFactory implements ILoggerFactory {

    private _loggers: Map<string, ILogger>;

    constructor(level = Levels.NOTSET) {
        this._loggers = new Map();
        this._loggers.set(ROOT_LOGGER_NAME, new Logger(ROOT_LOGGER_NAME));
    }

    /**
     * Find logger by name. Create is not exits
     */
    public getLogger(name = ROOT_LOGGER_NAME): ILogger {
        if (!this._loggers.has(name)) {
            const logger = new Logger(name);
            this._fixTree(logger);
            logger.manager = this;
            this._loggers.set(name, logger);
        }
        return this._loggers.get(name) as ILogger;
    }

    public _fixTree(logger: ILogger): void {
        const parts = logger.name.replace('/', '.').split('.');
        while (parts.length) {
            parts.pop();
            const name = parts.join('.') || 'root';
            const parent = this._loggers.get(name);
            if (parent) {
                logger.setParent(parent);
                break;
            }
        }
        if (logger.parent) {
            for (const item of this._loggers.values()) {
                if (item.parent && item.parent === logger.parent) {
                    if (item.name.substr(0, logger.name.length) === logger.name) {
                        item.setParent(logger);
                    }
                }
            }
        }
    }
}
