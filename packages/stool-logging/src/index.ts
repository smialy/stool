import { ILogger } from './interfaces';
export { IHandler, IFilter } from './interfaces';
export { Filter, Filterer } from './filter';
export { Logger } from './logger';
export { BaseHandler, ConsoleHandler } from './handlers';
import { Manager } from './manager';
export { ILogger };

const manager = new Manager();

export function getLogger(name?: string): ILogger {
    return manager.getLogger(name);
}
