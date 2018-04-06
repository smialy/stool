import { IRecord, IHandler } from './interfaces';
import { Filterer } from './filter';
export declare abstract class Handler extends Filterer implements IHandler {
    level: number;
    /**
     * @param {number} [level=LEVELS.NOTSET]
     */
    constructor(level?: number);
    setLevel(level: number): void;
    /**
    * @param {Record} record
    */
    handle(record: IRecord): boolean;
    emit(record: IRecord): void;
    flush(): void;
    close(): void;
}
export declare class ConsoleHandler extends Handler {
    /**
     * @param {Record} record Log object with all collected data
     */
    emit(record: IRecord): void;
}
