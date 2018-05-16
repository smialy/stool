import {Observable} from '../zen-observable';

import { IObservable, ISubscription, IObserver, ISubscriberFunction } from './observable';


const noop = () => {};

function toObserver<T>(
    next?: IObserver<T> | ((value:T) => void),
    error?: (error: any) => void,
    complete?: () => void): IObserver<T> {
    if(typeof next === 'function'){
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

export interface IStream<T> {
    subscribe(next?: (value:T) => void, error?: (error: any) => void, complete?: () => void): ISubscription;
    subscribe(observer?: IObserver<T>): ISubscription;

    map(fn: Function): IStream<T>;
    filter(fn: Function): IStream<T>;
    pipe(...fns: Function[]): IStream<T>;
}


export class StreamController<T> {

    private _streams: Set<Stream<T>> = new Set();
    private _onListen: Function;
    private _onCancel: Function;


    constructor(options: {onListen?:Function, onCancel?:Function} = {}){
        this._onListen = options.onListen || noop;
        this._onCancel = options.onCancel || noop;
    }
    add(value: T){
        for(const stream of this._streams){
            stream._next(value);
        }
    }
    addError(error: any){
        for(const stream of this._streams){
            stream._error(error);
        }
    }
    close(){
        for(const stream of this._streams){
            stream._complete();
        }
    }
    onListen(stream: IStream<T>){
        this._streams.add(stream);
        if(this._streams.size === 1){
            this._onListen();
        }
    }
    onClose(stream: IStream<T>){
        this._streams.delete(stream);
        if(this._streams.size === 0){
            this._onCancel();
        }
    }
    get stream(): IStream<T> {
        return new ControllerStream<T>(this);
    }
}


export class Stream<T> implements IStream<T> {

    private _subscriber: ISubscriberFunction<T> | undefined;
    private _observable: IObservable<T> | undefined;

    constructor(subscriber?: ISubscriberFunction<T>){
        this._subscriber = subscriber;
    }
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): ISubscription;
    subscribe(observer?: IObserver<T>): ISubscription;
    subscribe(next?: IObserver<T> | ((value:T) => void),
            error?: (error: any) => void,
            done?: () => void): ISubscription {
        if(!this._observable){
            this._observable = new Observable(this._subscriber);
        }
        return this._observable.subscribe(toObserver(next, error, done));
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
    subscribe(next?: IObserver<T> | ((value:T) => void),
            error?: (error: any) => void,
            complete?: () => void): ISubscription {
        const observer = toObserver(next, error, complete);
        return this._source.subscribe(
            (value: T) => this._handleNext(value, observer),
            (error: any) => this._handleError(error, observer),
            () => this._handleComplete(observer)
        );
    }
    _handleNext(value: T, observer: IObserver<T>){
        observer.next(value);
    }
    _handleError(error: any, observer: IObserver<T>){
        observer.error(error);
    }
    _handleComplete(observer: IObserver<T>){
        observer.complete();
    }

}
class PipeStream<T> extends ForwardStream<T> {

    private _pipe: Function;

    constructor(source: IStream<T>, methods:Function[]){
        super(source);
        this._pipe = input => methods.reduce((prev: any, fn: Function) => fn(prev), input as any);
    }
    _handleNext(value: T, observer: IObserver<T>){
        observer.next(this._pipe(value));
    }
}

class MapStream<T> extends ForwardStream<T> {

    private _method: Function;

    constructor(source: IStream<T>, method: Function){
        super(source);
        this._method = method;
    }
    _handleNext(value: T, observer: IObserver<T>){
        observer.next(this._method(value));
    }
}

class FilterStream<T> extends ForwardStream<T> {
    private _method: Function;

    constructor(source: IStream<T>, method: Function){
        super(source);
        this._method = method;
    }

    _handleNext(value: T, observer: IObserver<T>){
        if(this._method(value)){
            observer.next(this._method(value));
        }
    }
}

class FakeProducer<T> implements IObserver<T> {
    next(value: T){};
    error(error: any){};
    complete() {};
}

class ControllerStream<T> extends Stream<T> {

    private _controller: StreamController<T>;
    private _observable: Observable = null;
    private _producer: IObserver<T> = new FakeProducer();

    constructor(controller: StreamController<T>) {
        super(noop);
        this._controller = controller;
    }
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): ISubscription;
    subscribe(observer?: IObserver<T>): ISubscription;
    subscribe(next?: IObserver<T> | ((value:T) => void),
            error?: (error: any) => void,
            done?: () => void): ISubscription {
        if(this._observable === null){
            this._observable = new Observable((producer: IObserver<T>) => {
                this._producer = producer;
                this.onListen();
                return () => this.onClose();
            });
        }
        return this._observable.subscribe(toObserver(next, error, done));
    }

    _next(value: T){
        this._producer.next(value);
    }
    _error(error: any){
        this._producer.error(error);
    }
    _complete(){
        this._producer.complete();
    }

    onListen(){
        this._controller.onListen(this);
    }
    onClose(){
        this._controller.onClose(this);
    }
}

export function fromEvents(element: HTMLElement, eventName: string){
    return new Stream(observer => {
        const handler = (event: any) => observer.next(event);
        element.addEventListener(eventName, handler, false);
        return () => element.removeEventListener(eventName, handler, false);
    });
}