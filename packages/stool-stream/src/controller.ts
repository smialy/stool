import { IControlerSubscribe, IControllerOptions, IObserverListener, IStream, IStreamSubscription } from './interfaces';
import { BufferStreamSubscription, Stream } from './stream';
import { noop, runMethod } from './utils';

const STATE_INIT = 1;
const STATE_CLOSED = 2;

const defaultOptions = {
    onListen() {/**/},
    onCancel() {/**/},
};

export class StreamController<T> implements IControlerSubscribe<T> {

    private _state: number = STATE_INIT;
    private _subscription: BufferStreamSubscription<T> | null = null;
    private _options: IControllerOptions = {};

    constructor(options: IControllerOptions= {}) {
        this._options = Object.assign({}, options, defaultOptions);
    }

    public add(value: T) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot add() after close.');
        }
        if (this._subscription) {
            this._subscription._addData(value);
        }
    }

    public addError(error: any) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot addError() after close.');
        }
        if (this._subscription) {
            this._subscription._addError(error);
        }
    }

    public close(): void {
        if (this._state & STATE_CLOSED) {
            return;
        }
        if (this._subscription) {
            this._subscription._close();
        }
    }

    get stream(): IStream<T> {
        return new ControllerStream<T>(this);
    }

    public _subscribe(listener: IObserverListener<T>): IStreamSubscription {
        if (this._subscription !== null) {
            throw new Error('Stream has already was listen.');
        }
        this._subscription = new BufferStreamSubscription(listener, () => {
            this._subscription = null;
            runMethod(this._options.onCancel);
        });
        runMethod(this._options.onListen);
        return this._subscription;
    }
}

export class EventController<T> implements IControlerSubscribe<T> {

    private _state: number = STATE_INIT;
    private _subscriptions: Set<BufferStreamSubscription<T>> = new Set();
    private _options: IControllerOptions = {};

    constructor(options: IControllerOptions) {
        this._options = Object.assign({}, options, defaultOptions);
    }

    public add(value: T) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot add() after close.');
        }
        for (const subscription of this._subscriptions) {
            subscription._addData(value);
        }
    }

    public addError(error: any) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot addError() after close.');
        }
        for (const subscription of this._subscriptions) {
            subscription._addError(error);
        }
    }
    public close(): void {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot close() after close.');
        }
        for (const subscription of this._subscriptions) {
            subscription._close();
        }
    }

    get stream(): IStream<T> {
        return new ControllerStream<T>(this);
    }

    public _subscribe(listener: IObserverListener<T>): IStreamSubscription {
        const subscription = new BufferStreamSubscription(listener, (sub) => {
            this._subscriptions.delete(sub);
            if (this._subscriptions.size === 0) {
                runMethod(this._options.onCancel);
            }
        });
        this._subscriptions.add(subscription);
        if (this._subscriptions.size === 1) {
            runMethod(this._options.onListen);
        }
        return subscription;
    }
}

class ControllerStream<T> extends Stream<T> {

    constructor(private _controller: IControlerSubscribe<T>) {
        super();
    }
    public _createSubscription(listener: IObserverListener<T>): IStreamSubscription {
        return this._controller._subscribe(listener);
    }
}
