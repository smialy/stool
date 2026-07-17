import { describe, it, expect } from 'vitest';

import {
    collectDict,
    collectList,
    increaseVerbose,
} from '../../src/utils/cmd.mjs';

describe('collectList', () => {
    it('splits a comma-separated string into an array', () => {
        expect(collectList('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('appends to an existing accumulator', () => {
        expect(collectList('c,d', ['a', 'b'])).toEqual(['a', 'b', 'c', 'd']);
    });

    it('defaults the accumulator to an empty array', () => {
        expect(collectList('only')).toEqual(['only']);
    });

    it('handles a single value with no comma', () => {
        expect(collectList('solo')).toEqual(['solo']);
    });
});

describe('collectDict', () => {
    it('parses key:value pairs into an object', () => {
        expect(collectDict('a:1,b:2')).toEqual({ a: '1', b: '2' });
    });

    it('merges into an existing accumulator', () => {
        expect(collectDict('b:2', { a: '1' })).toEqual({ a: '1', b: '2' });
    });

    it('overwrites accumulator keys with new ones', () => {
        expect(collectDict('a:new', { a: 'old' })).toEqual({ a: 'new' });
    });

    it('parses a single pair', () => {
        expect(collectDict('key:val')).toEqual({ key: 'val' });
    });
});

describe('increaseVerbose', () => {
    it('increments the accumulator', () => {
        expect(increaseVerbose(null, 0)).toBe(1);
        expect(increaseVerbose(null, 1)).toBe(2);
        expect(increaseVerbose(null, 3)).toBe(4);
    });
});