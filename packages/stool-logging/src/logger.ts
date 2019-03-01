import { LEVEL_NAMES, LEVELS } from './consts';
import { Filterer } from './filter';
import { Handler } from './handlers';
import { IHandler, IRecord } from './interfaces';
import { checkLevel } from './utils';

export class Logger extends Filterer {
    public manager?: any;
    public parent?: Logger;

    private _propagate: boolean;
    private _handlers: Set<IHandler>;

    constructor(public readonly name: string, private level= LEVELS.NOTSET) {
        super();
        this.name = name;
        this.level = checkLevel(level);
        this._handlers = new Set();
        this._propagate = true;
    }

    public setLevel(level: number) {
        this.level = checkLevel(level);
    }

    public addHandler(handler: IHandler) {
        if (!(handler instanceof Handler)) {
            throw new Error('Expected @stool/logging.Handler');
        }
        if (!this._handlers.has(handler)) {
            this._handlers.add(handler);
        }
        return this;
    }

    public removeHandler(handler: IHandler) {
        this._handlers.delete(handler);
        return this;
    }

    public hasHandlers() {
        return this._handlers.size;
    }

    public getHandlers(): IHandler[] {
        return Array.from(this._handlers);
    }

    public fatal(msg: string, exception?: any) {
        this.log(LEVELS.FATAL, msg, exception);
    }
    public critical(msg: string, exception?: any) {
        this.log(LEVELS.CRITICAL, msg, exception);
    }

    public error(msg: string, exception?: any) {
        this.log(LEVELS.ERROR, msg, exception);
    }

    public warn(msg: string, exception?: any) {
        this.log(LEVELS.WARN, msg, exception);
    }

    public warning(msg: string, exception?: any) {
        this.log(LEVELS.WARN, msg, exception);
    }

    public info(msg: string) {
        this.log(LEVELS.INFO, msg);
    }

    public debug(msg: string) {
        this.log(LEVELS.DEBUG, msg);
    }

    public exception(exception: any) {
        this.log(LEVELS.ERROR, exception.message, exception);
    }

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
                if (!p._propagate) {
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
