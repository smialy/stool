import { assert, describe, it } from 'vitest'
import * as utils from '../src/function';

describe('core/function', () => {
    it('tr(fn,...)', () => {
        assert.equal(
            'test',
            utils.tr(() => {
                return 'test';
            })
        );
        assert.equal(
            null,
            utils.tr(() => {
                throw new Error('test');
            })
        );
        assert.equal(
            'test2',
            utils.tr(
                () => {
                    throw new Error('test');
                },
                () => {
                    return 'test2';
                }
            )
        );
    });
});
