import { ILogger } from './types';
import { LoggerFactory } from './logger';

const symbol = Symbol('logger-factory');


if (!globalThis[symbol]) {
    globalThis[symbol] = new LoggerFactory();
}

export function getLogger(name?: string): ILogger {
    return globalThis[symbol].getLogger(name);
}