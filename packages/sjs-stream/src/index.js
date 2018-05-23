import { Stream } from './stream';
import { EventController, StreamController } from './controller';
export { Stream, StreamController, EventController };
export function fromItem(input) {
    if (isPromise(input)) {
        return fromPromise(input);
    }
    if (isIterator(input)) {
        return fromIterator(input);
    }
    if (isArrayLike(input)) {
        return fromArray(input);
    }
    if (isObservable(input)) {
        return fromObservable(input);
    }
    if (isFunction(input)) {
        return fromFunction(input);
    }
}
function isPromise(value) {
    return value && typeof value.then === 'function';
}
function isArrayLike(value) {
    return value && typeof value.length === 'number';
}
function isIterator(value) {
    return value && typeof value[Symbol.iterator] === 'function';
}
function isObservable(value) {
    return value && typeof value[Symbol.observable] === 'function';
}
function isFunction(value) {
    return value && typeof value === 'function';
}
export function fromFunction(subscriber) {
    let closeHandler;
    let controller = new StreamController({
        onListen() {
            closeHandler = subscriber(controller);
        },
        onCancel() {
            if (typeof closeHandler === 'function') {
                closeHandler();
            }
            closeHandler = undefined;
        }
    });
    return controller.stream;
}
export function fromObservable(input) {
    return fromFunction(controller => {
        const obs = input[Symbol.observable]();
        obs.subscribe({
            next(data) {
                controller.add(data);
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
export function fromArray(array) {
    return fromFunction(controller => {
        for (let i = 0, len = array.length; i < len; i += 1) {
            controller.add(array[i]);
        }
        controller.close();
    });
}
export function fromPromise(promise) {
    return fromFunction(controller => {
        promise.then((data) => controller.add(data));
        promise.catch((error) => controller.addError(error));
        promise.finally(() => controller.close());
    });
}
export function fromIterator(items) {
    return fromFunction(controller => {
        for (let item of items) {
            controller.add(item);
        }
        controller.close();
    });
}
export function fromEvents(element, eventName) {
    return fromFunction(controller => {
        const handler = (event) => controller.add(event);
        element.addEventListener(eventName, handler, false);
        return () => element.removeEventListener(eventName, handler, false);
    });
}
