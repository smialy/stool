import {
    LEVELS
} from '../src/consts';
import { Manager } from '../src/manager';
import { Handler } from '../src/handlers';
import { Logger } from '../src/logger';

class TestHandler extends Handler {
    constructor() {
        super();
        this._body = [];
    }
    emit(record) {
        this._body.push(record.msg);
    }
    result(sep) {
        return this._body.join(sep || ',');
    }
    reset() {
        this.setLevel(LEVELS.NOTSET);
        this._body = [];
    }
}

function _dummy(logger) {
    logger.debug('d');
    logger.info('i');
    logger.warn('w1');
    logger.warning('w2');
    logger.error('e');
    logger.critical('c');
    logger.fatal('f');
}

QUnit.module('sjs-logging');

QUnit.test('empty logger', assert => {
    let handler = new TestHandler();
    let logger = new Logger();
    logger.addHandler(handler);

    _dummy(logger);
    assert.equal('d,i,w1,w2,e,c,f', handler.result());
});

QUnit.test('log level', assert => {
    let handler = new TestHandler();
    let logger = new Logger('test');
    logger.addHandler(handler);

    handler.reset();
    logger.setLevel(LEVELS.DEBUG);
    _dummy(logger);
    assert.equal('d,i,w1,w2,e,c,f', handler.result());

    handler.reset();

    logger.setLevel(LEVELS.INFO);
    _dummy(logger);
    assert.equal('i,w1,w2,e,c,f', handler.result());

    handler.reset();

    logger.setLevel(LEVELS.WARNING);
    _dummy(logger);
    assert.equal('w1,w2,e,c,f', handler.result());

    handler.reset();

    logger.setLevel(LEVELS.WARN);
    _dummy(logger);
    assert.equal('w1,w2,e,c,f', handler.result());

    handler.reset();

    logger.setLevel(LEVELS.ERROR);
    _dummy(logger);
    assert.equal('e,c,f', handler.result());

    handler.reset();

    logger.setLevel(LEVELS.CRITICAL);
    _dummy(logger);
    assert.equal('c,f', handler.result());

    handler.reset();

    logger.setLevel(LEVELS.FATAL);
    _dummy(logger);
    assert.equal('c,f', handler.result());

});

QUnit.test('manager priority', assert => {
    let handler = new TestHandler();
    let manager = new Manager();
    let logger = manager.getLogger('test');
    logger.addHandler(handler);

    _dummy(logger);
    //default manager level is ALL
    assert.equal('d,i,w1,w2,e,c,f', handler.result());

    handler.reset();

    //manager has higher priority than logger
    manager.setDisable(LEVELS.WARN);

    logger.setLevel(LEVELS.INFO);
    _dummy(logger);
    assert.equal('w1,w2,e,c,f', handler.result());
});
QUnit.test('get parent level 1', assert => {
    let handler = new TestHandler();
    let manager = new Manager();

    let a = manager.getLogger('a');
    manager.getLogger('a.b');
    let c = manager.getLogger('a.b.c');
    c.addHandler(handler);
    a.setLevel(LEVELS.INFO);


    _dummy(c);
    assert.equal(handler.result(), 'i,w1,w2,e,c,f');

});
QUnit.test('get parent level 2', assert => {
    let handler = new TestHandler();
    let manager = new Manager();

    let a = manager.getLogger('a');
    let b = manager.getLogger('a.b');
    let c = manager.getLogger('a.b.c');

    a.setLevel(LEVELS.DEBUG);
    b.setLevel(LEVELS.INFO);
    c.addHandler(handler);

    _dummy(c);
    assert.equal(handler.result(), 'i,w1,w2,e,c,f');
});

QUnit.test('get parent level 3', assert => {
    let handler = new TestHandler();
    let manager = new Manager();

    let a = manager.getLogger('a');
    let c = manager.getLogger('a.b.c');

    a.setLevel(LEVELS.INFO);

    c.addHandler(handler);
    _dummy(c);
    assert.equal(handler.result(),'i,w1,w2,e,c,f');
});
QUnit.test('get parent level 4', assert => {
    let handler = new TestHandler();
    let manager = new Manager();

    let a = manager.getLogger('a');
    manager.getLogger('a.b.c');
    let d = manager.getLogger('a.b.c.d');
    let b = manager.getLogger('a.b');

    a.setLevel(LEVELS.DEBUG);

    b.setLevel(LEVELS.INFO);

    d.addHandler(handler);

    _dummy(d);
    assert.equal(handler.result(), 'i,w1,w2,e,c,f');
});
QUnit.test('propagate log', assert => {
    let handler = new TestHandler();
    let manager = new Manager();
    let a = manager.getLogger('a');
    manager.getLogger('a.b');
    let c = manager.getLogger('a.b.c');
    a.setLevel(LEVELS.DEBUG);

    a.addHandler(handler);

    _dummy(c);
    assert.equal('d,i,w1,w2,e,c,f', handler.result());
});

QUnit.module('sjs-logging - Handler');

QUnit.test('handler init', assert => {
    let handler = new TestHandler();
    let logger = new Logger('test');
    logger.setLevel(LEVELS.NOTSET);
    logger.addHandler(handler);

    _dummy(logger);

    assert.equal('d,i,w1,w2,e,c,f', handler.result());
});
QUnit.test('handler level', assert => {
    let handler = new TestHandler();
    let logger = new Logger('test');
    logger.addHandler(handler);

    logger.setLevel(LEVELS.NOTSET);
    handler.setLevel(LEVELS.INFO);
    _dummy(logger);

    assert.equal('i,w1,w2,e,c,f', handler.result());
});
