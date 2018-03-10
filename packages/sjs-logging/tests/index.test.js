import {
    LEVELS,
    LEVEL_NAMES,
    LEVEL_TO_MASK
} from '../src/consts';
import {
    Mask,
    Filter,
    Filterer
} from '../src/filter';
import {Manager} from '../src/manager';
import {Handler, ConsoleHandler} from '../src/handler';
import {Logger} from '../src/logger';

class TestHandler extends Handler{
    constructor() {
        super();
        this._body = [];
    }
    handle(record) {
        this._body.push(record.msg);
    }
    result(sep) {
        return this._body.join(sep || ',');
    }
    reset() {
        this.level = LEVELS.ALL;
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

function _mask(level) {
    return level * 2 - 1;
}

function _TestCase() {

}

QUnit.module('sjs-logging');

QUnit.test('empty logger', assert => {
    let handler = new TestHandler();
    var logger = new Logger();
    logger.addHandler(handler);

    _dummy(logger);
    assert.equal('', handler.result());
});
QUnit.test('custom logger mask', assert => {
    let handler = new TestHandler();
    var logger = new Logger();
    logger.addHandler(handler);
    logger.mask = LEVELS.DEBUG | LEVELS.ERROR;
    _dummy(logger);
    assert.equal('d,e', handler.result());
});

QUnit.test('setter/getter for level and mask ', assert => {
    var logger = new Logger();

    logger.level = LEVELS.DEBUG;
    assert.equal(1, logger.mask);

    logger.level = LEVELS.INFO;
    assert.equal(_mask(LEVELS.INFO), logger.mask);

    logger.level = LEVELS.WARN;
    assert.equal(_mask(LEVELS.WARN), logger.mask);

    logger.level = LEVELS.WARNING;
    assert.equal(_mask(LEVELS.WARNING), logger.mask);

    logger.level = LEVELS.ERROR;
    assert.equal(_mask(LEVELS.ERROR), logger.mask);

    logger.level = LEVELS.CRITICAL;
    assert.equal(_mask(LEVELS.CRITICAL), logger.mask);

    logger.level = LEVELS.FATAL;
    assert.equal(_mask(LEVELS.FATAL), logger.mask);
});
QUnit.test('log level', assert => {
    let handler = new TestHandler();
    var logger = new Logger('test');
    logger.addHandler(handler);

    handler.reset();

    logger.level = LEVELS.DEBUG;
    _dummy(logger);
    assert.equal('d', handler.result());

    handler.reset();

    logger.level = LEVELS.INFO;
    _dummy(logger);
    assert.equal('d,i', handler.result());

    handler.reset();

    logger.level = LEVELS.WARNING;
    _dummy(logger);
    assert.equal('d,i,w1,w2', handler.result());

    handler.reset();

    logger.level = LEVELS.WARN;
    _dummy(logger);
    assert.equal('d,i,w1,w2', handler.result());

    handler.reset();

    logger.level = LEVELS.ERROR;
    _dummy(logger);
    assert.equal('d,i,w1,w2,e', handler.result());

    handler.reset();

    logger.level = LEVELS.CRITICAL;
    _dummy(logger);
    assert.equal('d,i,w1,w2,e,c,f', handler.result());

    handler.reset();

    logger.level = LEVELS.FATAL;
    _dummy(logger);
    assert.equal('d,i,w1,w2,e,c,f', handler.result());

});
QUnit.test('log mask', assert => {
    let handler = new TestHandler();
    var logger = new Logger('test');
    logger.addHandler(handler);

    handler.reset();

    logger.mask = LEVELS.DEBUG;
    _dummy(logger);
    assert.equal('d', handler.result());

    handler.reset();

    logger.mask = LEVELS.INFO;
    _dummy(logger);
    assert.equal('i', handler.result());

    handler.reset();

    logger.mask = LEVELS.WARNING;
    _dummy(logger);
    assert.equal('w1,w2', handler.result());

    handler.reset();

    logger.mask = LEVELS.WARN;
    _dummy(logger);
    assert.equal('w1,w2', handler.result());

    handler.reset();

    logger.mask = LEVELS.ERROR;
    _dummy(logger);
    assert.equal('e', handler.result());

    handler.reset();

    logger.mask = LEVELS.CRITICAL;
    _dummy(logger);
    assert.equal('c,f', handler.result());

    handler.reset();

    logger.mask = LEVELS.FATAL;
    _dummy(logger);
    assert.equal('c,f', handler.result());

});


QUnit.test('manager priority', assert => {
    let handler = new TestHandler();
    var manager = new Manager();
    var logger = manager.getLogger('test');
    logger.addHandler(handler);

    _dummy(logger);
    //default manager level is ALL
    assert.equal('d,i,w1,w2,e,c,f', handler.result());

    handler.reset();

    //manager has higher priority than logger
    manager.level = LEVELS.DEBUG;

    logger.level = LEVELS.ALL;
    _dummy(logger);
    assert.equal('d', handler.result());
});
QUnit.test('get parent level 1', assert => {
    let handler = new TestHandler();
    var manager = new Manager();

    var a = manager.getLogger('a');
    var b = manager.getLogger('a.b');
    var c = manager.getLogger('a.b.c');
    c.addHandler(handler);
    a.level = LEVELS.INFO;


    _dummy(c);
    assert.equal('d,i', handler.result());

});
QUnit.test('get parent level 2', assert => {
    let handler = new TestHandler();
    var manager = new Manager();

    var a = manager.getLogger('a');
    var b = manager.getLogger('a.b');
    var c = manager.getLogger('a.b.c');

    a.level = LEVELS.DEBUG;
    b.level = LEVELS.INFO;
    c.addHandler(handler);

    _dummy(c);
    assert.equal('d,i', handler.result());
});

QUnit.test('get parent level 3', assert => {
    let handler = new TestHandler();
    var manager = new Manager();

    var a = manager.getLogger('a');
    var c = manager.getLogger('a.b.c');

    a.level = LEVELS.INFO;

    c.addHandler(handler);

    _dummy(c);
    assert.equal('d,i', handler.result());
});
QUnit.test('get parent level 4', assert => {
    var handler = new TestHandler();
    var manager = new Manager();

    var a = manager.getLogger('a');
    var c = manager.getLogger('a.b.c');
    var d = manager.getLogger('a.b.c.d');
    var b = manager.getLogger('a.b');

    a.level = LEVELS.DEBUG;

    b.level = LEVELS.INFO;

    d.addHandler(handler);

    _dummy(d);
    assert.equal('d,i', handler.result());
});
QUnit.test('propagate log', assert => {
    var handler = new TestHandler();
    var manager = new Manager();
    var a = manager.getLogger('a');
    var b = manager.getLogger('a.b');
    var c = manager.getLogger('a.b.c');
    a.level = LEVELS.DEBUG;

    a.addHandler(handler);

    _dummy(c);
    assert.equal('d', handler.result());
});

QUnit.module('sjs-logging - Handler');

QUnit.test('handler init', assert => {
    var handler = new TestHandler();
    var logger = new Logger('test');
    logger.level = LEVELS.ALL;
    logger.addHandler(handler);

    _dummy(logger);

    assert.equal('d,i,w1,w2,e,c,f', handler.result());
});
QUnit.test('handler level', assert => {
    var handler = new TestHandler();
    var logger = new Logger('test');
    logger.addHandler(handler);

    logger.level = LEVELS.ALL;
    handler.level = LEVELS.INFO;
    _dummy(logger);

    assert.equal('d,i', handler.result());
});
