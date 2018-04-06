import { IRecord, IFilter } from './interfaces';


export interface FilterFunction {
    (record: IRecord): boolean
}

export type FilterType = FilterFunction & IFilter;

/**
 * Base class for all filters
 */
export class Filter implements IFilter{

    private _name: string;

    constructor(name: string){
        this._name = name;
    }
    /**
     * @param {Record} record
   * @abstract
     */
    filter(record: IRecord) {
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

    private _filters: Set<FilterType>

    constructor(){
        this._filters = new Set();
    }

    /**
     * @param {Filter} filter
     */
    addFilter(filter: FilterType) {
        if(filter && (filter.filter || typeof filter === 'function')){
            this._filters.add(filter);
            return true;
        }
        throw new Error('Expected Filter');
    }

    /**
     * @param {Filter} filter
     */
    removeFilter(filter: FilterType) {
        this._filters.delete(filter);
    }

    /**
     * @param {Record} record
     * @return {boolean}
      */
    filter(record: IRecord) {
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
