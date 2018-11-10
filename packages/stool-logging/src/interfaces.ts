
export interface IRecord {
    readonly name: string;
    readonly levelName: string;
    readonly level: number;
    readonly msg: string;
    readonly exception: any;
}

export interface IFilter {
    filter(record: IRecord): boolean;
}

export interface IHandler {
    readonly level: number;
    handle(record: IRecord): void;
    emit(record: IRecord): void;
    flush(): void;
    close(): void;
}
