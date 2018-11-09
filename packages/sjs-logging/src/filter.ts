import { IFilter, IRecord } from './interfaces';

export type FilterFunction = (record: IRecord) => boolean;

export type FilterType = FilterFunction & IFilter;

export class Filter implements IFilter {

    private _name: string;

    constructor(name: string) {
        this._name = name;
    }
    /**
     * @param {Record} record
     */
    public filter(record: IRecord) {
        if (!this._name) {
            return true;
        }
        if (this._name === record.name) {
            return true;
        }
        if (record.name.indexOf(this._name) === 0) {
            return record.name[this._name.length] === '.';
        }
        return false;
    }
}

/**
 * Filters manager
 */
export class Filterer {

    private _filters: Set<FilterType>;

    constructor() {
        this._filters = new Set();
    }

    public addFilter(filter: FilterType): boolean {
        if (filter && (filter.filter || typeof filter === 'function')) {
            this._filters.add(filter);
            return true;
        }
        throw new Error('Expected Filter');
    }

    public removeFilter(filter: FilterType): void {
        this._filters.delete(filter);
    }

    public filter(record: IRecord): boolean {
        const status = true;
        for (const filter of this._filters) {
            const result = filter.filter ? filter.filter(record) : filter(record);
            if (!result) {
                return false;
            }
        }
        return status;
    }
}
