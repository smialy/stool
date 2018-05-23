import { runMethod } from './utils';
import { Stream, BufferStreamSubscription } from './stream';
const STATE_INIT = 1;
const STATE_CLOSED = 2;
export class StreamController {
    constructor(_options) {
        this._options = _options;
        this._state = STATE_INIT;
        this._subscription = null;
    }
    add(value) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot add() after close.');
        }
        if (this._subscription) {
            this._subscription._addData(value);
        }
    }
    addError(error) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot addError() after close.');
        }
        if (this._subscription) {
            this._subscription._addError(error);
        }
    }
    close() {
        if (this._state & STATE_CLOSED) {
            return;
        }
        if (this._subscription) {
            this._subscription._close();
        }
    }
    get stream() {
        return new ControllerStream(this);
    }
    _subscribe(listener) {
        if (this._subscription !== null) {
            throw new Error("Stream has already was listen.");
        }
        this._subscription = new BufferStreamSubscription(listener, () => {
            this._subscription = null;
            runMethod(this._options.onCancel);
        });
        runMethod(this._options.onListen);
        return this._subscription;
    }
}
export class EventController {
    constructor(_options) {
        this._options = _options;
        this._state = STATE_INIT;
        this._subscriptions = new Set();
    }
    add(value) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot add() after close.');
        }
        for (let subscription of this._subscriptions) {
            subscription._addData(value);
        }
    }
    addError(error) {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot addError() after close.');
        }
        for (let subscription of this._subscriptions) {
            subscription._addError(error);
        }
    }
    close() {
        if (this._state & STATE_CLOSED) {
            throw new Error('Cannot close() after close.');
        }
        for (let subscription of this._subscriptions) {
            subscription._close();
        }
    }
    get stream() {
        return new ControllerStream(this);
    }
    _subscribe(listener) {
        const subscription = new BufferStreamSubscription(listener, subscription => {
            this._subscriptions.delete(subscription);
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
class ControllerStream extends Stream {
    constructor(_controller) {
        super();
        this._controller = _controller;
    }
    _createSubscription(listener) {
        return this._controller._subscribe(listener);
    }
}
