import { IStream } from './interfaces';
import { Stream } from './stream';
import { EventController, StreamController } from './controller';
export { Stream, StreamController, EventController };
export declare function fromItem(input: any): IStream<{}> | undefined;
declare global  {
    interface SymbolConstructor {
        observable: symbol;
    }
}
export declare function fromFunction<T>(subscriber: (controller: StreamController<T>) => (Function | void)): IStream<T>;
export declare function fromObservable<T>(input: any): IStream<T>;
export declare function fromArray<T>(array: ArrayLike<T>): IStream<{}>;
export declare function fromPromise<T>(promise: Promise<T>): IStream<{}>;
export declare function fromIterator<T>(items: Iterable<T>): IStream<{}>;
export declare function fromEvents(element: HTMLElement, eventName: string): IStream<{}>;
