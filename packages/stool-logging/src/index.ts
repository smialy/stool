import { ILogger } from './interfaces';
export { IHandler, IFilter } from './interfaces';
export { Filter, Filterer } from './filter';
export { Logger } from './logger';
import { Manager } from './manager';
export { ILogger };

const manager = new Manager();

const logger = manager.getLogger();
export default logger;

export function getLogger(name: string): ILogger {
    return manager.getLogger(name);
}
