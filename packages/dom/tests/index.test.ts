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
