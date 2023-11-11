import { assert } from 'chai';
import { Observer, Subject, Subscription} from '../src/observer';

describe('core/Subject()', () => {
    it('should send message to subscriber', () => {
        const subject = new Subject<number>();
        const observer = new TestObserver<number>();
        subject.subscribe(observer);
        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.complete();

        assert.deepEqual(observer.results, [1,2,3,'complete']);
    });
    it('should subscribe many observer', () => {
        const subject = new Subject<number>();
        const observer = new TestObserver<number>();
        subject.subscribe(observer);
        subject.next(1);
        const s2 = subject.subscribe(observer);
        subject.next(2);
        subject.next(3);
        s2.unsubscribe();
        subject.next(4);
        subject.complete();

        assert.deepEqual(observer.results, [1, 2, 2, 3, 3, 4, 'complete']);
    });

    it('should not send message after unsubscribe()', () => {
        const subject = new Subject<number>();
        const observer = new TestObserver<number>();
        const subscribtion = subject.subscribe(observer);
        assert.isTrue(subject.observed);

        subject.next(1);
        subscribtion.unsubscribe();
        assert.isFalse(subject.observed);
        subject.next(2);
        subject.complete();
        assert.deepEqual(observer.results, [1]);
    });
    it('should not send message after error()', () => {
        const subject = new Subject<number>();
        const observer = new TestObserver<number>();
        subject.subscribe(observer);
        subject.next(1);
        subject.error('error');
        subject.next(2);
        assert.isFalse(subject.observed);
        assert.deepEqual(observer.results, [1, 'error']);
    });

});


class TestObserver<T> implements Observer<T> {
    results: any[] = [];
    start(subscription: Subscription) {
        this.results.push('start');
    }
    next(value: T): void {
        this.results.push(value);
    }
    error(err: any): void {
        this.results.push(err);

    }
    complete(): void {
        this.results.push('complete');
    }
}
