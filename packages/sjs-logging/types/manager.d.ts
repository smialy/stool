import { Logger } from './logger';
export declare class Manager {
    private _loggers;
    private _root;
    disable: number;
    constructor(root?: null, level?: number);
    setDisable(level: number): void;
    /**
     * Find logger by name. Create is not exits
     *
     * @param {string} [name='root'] name
     * @return {Logger}
     */
    getLogger(name?: string): Logger;
    _fixTree(logger: Logger): void;
}
