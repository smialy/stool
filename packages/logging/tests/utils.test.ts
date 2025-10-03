import { assert, describe, it } from 'vitest';

import { checkLevel, isException } from '../src/utils';
import { Levels } from '../src/consts';

describe('utils', () => {
    describe('checkLevel', () => {
        it('should return the level if it is a number', () => {
            assert.equal(checkLevel(10), 10);
        });

        it('should return the correct level for valid string inputs', () => {
            assert.equal(checkLevel('NOTSET'), Levels.NOTSET);
        });

        it('should throw a TypeError for invalid string inputs', () => {
            assert.throws(() => checkLevel('INVALID'), TypeError);
        });
    });

    describe('isException', () => {
        it('should return true for valid exception objects', () => {
            const ex = new Error('Test error');
            assert.equal(isException(ex), true);
        });

        it('should return false for non-exception objects', () => {
            assert.equal(isException({}), false);
            assert.equal(isException(null), false);
            assert.equal(isException(undefined), false);
        });
    });
});
