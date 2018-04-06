import { IRecord, IFilter } from './interfaces';
export interface FilterFunction {
    (record: IRecord): boolean;
}
export declare type FilterType = FilterFunction & IFilter;
/**
 * Base class for all filters
 */
export declare class Filter implements IFilter {
    private _name;
    constructor(name: string);
    /**
     * @param {Record} record
   * @abstract
     */
    filter(record: IRecord): boolean;
}
/**
 * Filters manager
 */
export declare class Filterer {
    private _filters;
    constructor();
    /**
     * @param {Filter} filter
     */
    addFilter(filter: FilterType): boolean;
    /**
     * @param {Filter} filter
     */
    removeFilter(filter: FilterType): void;
    /**
     * @param {Record} record
     * @return {boolean}
      */
    filter(record: IRecord): boolean;
}
