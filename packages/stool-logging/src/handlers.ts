import { LEVELS } from './consts';
import { Filterer } from './filter';
import { IHandler, IRecord } from './interfaces';
import { checkLevel } from './utils';

export abstract class Handler extends Filterer implements IHandler {

    constructor(public level = LEVELS.NOTSET) {
        super();
        this.level = checkLevel(level);
    }
    public setLevel(level: number) {
        this.level = checkLevel(level);
    }
    public handle(record: IRecord) {
        if (this.filter(record)) {
            this.emit(record);
            return true;
        }
        return false;
    }
    public emit(record: IRecord) { // eslint-disable-line no-unused-vars
    }
    public flush() { /* noopa */ }
    public close() { /* noopa */}
}

export class ConsoleHandler extends Handler {
    public emit(record: IRecord): void {
        /* tslint:disable-next-line */
        console.log(`[${record.name}]::${record.levelName}:: ${record.msg}`);
        if (record.exception) {
            /* tslint:disable-next-line */
            console.error(record.exception);
        }
    }
}
