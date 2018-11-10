import { Filterer } from './filter';
import { IHandler, IRecord } from './interfaces';
export declare abstract class Handler extends Filterer implements IHandler {
    level: number;
    constructor(level?: number);
    setLevel(level: number): void;
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
