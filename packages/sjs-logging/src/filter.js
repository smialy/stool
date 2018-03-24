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
 * Base class for all filters
 */
export class Filter {

    constructor(name){
        this._name = name;
    }
    /**
     * @param {Record} record
   * @abstract
     */
    filter(record) {
        if(!this._name){
            return true;
        }
        if(this._name == record.name){
            return true;
        }
        if(record.name.indexOf(this._name) === 0){
            return record.name[this._name.length] === '.';
        }
        return false;
    }
}


/**
 * Filters manager
 */
export class Filterer {

    constructor(){
        this._filters = new Set();
    }

    /**
     * @param {Filter} filter
     */
    addFilter(filter) {
        if(filter && (filter.filter || typeof filter === 'function')){
            this._filters.add(filter);
            return true;
        }
        throw new Error('Expected Filter');
    }

    /**
     * @param {Filter} filter
     */
    removeFilter(filter) {
        this._filters.delete(filter);
    }

    /**
     * @param {Record} record
     * @return {boolean}
      */
    filter(record) {
        let status = true;
        for(let filter of this._filters){
            let result = filter.filter ? filter.filter(record): filter(record);
            if(!result){
                return false;
            }
        }
        return status;
    }
}
