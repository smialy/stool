import { LEVELS } from './consts';
import { Filterer } from './filter';
import { checkLevel } from './utils';


export class Handler extends Filterer {

    /**
     * @param {number} [level=LEVELS.NOTSET]
     */
    constructor(level=LEVELS.NOTSET) {
        super();
        this.setLevel(level);
    }
    setLevel(level){
        this.level = checkLevel(level);
    }
    /**
    * @param {Record} record
    */
    handle(record) {
        if(this.filter(record)){
            this.emit(record);
            return true;
        }
        return false;
    }

    emit() {}
    flush() {}
    close() {}
}

export class ConsoleHandler extends Handler {
    /**
     * @param {Record} record Log object with all collected data
     */
    emit(record) {
        console.log('[' + record.name + '] ::' + record.levelName + ':: ' + record.msg);
        if (record.exception) {
            console.error(record.exception);
        }
    }
}
