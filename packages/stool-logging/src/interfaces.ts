export interface IRecord {
    readonly name: string;
    readonly level: number;
    readonly levelName?: string;
    readonly msg?: string;
    readonly exception?: any;
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

export interface ILogger {
    readonly name: string;
    readonly parent?: ILogger;

    setParent(parent: ILogger): void;
    setLevel(level: number): void;
    addHandler(handler: IHandler): ILogger;
    removeHandler(handler: IHandler): ILogger;
    hasHandlers(): boolean;
    getHandlers(): IHandler[];
    fatal(msg: string, exception?: any): void;
    critical(msg: string, exception?: any): void;
    error(msg: string, exception?: any): void;
    warn(msg: string, exception?: any): void;
    warning(msg: string, exception?: any): void;
    info(msg: string): void;
    debug(msg: string): void;
    exception(exception: any): void;
    log(level: number, msg: string, exception?: any): void;
}
