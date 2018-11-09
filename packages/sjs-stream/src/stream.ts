import { IObserverListener, IStream, IStreamSubscription } from './interfaces';
import { enqueue, noop, runMethod, toObserver } from './utils';

type Func = () => any;

const STATE_INIT = 1;
const STATE_CLOSE = 2;
const STATE_FIRING = 4;
const STATE_CANCEL = 8;

export class BufferStreamSubscription<T> implements IStreamSubscription {

    private _state: number = STATE_INIT;
    private _buff: any[] = [];

    constructor(
        private _listener: IObserverListener<T>,
        private _cancelHandler?: (sub: any) => void,
    ) {}

    public _addData(data: T) {
        if (this._state & STATE_CANCEL) {
            return;
        }
        this._buff.push(new DataEvent<T>(data));
        this._flush();
    }
    public _addError(error: any): void {
        if (this._state & STATE_CANCEL) {
            return;
        }
        this._buff.push(new ErrorEvent<T>(error));
    }
    public _close() {
        this._buff.push(new CompleteEvent<T>());
        this._state |= STATE_CLOSE | STATE_CANCEL;
        runMethod(this._cancelHandler, this);
    }
    public _flush() {
        if (this._state & STATE_CANCEL) {
            return;
        }
        if (this._state & STATE_FIRING) {
            enqueue(() => this._flush());
            return;
        }
        this._state |= STATE_FIRING;
        const events = this._buff.concat();
        this._buff.length = 0;
        for (const event of events) {
            try {
                event.execute(this._listener);
            } catch (e) {
                console.error(e); /* tslint:disable-line */
            }
            if (this._state & STATE_CANCEL) {
                break;
            }
        }
        this._state &= ~STATE_FIRING;
    }

    public cancel() {
        if (this._state & ~STATE_CANCEL) {
            this._state |= STATE_CANCEL;
            runMethod(this._cancelHandler, this);
        }
    }
}

interface IEvent<T> {
    execute(listener: IObserverListener<T>): void;
}

class DataEvent<T> implements IEvent<T> {
    constructor(private data: T) {

    }
    public execute(listener: IObserverListener<T>): void {
        listener.onData(this.data);
    }
}

class ErrorEvent<T> implements IEvent<T> {
    constructor(private error: any) {

    }
    public execute(listener: IObserverListener<T>): void {
        listener.onError(this.error);
    }
}
class CompleteEvent<T> implements IEvent<T> {
    public execute(listener: IObserverListener<T>): void {
        listener.onComplete();
    }
}

export abstract class Stream<T> implements IStream<T> {

    public listen(
        listener?: IObserverListener<T>,
    ): IStreamSubscription;
    public listen(
        onData?: (value: T) => void,
        onError?: (error: any) => void,
        onComplete?: () => void,
    ): IStreamSubscription;
    public listen(
        onData?: IObserverListener<T> | ((value: T) => void),
        onError?: (error: any) => void,
        onComplete?: () => void,
    ) {
        const observer = toObserver(onData, onError, onComplete);
        return this._createSubscription(observer);
    }

    public _createSubscription(listener: IObserverListener<T>): IStreamSubscription {
        return new BufferStreamSubscription(listener);
    }

    public map(fn: () => void): IStream<T> {
        return new MapStream<T>(this, fn);
    }

    public filter(fn: () => void): IStream<T> {
        return new FilterStream<T>(this, fn);
    }

    public pipe(...fns: Array<() => void>): IStream<T> {
        return new PipeStream<T>(this, fns);
    }
}

class ForwardStream<T> extends Stream<T> {
    protected _source: IStream<T>;

    constructor(source: IStream<T>) {
        super();
        this._source = source;
    }
    public listen(listener?: IObserverListener<T>): IStreamSubscription;
    public listen(
        onData?: (value: T) => void,
        onError?: (error: any) => void,
        onComplete?: () => void,
    ): IStreamSubscription;
    public listen(
        onData?: IObserverListener<T> | ((value: T) => void),
        onError?: (error: any) => void,
        onComplete?: () => void,
    ) {
        const observer = toObserver(onData, onError, onComplete);
        return this._source.listen(
            (value: T) => this._handleNext(value, observer),
            (error: any) => this._handleError(error, observer),
            () => this._handleComplete(observer),
        );
    }
    public _handleNext(value: T, observer: IObserverListener<T>) {
        observer.onData(value);
    }
    public _handleError(error: any, observer: IObserverListener<T>) {
        observer.onError(error);
    }
    public _handleComplete(observer: IObserverListener<T>) {
        observer.onComplete();
    }
}

class PipeStream<T> extends ForwardStream<T> {

    private _pipe: (input: any) => any;

    constructor(source: IStream<T>, methods: Func[]) {
        super(source);
        this._pipe = (input: any): any => methods.reduce((prev: any, fn: (val: any) => void) => fn(prev), input as any);
    }
    public _handleNext(value: T, observer: IObserverListener<T>) {
        observer.onData(this._pipe(value));
    }
}

class MapStream<T> extends ForwardStream<T> {

    private _method: (input: any) => any;

    constructor(source: IStream<T>, method: () => void) {
        super(source);
        this._method = method;
    }
    public _handleNext(value: T, observer: IObserverListener<T>) {
        observer.onData(this._method(value));
    }
}

class FilterStream<T> extends ForwardStream<T> {
    private _method: (input: any) => any;

    constructor(source: IStream<T>, method: () => void) {
        super(source);
        this._method = method;
    }

    public _handleNext(value: T, observer: IObserverListener<T>) {
        if (this._method(value)) {
            observer.onData(this._method(value));
        }
    }
}
