import { Observable } from '../zen-observable';
const noop = () => { };
function toObserver(next, error, complete) {
    if (typeof next === 'function') {
        return {
            next,
            error: error || noop,
            complete: complete || noop
        };
    }
    return Object.assign({
        next: noop,
        error: noop,
        complete: noop
    }, next || {});
}
export class StreamController {
    constructor(options = {}) {
        this._streams = new Set();
        this._onListen = options.onListen || noop;
        this._onCancel = options.onCancel || noop;
    }
    add(value) {
        for (const stream of this._streams) {
            stream._next(value);
        }
    }
    addError(error) {
        for (const stream of this._streams) {
            stream._error(error);
        }
    }
    close() {
        for (const stream of this._streams) {
            stream._complete();
        }
    }
    onListen(stream) {
        this._streams.add(stream);
        if (this._streams.size === 1) {
            this._onListen();
        }
    }
    onClose(stream) {
        this._streams.delete(stream);
        if (this._streams.size === 0) {
            this._onCancel();
        }
    }
    get stream() {
        return new ControllerStream(this);
    }
}
export class Stream {
    constructor(subscriber) {
        this._subscriber = subscriber;
    }
    subscribe(next, error, done) {
        if (!this._observable) {
            this._observable = new Observable(this._subscriber);
        }
        return this._observable.subscribe(toObserver(next, error, done));
    }
    map(fn) {
        return new MapStream(this, fn);
    }
    filter(fn) {
        return new FilterStream(this, fn);
    }
    pipe(...fns) {
        return new PipeStream(this, fns);
    }
}
class ForwardStream extends Stream {
    constructor(source) {
        super();
        this._source = source;
    }
    subscribe(next, error, complete) {
        const observer = toObserver(next, error, complete);
        return this._source.subscribe((value) => this._handleNext(value, observer), (error) => this._handleError(error, observer), () => this._handleComplete(observer));
    }
    _handleNext(value, observer) {
        observer.next(value);
    }
    _handleError(error, observer) {
        observer.error(error);
    }
    _handleComplete(observer) {
        observer.complete();
    }
}
class PipeStream extends ForwardStream {
    constructor(source, methods) {
        super(source);
        this._pipe = input => methods.reduce((prev, fn) => fn(prev), input);
    }
    _handleNext(value, observer) {
        observer.next(this._pipe(value));
    }
}
class MapStream extends ForwardStream {
    constructor(source, method) {
        super(source);
        this._method = method;
    }
    _handleNext(value, observer) {
        observer.next(this._method(value));
    }
}
class FilterStream extends ForwardStream {
    constructor(source, method) {
        super(source);
        this._method = method;
    }
    _handleNext(value, observer) {
        if (this._method(value)) {
            observer.next(this._method(value));
        }
    }
}
class FakeProducer {
    next(value) { }
    ;
    error(error) { }
    ;
    complete() { }
    ;
}
class ControllerStream extends Stream {
    constructor(controller) {
        super(noop);
        this._observable = null;
        this._producer = new FakeProducer();
        this._controller = controller;
    }
    subscribe(next, error, done) {
        if (this._observable === null) {
            this._observable = new Observable((producer) => {
                this._producer = producer;
                this.onListen();
                return () => this.onClose();
            });
        }
        return this._observable.subscribe(toObserver(next, error, done));
    }
    _next(value) {
        this._producer.next(value);
    }
    _error(error) {
        this._producer.error(error);
    }
    _complete() {
        this._producer.complete();
    }
    onListen() {
        this._controller.onListen(this);
    }
    onClose() {
        this._controller.onClose(this);
    }
}
export function fromEvents(element, eventName) {
    return new Stream(observer => {
        const handler = (event) => observer.next(event);
        element.addEventListener(eventName, handler, false);
        return () => element.removeEventListener(eventName, handler, false);
    });
}
