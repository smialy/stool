import { assert } from 'chai';
import { ready, classNames } from '../src/index';


if (typeof window !== 'undefined') {
    describe('ready()', () => {
        it('should check document.readyState', async () => {
            await ready();
            assert.equal(document.readyState, 'complete');
        })
    });
}
describe('classNames()', () => {

    it('object keys', () => {
        assert.equal(classNames({
            a: '',
            b: false,
            c: 0,
            d: null,
            e: undefined,
            f: NaN,
            g: ' ',
            h: true,
            i: 1,
        }), 'g h i');
    });

    it('values', () => {
        assert.equal(classNames('a', 1, 0, null, undefined, NaN, true), 'a 1');
    });

    it('empty values', () => {
        assert.equal(classNames(), '');
        assert.equal(classNames(''), '');
        assert.equal(classNames(' '), '');
    });

    it('duplicates', () => {
        assert.equal(classNames('a', 'b', 'a', 'b', { a: true }), 'a b');
    });

    it('deep array', () => {
        assert.equal(classNames(['a', 'b'], 'c'), 'a b c');
    });

    it('deep object', () => {
        assert.equal(classNames([{a: 1}, {b: 1}], 'c'), 'a b c');
    });
    it('classNames() and deep object', () => {
        assert.equal(classNames(null, false, 'foo', undefined, 0, 1, { baz: null }, ''), 'foo 1');
    });
    it('className({undefined: 1})', () => {
        const obj: any = {};
        assert.equal(classNames({[obj.undef]: true}), '');
    });
})