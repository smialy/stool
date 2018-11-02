declare global {
    interface SymbolConstructor {
      observable: symbol;
    }
}

export interface IObserver<T> {
    next(value: T): void;
    error(error: any): void;
    complete(): void;
}

export type ISubscriberFunction<T> = ((observer: IObserver<T>) => (() => void)|IStreamSubscription);

export interface IObserverListener<T> {
    onData(value: T): void;
    onError(error: any): void;
    onComplete(): void;
}

export interface IStreamSubscription {
    cancel(): void;
    // pause(): void;
    // resume: void;
}

export interface IStream<T> {

    listen(onData?: (value:T) => void, onError?: (error: any) => void, onComplete?: () => void): IStreamSubscription;
    listen(listener?: IObserverListener<T>): IStreamSubscription;

    map(fn: Function): IStream<T>;
    filter(fn: Function): IStream<T>;
    pipe(...fns: Function[]): IStream<T>;
}

export interface IControllerOptions {
    onListen?: Function;
    onCancel?: Function;
}
export interface IController<T> {

    add(value: T): void;
    addError(error: any): void;
    close(): void;

    stream: IStream<T>;
}

export interface IControlerSubscribe<T> extends IController<T> {
    _subscribe(listener: IObserverListener<T>): IStreamSubscription;
}