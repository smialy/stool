import { IStream, IControlerSubscribe, IStreamSubscription, IControllerOptions, IObserverListener } from './interfaces';
export declare class StreamController<T> implements IControlerSubscribe<T> {
    private _state;
    private _subscription;
    private _options;
    constructor(options?: IControllerOptions);
    add(value: T): void;
    addError(error: any): void;
    close(): void;
    readonly stream: IStream<T>;
    _subscribe(listener: IObserverListener<T>): IStreamSubscription;
}
export declare class EventController<T> implements IControlerSubscribe<T> {
    private _state;
    private _subscriptions;
    private _options;
    constructor(options: IControllerOptions);
    add(value: T): void;
    addError(error: any): void;
    close(): void;
    readonly stream: IStream<T>;
    _subscribe(listener: IObserverListener<T>): IStreamSubscription;
}
