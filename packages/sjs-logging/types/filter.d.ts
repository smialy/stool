import { IFilter, IRecord } from './interfaces';
export declare type FilterFunction = (record: IRecord) => boolean;
export declare type FilterType = FilterFunction & IFilter;
export declare class Filter implements IFilter {
    private _name;
    constructor(name: string);
    /**
     * @param {Record} record
     */
    filter(record: IRecord): boolean;
}
/**
 * Filters manager
 */
export declare class Filterer {
    private _filters;
    constructor();
    addFilter(filter: FilterType): boolean;
    removeFilter(filter: FilterType): void;
    filter(record: IRecord): boolean;
}
