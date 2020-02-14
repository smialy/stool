declare global {
    interface ISymbolConstructor {
      readonly observable: symbol;
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

type Func = () => void;

export interface IStream<T> {

    listen(onData?: (value: T) => void, onError?: (error: any) => void, onComplete?: () => void): IStreamSubscription;
    listen(listener?: IObserverListener<T>): IStreamSubscription;

    map(fn: () => void): IStream<T>;
    filter(fn: () => void): IStream<T>;
    pipe(...fns: (() => void)[]): IStream<T>;
}

export interface IControllerOptions {
    onListen?: () => void;
    onCancel?: () => void;
}
export interface IController<T> {

    stream: IStream<T>;

    add(value: T): void;
    addError(error: any): void;
    close(): void;
}

export interface IControlerSubscribe<T> extends IController<T> {
    _subscribe(listener: IObserverListener<T>): IStreamSubscription;
}
