import { Logger } from './logger';
export declare class Manager {
    disable: number;
    private _loggers;
    private _root;
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
