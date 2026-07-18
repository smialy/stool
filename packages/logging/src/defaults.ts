import { ILogger } from './types';
import { LoggerFactory } from './logger';

const NAME: unique symbol = Symbol('global.stool.logger.factory');

type GlobalWithFactory = { [NAME]: LoggerFactory };
const _global = globalThis as unknown as GlobalWithFactory;

if (!_global[NAME]) {
    _global[NAME] = new LoggerFactory();
}

export function getLogger(name?: string): ILogger {
    return _global[NAME].getLogger(name);
}