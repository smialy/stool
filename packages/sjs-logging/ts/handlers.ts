import { IRecord, IFilter, IHandler } from './interfaces';
import { LEVELS } from './consts';
import { Filterer } from './filter';
import { checkLevel } from './utils';


export abstract class Handler extends Filterer implements IHandler {

    public level: number;
    /**
     * @param {number} [level=LEVELS.NOTSET]
     */
    constructor(level=LEVELS.NOTSET) {
        super();
        this.level = checkLevel(level);
    }
    setLevel(level: number){
        this.level = checkLevel(level);
    }
    /**
    * @param {Record} record
    */
    handle(record: IRecord) {
        if(this.filter(record)){
            this.emit(record);
            return true;
        }
        return false;
    }
    emit(record: IRecord) {}
    flush() {}
    close() {}
}

export class ConsoleHandler extends Handler {
    /**
     * @param {Record} record Log object with all collected data
     */
    emit(record: IRecord): void {
        console.log('[' + record.name + '] ::' + record.levelName + ':: ' + record.msg);
        if (record.exception) {
            console.error(record.exception);
        }
    }
}
