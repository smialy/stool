import { ready, classNames } from '../src/index';


if (typeof window !== 'undefined') {
    QUnit.test('ready()', async assert => {
        await ready();
        assert.equal(document.readyState, 'complete');
    });
}

QUnit.test('classNames() and object keys', assert => {
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

QUnit.test('classNames() and values', assert => {
    assert.equal(classNames('a', 1, 0, null, undefined, NaN, true), 'a 1');
});

QUnit.test('classNames() and empty values', assert => {
    assert.equal(classNames(), '');
    assert.equal(classNames(''), '');
    assert.equal(classNames(' '), '');
});

QUnit.test('classNames() and duplicates', assert => {
    assert.equal(classNames('a', 'b', 'a', 'b', { a: true }), 'a b');
});

QUnit.test('classNames() and deep array', assert => {
    assert.equal(classNames(['a', 'b'], 'c'), 'a b c');
});

QUnit.test('classNames() and deep object', assert => {
    assert.equal(classNames([{a: 1}, {b: 1}], 'c'), 'a b c');
});
QUnit.test('classNames() and deep object', assert => {
    assert.equal(classNames(null, false, 'foo', undefined, 0, 1, { baz: null }, ''), 'foo 1');
});