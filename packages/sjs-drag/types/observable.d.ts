export interface IObservable<T> {
    constructor(subscriber: ISubscriberFunction<T>): any;
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): ISubscription;
    subscribe(observer?: IObserver<T>): ISubscription;
}
export interface ISubscription {
    unsubscribe(): void;
    closed: boolean;
}
export declare type ISubscriberFunction<T> = (observer: ISubscriptionObserver<T>) => (() => void) | ISubscription;
export interface IObserver<T> {
    next(value: T): void;
    error(error: any): void;
    complete(): void;
}
export interface ISubscriptionObserver<T> {
    next(value: T): any;
    error(error: any): any;
    complete(): any;
    closed: Boolean;
}
