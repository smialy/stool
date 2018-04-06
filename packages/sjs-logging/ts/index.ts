import {Manager} from './manager';
import { Logger } from './logger';

const manager = new Manager();

const logger = manager.getLogger();
export default logger;


export function getLogger(name: string): Logger {
    return manager.getLogger(name);
}

export {Filter, Filterer} from './filter';
export {Logger} from './logger';
export {Manager};
