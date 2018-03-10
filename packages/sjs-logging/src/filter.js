import {LEVEL_TO_MASK} from './consts';

/**
 * @typedef {Object} Record
 * @param {string} name
 * @param {number} level
 * @param {string} levelName
 * @param {number} mask
 * @param {string} msg
 * @param {Error} ex
	 */

/**
 * Base logger
 */
export class Mask{

	constructor(){
		this._mask = 0;
	}

	/**
	* Setter for level [set level()]
	*
	* @param {number} level
	*/
	set level(level) {
		this._mask = LEVEL_TO_MASK(level);
	}
	/**
	* Getter for level [get level()]
	*
	* @return {number} level
	*/
	get level() {
		return null;
	}
	/**
	* Getter for mask [get mask()]
	*
	* @return {number} mask
	*/
	get mask() {
		return this._mask;
	}
	/**
	* Setter for mask [set mask()]
	*
	* @param {number} mask
	*/
	set mask(mask) {
		this._mask = mask;
	}
}

/**
 * Base class for all filtrs
 */
export class Filter{

	/**
	 * @param {Record} record
   * @abstract
	 */
	filter(record) {
		throw new Error('Not implement Filter.filter(record)');
	}
}

/**
 * Filters manager
 */
export class Filterer extends Mask{

	constructor(){
		super();
		this._filters = [];
	}

	/**
	 * @param {Filter} filter
	 */
	addFilter(filter) {
		if (!(filter instanceof Filter)) {
			throw new Error('Excpected Filter');
		}
		if(this._filters.indexOf(filter) === -1){
			this._filters.push(filter);
		}
	}

	/**
	 * @param {Filter} filter
	 */
	removeFilter(filter) {
		this._filters.remove(filter);
	}

	/**
	 * @param {Record} record
	 * @return {boolean}
 	 */
	filter(record) {
	}
}
