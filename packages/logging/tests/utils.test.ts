import { assert, describe, it } from 'vitest'

import { levelToMask, checkLevel, isException } from '../src/utils';
import { Levels } from '../src/consts';

describe('utils', () => {
  describe('levelToMask', () => {
    it('should convert NOTSET level to NOTSET mask', () => {
      assert.equal(levelToMask(Levels.NOTSET), Levels.NOTSET);
    });

    it('should calculate mask correctly for other levels', () => {
      assert.equal(levelToMask(2), 3);
      assert.equal(levelToMask(3), 5);
      assert.equal(levelToMask(4), 7);
    });
  });

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

