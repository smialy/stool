import { IStream, IStreamSubscription, IObserverListener } from './interfaces';
import { noop, toObserver, runMethod, enqueue } from './utils';


const STATE_INIT = 1;
const STATE_CLOSE = 2;
const STATE_FIRING = 4;
const STATE_CANCEL = 8;


export class BufferStreamSubscription<T> implements IStreamSubscription {

    private _state: number = STATE_INIT;
    private _buff: any[] = [];

    constructor(private _listener: IObserverListener<T>, private _cancelHandler?: (sub: any)=>void) {}

    _addData(data: T){
        if(this._state & STATE_CANCEL){
            return;
        }
        this._buff.push(new DataEvent<T>(data));
        this._flush();
    }
    _addError(error: any): void {
        if(this._state & STATE_CANCEL){
            return;
        }
        this._buff.push(new ErrorEvent<T>(error));
    }
    _close() {
        this._buff.push(new CompleteEvent<T>());
        this._state |= STATE_CLOSE | STATE_CANCEL;
        runMethod(this._cancelHandler, this);
    }
    _flush(){
        if(this._state & STATE_CANCEL){
            return;
        }
        if(this._state & STATE_FIRING){
            enqueue(() => this._flush());
            return
        }
        this._state |= STATE_FIRING;
        let events = this._buff.concat();
        this._buff.length = 0;
        for(let event of events) {
            try{
                event.execute(this._listener);
            }catch(e){
                console.error(e);
            }
            if(this._state & STATE_CANCEL){
                break;
            }
        }
        this._state &= ~STATE_FIRING;
    }

    cancel() {
        if(this._state & ~STATE_CANCEL){
            this._state |= STATE_CANCEL;
            runMethod(this._cancelHandler, this);
        }
    }
}

interface Event<T> {
    execute(listener: IObserverListener<T>): void;
}

class DataEvent<T> implements Event<T> {
    constructor(private data: T){

    }
    execute(listener: IObserverListener<T>): void {
        listener.onData(this.data);
    }
}

class ErrorEvent<T> implements Event<T> {
    constructor(private error: any){

    }
    execute(listener: IObserverListener<T>): void {
        listener.onError(this.error);
    }
}
class CompleteEvent<T> implements Event<T> {
    execute(listener: IObserverListener<T>): void {
        listener.onComplete();
    }
}

export abstract class Stream<T> implements IStream<T> {

    listen(onData?: (value:T) => void, onError?: (error: any) => void, onComplete?: () => void): IStreamSubscription;
    listen(listener?: IObserverListener<T>): IStreamSubscription;
    listen(onData?: IObserverListener<T> | ((value:T) => void), onError?: (error: any) => void, onComplete?: () => void) {
        const observer = toObserver(onData, onError, onComplete);
        return this._createSubscription(observer);
    }

    _createSubscription(listener: IObserverListener<T>): IStreamSubscription {
        return new BufferStreamSubscription(listener);
    }

    map(fn: Function): IStream<T> {
        return new MapStream<T>(this, fn);
    }

    filter(fn: Function): IStream<T> {
        return new FilterStream<T>(this, fn);
    }

    pipe(...fns: Function[]): IStream<T> {
        return new PipeStream<T>(this, fns);
    }
}

class ForwardStream<T> extends Stream<T> {
    protected _source: IStream<T>;

    constructor(source: IStream<T>){
        super();
        this._source = source;
    }
    listen(onData?: (value:T) => void, onError?: (error: any) => void, onComplete?: () => void): IStreamSubscription;
    listen(listener?: IObserverListener<T>): IStreamSubscription;
    listen(onData?: IObserverListener<T> | ((value:T) => void), onError?: (error: any) => void, onComplete?: () => void) {
        const observer = toObserver(onData, onError, onComplete);
        return this._source.listen(
            (value: T) => this._handleNext(value, observer),
            (error: any) => this._handleError(error, observer),
            () => this._handleComplete(observer)
        );
    }
    _handleNext(value: T, observer: IObserverListener<T>){
        observer.onData(value);
    }
    _handleError(error: any, observer: IObserverListener<T>){
        observer.onError(error);
    }
    _handleComplete(observer: IObserverListener<T>){
        observer.onComplete();
    }
}

class PipeStream<T> extends ForwardStream<T> {

    private _pipe: Function;

    constructor(source: IStream<T>, methods:Function[]){
        super(source);
        this._pipe = (input:any) => methods.reduce((prev: any, fn: Function) => fn(prev), input as any);
    }
    _handleNext(value: T, observer: IObserverListener<T>){
        observer.onData(this._pipe(value));
    }
}

class MapStream<T> extends ForwardStream<T> {

    private _method: Function;

    constructor(source: IStream<T>, method: Function){
        super(source);
        this._method = method;
    }
    _handleNext(value: T, observer: IObserverListener<T>){
        observer.onData(this._method(value));
    }
}

class FilterStream<T> extends ForwardStream<T> {
    private _method: Function;

    constructor(source: IStream<T>, method: Function){
        super(source);
        this._method = method;
    }

    _handleNext(value: T, observer: IObserverListener<T>){
        if(this._method(value)){
            observer.onData(this._method(value));
        }
    }
}
