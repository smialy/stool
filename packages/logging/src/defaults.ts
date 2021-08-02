import { ILogger } from './types';
import { LoggerFactory } from './logger';

const NAME = 'global-logger-factory';


if (!globalThis[NAME]) {
    globalThis[NAME] = new LoggerFactory();
}

export function getLogger(name?: string): ILogger {
    return globalThis[NAME].getLogger(name);
}