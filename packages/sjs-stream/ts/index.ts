import { IStream } from './interfaces';
import { Stream } from './stream';
import { EventController, StreamController } from './controller';

export {
    Stream, StreamController, EventController
};


export function fromItem(input: any){
    if(isPromise(input)) {
        return fromPromise(input);
    }
    if(isIterator(input)) {
        return fromIterator(input);
    }
    if(isArrayLike(input)) {
        return fromArray(input);
    }
    if(isObservable(input)) {
        return fromObservable(input);
    }
    if(isFunction(input)) {
        return fromFunction(input);
    }
}

function isPromise(value: any): value is Promise<any> {
    return value && typeof (value as any).then === 'function';
}
function isArrayLike<T>(value: any): value is ArrayLike<T> {
    return value && typeof value.length === 'number';
}
function isIterator(value: any): value is Iterable<any> {
    return value && typeof value[Symbol.iterator] === 'function';
}
function isObservable(value: any): boolean {
    return value && typeof value[Symbol.observable] === 'function';
}
function isFunction(value: any): boolean {
    return value && typeof value === 'function';
}

export function fromFunction<T>(subscriber: (controller: StreamController<T>) => (Function|void)): IStream<T> {
    let closeHandler: Function|void;
    let controller = new StreamController<T>({
        onListen(){
            closeHandler = subscriber(controller);
        },
        onCancel(){
            if(typeof closeHandler === 'function'){
                closeHandler();
            }
            closeHandler = undefined;
        }
    });
    return controller.stream;
}

export function fromObservable<T>(input: any){
    return fromFunction<T>(controller => {
        const obs = input[Symbol.observable]();
        obs.subscribe({
            next(data: T){
                controller.add(data);
            },
            error(err: any) {
                controller.addError(err);
            },
            complete() {
                controller.close();
            }
        });
    });
}
export function fromArray<T>(array: ArrayLike<T>){
    return fromFunction(controller => {
        for (let i = 0, len = array.length; i < len; i+=1) {
            controller.add(array[i]);
        }
        controller.close();
    });
}

export function fromPromise<T>(promise: Promise<T>) {
    return fromFunction(controller => {
        promise.then((data:T) => controller.add(data));
        promise.catch((error:any) => controller.addError(error));
        promise.finally(() => controller.close());
    });
}

export function fromIterator<T>(items: Iterable<T>) {
    return fromFunction(controller => {
        for (let item of items) {
            controller.add(item);
        }
        controller.close();
    });
}

export function fromEvents(element: HTMLElement, eventName: string){
    return fromFunction(controller => {
        const handler = (event:any) => controller.add(event);
        element.addEventListener(eventName, handler, false);
        return () => element.removeEventListener(eventName, handler, false);
    });
}