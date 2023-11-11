import { assert } from 'chai';
import { camelCase, format, hyphenate, clsx } from '../src/string';

describe('core/string', () => {
    it('camelCase(string)', () => {
        let map = {
            'foo-bar': 'fooBar',
            'foo-bar-baz': 'fooBarBaz',
            'a-b-c': 'aBC',
            '-o-attr': 'OAttr',
            '-moz-attr': 'MozAttr',
            '-ms-attr': 'MsAttr',
        };
        for (let name of Object.keys(map)) {
            assert.equal(camelCase(name), map[name], 'Convert: ' + name + ' => ' + map[name]);
        }
    });

    it('hyphenate(string)', () => {
        let map = {
            fooBar: 'foo-bar',
            fooBarBaz: 'foo-bar-baz',
            aBC: 'a-b-c',
            OAttr: '-o-attr',
            MozAttr: '-moz-attr',
            MsAttr: '-ms-attr',
        };
        for (let name of Object.keys(map)) {
            assert.equal(hyphenate(name), map[name], 'Convert: ' + name + ' => ' + map[name]);
        }
    });

    it('empty format()', () => {
        const text = 'Hello {{name}}!!!';
        const result = format(text, {});
        assert.equal('Hello !!!', result);
    });

    it('format()', () => {
        const text = 'Hello {{name}}!!!';
        const result = format(text, { name: 'Bill' });
        assert.equal('Hello Bill!!!', result);
    });
});

describe('clx()', () => {
    it('object keys', () => {
        assert.equal(clsx({
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
    it ('attribures', () => {
        assert.equal(clsx('a', true && 'b', 'c'), 'a b c');
    });
    it('values', () => {
        assert.equal(clsx('a', 1, 0, null, undefined, NaN, true), 'a 1');
    });

    it('empty values', () => {
        assert.equal(clsx(), '');
        assert.equal(clsx(''), '');
        assert.equal(clsx(' '), '');
    });

    it('duplicates', () => {
        assert.equal(clsx('a', 'b', 'a', 'b', { a: true }), 'a b');
    });

    it('deep array', () => {
        assert.equal(clsx(['a', 'b'], 'c'), 'a b c');
    });

    it('deep object', () => {
        assert.equal(clsx([{a: 1}, {b: 1}], 'c'), 'a b c');
    });
    it('clx() and deep object', () => {
        assert.equal(clsx(null, false, 'foo', undefined, 0, 1, { baz: null }, ''), 'foo 1');
    });
    it('clx({undefined: 1})', () => {
        const obj: any = {};
        assert.equal(clsx({[obj.undef]: true}), '');
    });
})
