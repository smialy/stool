import { assert } from 'chai';
import { Events } from '../src/events';

describe('new EventEmiter()', () => {
    it('simple flow', () => {
        const buff: string[] = [];
        const emiter = new Events<string>();
        const events = emiter.handlers();

        events(e => buff.push(e));
        emiter.fire('test1')
        emiter.fire('test2')
        assert.deepEqual(buff, ['test1', 'test2']);
    });
    it('should dispose added listener', () => {
        const buff: string[] = [];
        const emiter = new Events<string>();
        const events = emiter.handlers();

        const dispose = events(e => buff.push(e));
        dispose();

        emiter.fire('test')
        assert.deepEqual([], buff);
        assert.equal(emiter.size(), 0);
    });
    it('should dispose all events', () => {
        const buff: string[] = [];
        const emiter = new Events<string>();
        emiter.dispose();
        const events = emiter.handlers();
        const dispose = events(e => buff.push(e));
        assert.equal(typeof dispose, 'function')
        emiter.fire('test')
        assert.deepEqual([], buff);
        assert.equal(emiter.size(), 0);
    });
});
