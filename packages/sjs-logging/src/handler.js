import { LEVELS } from './consts';
import { Filterer } from './filter';

export class Handler extends Filterer{

  /**
	 * @param {number} [level=LEVELS.ALL]
	 */
	constructor(level=LEVELS.ALL){
		super();
		this.level = level;
	}
	/**
	* @param {Record} record
	*/
	handle(record) {

	}
}

export class ConsoleHandler extends Handler{
	/**
	 * @param {Record} record Log object with all collected data
	 */
	handle(record) {
		console.log('[' + record.name + '] ::' + record.levelName + ':: ' + record.msg);
		if (record.ex) {
			console.error(record.ex);
		}
	}
}
