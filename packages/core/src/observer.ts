import { Observable, Observer } from "zen-observable-ts";
export { Observable, Observer };

export class Subject<T> extends Observable<T> {

  private _observers: Set<Observer<T>> = new Set();
  private _isStopped = false;

  constructor() {
    super((observed) => {
      this._observers.add(observed);
      return () => this._observers.delete(observed)
    });
  }

  next(value: T) {
    if (this._isStopped) {
      throw Error('Subject already completed');
    }
    for (const observer of this._observers) {
      if (observer.next) {
        observer.next(value);
      }
    }
  }

  error(err: any) {
    if (this._isStopped) {
      throw Error('Subject already completed');
    }
    for (const observer of this._observers) {
      if (observer.error) {
        observer.error(err);
      }
    }
  }

  complete() {
    if (this._isStopped) {
      throw Error('Subject already completed');
    }
    this._isStopped = true;
    const observers = [...this._observers];
    this._observers.clear();
    for (const observer of observers) {
      if (observer.complete) {
        observer.complete();
      }
    }
  }

  unsubscribe() {
    this._isStopped = true;
    this._observers = null!;
  }

  get observed(): boolean {
    return this._observers?.size > 0;
  }
}