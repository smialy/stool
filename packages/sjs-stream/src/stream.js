import { toObserver, runMethod, enqueue } from './utils';
const STATE_INIT = 1;
const STATE_CLOSE = 2;
const STATE_FIRING = 4;
const STATE_CANCEL = 8;
export class BufferStreamSubscription {
    constructor(_listener, _cancelHandler) {
        this._listener = _listener;
        this._cancelHandler = _cancelHandler;
        this._state = STATE_INIT;
        this._buff = [];
    }
    _addData(data) {
        if (this._state & STATE_CANCEL) {
            return;
        }
        this._buff.push(new DataEvent(data));
        this._flush();
    }
    _addError(error) {
        if (this._state & STATE_CANCEL) {
            return;
        }
        this._buff.push(new ErrorEvent(error));
    }
    _close() {
        this._buff.push(new CompleteEvent());
        this._state |= STATE_CLOSE | STATE_CANCEL;
        runMethod(this._cancelHandler, this);
    }
    _flush() {
        if (this._state & STATE_CANCEL) {
            return;
        }
        if (this._state & STATE_FIRING) {
            enqueue(() => this._flush());
            return;
        }
        this._state |= STATE_FIRING;
        let events = this._buff.concat();
        this._buff.length = 0;
        for (let event of events) {
            try {
                event.execute(this._listener);
            }
            catch (e) {
                console.error(e);
            }
            if (this._state & STATE_CANCEL) {
                break;
            }
        }
        this._state &= ~STATE_FIRING;
    }
    cancel() {
        if (this._state & ~STATE_CANCEL) {
            this._state |= STATE_CANCEL;
            runMethod(this._cancelHandler, this);
        }
    }
}
class DataEvent {
    constructor(data) {
        this.data = data;
    }
    execute(listener) {
        listener.onData(this.data);
    }
}
class ErrorEvent {
    constructor(error) {
        this.error = error;
    }
    execute(listener) {
        listener.onError(this.error);
    }
}
class CompleteEvent {
    execute(listener) {
        listener.onComplete();
    }
}
export class Stream {
    listen(onData, onError, onComplete) {
        const observer = toObserver(onData, onError, onComplete);
        return this._createSubscription(observer);
    }
    _createSubscription(listener) {
        return new BufferStreamSubscription(listener);
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
    listen(onData, onError, onComplete) {
        const observer = toObserver(onData, onError, onComplete);
        return this._source.listen((value) => this._handleNext(value, observer), (error) => this._handleError(error, observer), () => this._handleComplete(observer));
    }
    _handleNext(value, observer) {
        observer.onData(value);
    }
    _handleError(error, observer) {
        observer.onError(error);
    }
    _handleComplete(observer) {
        observer.onComplete();
    }
}
class PipeStream extends ForwardStream {
    constructor(source, methods) {
        super(source);
        this._pipe = (input) => methods.reduce((prev, fn) => fn(prev), input);
    }
    _handleNext(value, observer) {
        observer.onData(this._pipe(value));
    }
}
class MapStream extends ForwardStream {
    constructor(source, method) {
        super(source);
        this._method = method;
    }
    _handleNext(value, observer) {
        observer.onData(this._method(value));
    }
}
class FilterStream extends ForwardStream {
    constructor(source, method) {
        super(source);
        this._method = method;
    }
    _handleNext(value, observer) {
        if (this._method(value)) {
            observer.onData(this._method(value));
        }
    }
}
