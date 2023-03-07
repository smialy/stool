import { ILogger } from './types';
import { LoggerFactory } from './logger';

const NAME = Symbol('global.stool.logger.factory');


if (!globalThis[NAME]) {
    globalThis[NAME] = new LoggerFactory();
}

export function getLogger(name?: string): ILogger {
    return globalThis[NAME].getLogger(name);
}