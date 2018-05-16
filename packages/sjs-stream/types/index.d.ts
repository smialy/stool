import { ISubscription, IObserver, ISubscriberFunction } from './observable';
export interface IStream<T> {
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): ISubscription;
    subscribe(observer?: IObserver<T>): ISubscription;
    map(fn: Function): IStream<T>;
    filter(fn: Function): IStream<T>;
    pipe(...fns: Function[]): IStream<T>;
}
export declare class StreamController<T> {
    private _streams;
    private _onListen;
    private _onCancel;
    constructor(options?: {
        onListen?: Function;
        onCancel?: Function;
    });
    add(value: T): void;
    addError(error: any): void;
    close(): void;
    onListen(stream: IStream<T>): void;
    onClose(stream: IStream<T>): void;
    readonly stream: IStream<T>;
}
export declare class Stream<T> implements IStream<T> {
    private _subscriber;
    private _observable;
    constructor(subscriber?: ISubscriberFunction<T>);
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): ISubscription;
    subscribe(observer?: IObserver<T>): ISubscription;
    map(fn: Function): IStream<T>;
    filter(fn: Function): IStream<T>;
    pipe(...fns: Function[]): IStream<T>;
}
export declare function fromEvents(element: HTMLElement, eventName: string): Stream<{}>;
