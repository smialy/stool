import { IObserverListener, IStream, IStreamSubscription } from './interfaces';
export declare class BufferStreamSubscription<T> implements IStreamSubscription {
    private _listener;
    private _cancelHandler?;
    private _state;
    private _buff;
    constructor(_listener: IObserverListener<T>, _cancelHandler?: ((sub: any) => void) | undefined);
    _addData(data: T): void;
    _addError(error: any): void;
    _close(): void;
    _flush(): void;
    cancel(): void;
}
export declare abstract class Stream<T> implements IStream<T> {
    listen(listener?: IObserverListener<T>): IStreamSubscription;
    listen(onData?: (value: T) => void, onError?: (error: any) => void, onComplete?: () => void): IStreamSubscription;
    _createSubscription(listener: IObserverListener<T>): IStreamSubscription;
    map(fn: () => void): IStream<T>;
    filter(fn: () => void): IStream<T>;
    pipe(...fns: Array<() => void>): IStream<T>;
}
