import { assert, describe, it } from 'vitest'

import { Levels } from '../src/consts';
import { LoggerFactory, Logger } from '../src/logger';
import { BaseHandler } from '../src/handlers';

class TestHandler extends BaseHandler {
    private _body: Array<any>;
    constructor() {
        super();
        this._body = [];
    }
    emit(record: any) {
        this._body.push(record.msg);
    }
    result(sep = ',') {
        return this._body.join(sep);
    }
    reset() {
        this.setLevel(Levels.NOTSET);
        this._body = [];
    }
}

function _dummy(logger: any) {
    logger.debug('d');
    logger.info('i');
    logger.warn('w1');
    logger.warning('w2');
    logger.error('e');
    logger.critical('c');
    logger.fatal('f');
}

describe('@stool/logging :: Logger', () => {
    it('empty logger', () => {
        let handler = new TestHandler();
        let logger = new Logger('test');
        logger.addHandler(handler);

        _dummy(logger);
        assert.equal('d,i,w1,w2,e,c,f', handler.result());
    });

    it('log level', () => {
        let handler = new TestHandler();
        let logger = new Logger('test');
        logger.addHandler(handler);

        handler.reset();
        logger.setLevel(Levels.DEBUG);
        _dummy(logger);
        assert.equal('d,i,w1,w2,e,c,f', handler.result());

        handler.reset();

        logger.setLevel(Levels.INFO);
        _dummy(logger);
        assert.equal('i,w1,w2,e,c,f', handler.result());

        handler.reset();

        logger.setLevel(Levels.WARNING);
        _dummy(logger);
        assert.equal('w1,w2,e,c,f', handler.result());

        handler.reset();

        logger.setLevel(Levels.WARN);
        _dummy(logger);
        assert.equal('w1,w2,e,c,f', handler.result());

        handler.reset();

        logger.setLevel(Levels.ERROR);
        _dummy(logger);
        assert.equal('e,c,f', handler.result());

        handler.reset();

        logger.setLevel(Levels.CRITICAL);
        _dummy(logger);
        assert.equal('c,f', handler.result());

        handler.reset();

        logger.setLevel(Levels.FATAL);
        _dummy(logger);
        assert.equal('c,f', handler.result());
    });
    it('get parent level 1', () => {
        let handler = new TestHandler();
        let manager = new LoggerFactory();

        let a = manager.getLogger('a');
        manager.getLogger('a.b');
        let c = manager.getLogger('a.b.c');
        c.addHandler(handler);
        a.setLevel(Levels.INFO);

        _dummy(c);
        assert.equal(handler.result(), 'i,w1,w2,e,c,f');
    });
    it('get parent level 2', () => {
        let handler = new TestHandler();
        let manager = new LoggerFactory();

        let a = manager.getLogger('a');
        let b = manager.getLogger('a.b');
        let c = manager.getLogger('a.b.c');

        a.setLevel(Levels.DEBUG);
        b.setLevel(Levels.INFO);
        c.addHandler(handler);

        _dummy(c);
        assert.equal(handler.result(), 'i,w1,w2,e,c,f');
    });

    it('get logger in revers order', () => {
        let handler = new TestHandler();
        let manager = new LoggerFactory();

        let b = manager.getLogger('a.b');
        let a = manager.getLogger('a');
        a.addHandler(handler);

        _dummy(b);
        assert.equal(handler.result(), 'd,i,w1,w2,e,c,f');
    });

    it('missing level', () => {
        let handler = new TestHandler();
        let manager = new LoggerFactory();

        let c = manager.getLogger('a.b.c');
        let a = manager.getLogger('a');
        a.addHandler(handler);

        _dummy(c);
        assert.equal(handler.result(), 'd,i,w1,w2,e,c,f');
    });

    it('get parent level 3', () => {
        let handler = new TestHandler();
        let manager = new LoggerFactory();

        let a = manager.getLogger('a');
        let c = manager.getLogger('a.b.c');

        a.setLevel(Levels.INFO);

        c.addHandler(handler);
        _dummy(c);
        assert.equal(handler.result(), 'i,w1,w2,e,c,f');
    });
    it('get parent level 4', () => {
        let handler = new TestHandler();
        let manager = new LoggerFactory();

        let a = manager.getLogger('a');
        manager.getLogger('a.b.c');
        let d = manager.getLogger('a.b.c.d');
        let b = manager.getLogger('a.b');

        a.setLevel(Levels.DEBUG);

        b.setLevel(Levels.INFO);

        d.addHandler(handler);

        _dummy(d);
        assert.equal(handler.result(), 'i,w1,w2,e,c,f');
    });
    it('propagate log', () => {
        let handler = new TestHandler();
        let manager = new LoggerFactory();
        let a = manager.getLogger('a');
        manager.getLogger('a.b');
        let c = manager.getLogger('a.b.c');
        a.setLevel(Levels.DEBUG);

        a.addHandler(handler);

        _dummy(c);
        assert.equal('d,i,w1,w2,e,c,f', handler.result());
    });
});

describe('@stool/logging :: Handler', () => {
    it('handler init', () => {
        let handler = new TestHandler();
        let logger = new Logger('test');
        logger.setLevel(Levels.NOTSET);
        logger.addHandler(handler);

        _dummy(logger);

        assert.equal('d,i,w1,w2,e,c,f', handler.result());
    });
    it('handler level', () => {
        let handler = new TestHandler();
        let logger = new Logger('test');
        logger.addHandler(handler);

        logger.setLevel(Levels.NOTSET);
        handler.setLevel(Levels.INFO);
        _dummy(logger);

        assert.equal('i,w1,w2,e,c,f', handler.result());
    });
});
