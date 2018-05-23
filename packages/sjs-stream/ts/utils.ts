import { IObserverListener } from './interfaces';


export const noop = () => {};

export function toObserver<T>(
    onData?: IObserverListener<T> | ((value:T) => void),
    onError?: (error: any) => void,
    onComplete?: () => void): IObserverListener<T> {
    if(typeof onData === 'function'){
        return {
            onData,
            onError: onError || noop,
            onComplete: onComplete || noop
        };
    }
    return Object.assign({
        onData: noop,
        onError: noop,
        onComplete: noop
    }, onData || {});
}

export function runMethod(method?:Function, ...args:any[]){
    if(typeof method === 'function'){
        try{
            method(...args);
        } catch (e){
            console.error(e);
        }
    }
}

export function enqueue(fn: Function) {
    Promise.resolve().then(() => {
        try {
            fn()
        } catch (e) {
            console.error(e);
        }
    });
}
