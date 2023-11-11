import { assert } from 'chai';
import { sid, randomInt, choice, uidFactory } from '../src/random';

describe('core/random', () => {
    it('create sid by sid()', () => {
        assert.ok(sid());
        let items = new Set();
        for (let i = 0; i < 1000; i++) {
            let value = sid();
            if (items.has(value)) {
                throw new Error('Find sid: ' + value);
            }
            items.add(value);
        }
        assert.equal(32, sid().length);
        assert.equal(100, sid(100).length);
    });

    it('randomInt(max)', () => {
        let min = 0;
        let max = 10;
        for (let i = 0; i < 100; i++) {
            let r = randomInt(10);
            assert.ok(r >= min, `Excpected random number: r >= ${min} is ${r}`);
            assert.ok(r < max, `Excpected random number: r <= ${max} is ${r}`);
        }
    });

    it('random(min, max)', () => {
        let min = 10;
        let max = 20;
        for (let i = 0; i < 100; i++) {
            let r = randomInt(10, 20);
            assert.ok(r >= min, `Excpected random number: r >= ${min} is ${r}`);
            assert.ok(r < max, `Excpected random number: r <= ${max} is ${r}`);
        }
    });

    it('choice([1])', () => {
        assert.equal(choice([1]), 1);
    });

    it('choice([1,2,3])', () => {
        const seq = [1, 2, 3];
        for (let i = 0; i < 10; i += 1) {
            assert.ok(seq.includes(choice(seq)));
        }
    });

    it('choice([1,2,3])', () => {
        const seq = ['a', 'b'];
        for (let i = 0; i < 10; i += 1) {
            assert.ok(['a', 'b'].includes(choice(seq)));
        }
    });

    it('uidFactory()', () => {
        let uid = uidFactory();
        assert.equal(uid(), '1');
        assert.equal(uid(), '2');
        assert.equal(uid(), '3');

        for (let i = 0; i < 100; i++) {
            uid();
        }
        assert.equal('1Y', uid());

        for (let i = 0; i < 100; i++) {
            uid();
        }
        assert.equal(uid(), '4U');
        assert.equal(uid(), '4V');

        let newUid = uidFactory();
        assert.equal(newUid(), '1');
    });
});
