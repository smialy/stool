


function fromInput(input, scheduler=null){
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
        return fromObservableFunction(input);
    }
}

declare global {
    interface SymbolConstructor {
      observable: symbol;
    }
  }

const observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';


function isPromise(value: any): value is PromiseLike<any> {
    return value && typeof (value as any).then === 'function';
}
function isArrayLike<T>(value: any): value is ArrayLike<T> {
    return value && typeof value.length === 'number';
}
function isIterator(value: any): value is Iterable<any> {
    return value && typeof value[Symbol.iterator] === 'function';
}
export function isObservable(value: any): boolean {
    return value && typeof value[Symbol.observable] === 'function';
}
export function isFunction(value: any): boolean {
    return value && typeof value === 'function';
}



function fromObservableFunction(subscriber){
    let closeHandler;
    let controller = new StreamController({
        onListen(){
            closeHandler = subscriber(controller);
        },
        onCancel(){
            closeHandler();
        }
    });
    return controller;
}
function fromObservable(input){
    return StreamController.from(controller => {
        const obs = input[Symbol.observable]();
        obs.subscribe({
            next(data){
                controller.addData(data);
            },
            error(err) {
                controller.addError(err);
            },
            complete() {
                controller.close();
            }
        });
    });
}
function fromArray(array){
    return StreamController.from(controller => {
        for (let i = 0, len = array.length; i < len; i+=1) {
            controller.addData(array[i]);
        }
        controller.close();
    });
}

function fromPromise(promise) {
    return StreamController.from(controller => {
        promise.then(data => controller.addData(data));
        promise.catch(error => controller.addError(error));
        promise.finally(data => controller.close());
    });
}

function fromIterator(items) {
    return StreamController.from(controller => {
        for (let item of items) {
            controller.addData(item);
        }
        controller.close();
    });
}

