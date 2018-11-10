import { IObserverListener } from './interfaces';
export declare const noop: () => void;
export declare function toObserver<T>(onData?: IObserverListener<T> | ((value: T) => void), onError?: (error: any) => void, onComplete?: () => void): IObserverListener<T>;
export declare function runMethod(method?: (inputs?: any[]) => void, ...args: any[]): void;
export declare function enqueue(fn: () => void): void;
