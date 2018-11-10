import {Events} from '../src/index';


QUnit.module('@stool/events::Events');

QUnit.test('test on(simple)',  assert => {
    var e = new Events();
    e.on('click1', () => {});
    e.on('click2', () => {});
    assert.ok(e.hasListeners('click1'));
    assert.ok(e.hasListeners('click2'));

    e.removeListeners('click1');
    assert.ok(!e.hasListeners('click1'));
    assert.ok(e.hasListeners('click2'));

    e.removeListeners('click2');
    assert.ok(!e.hasListeners('click2'));
});
QUnit.test('test on(simple + fn)',  assert => {
    var e = new Events();
    var fn = () => {};
    var obj = {};
    assert.ok(!e.hasListeners('click'));
    e.on('click', fn, obj);
    e.on('click', fn);

    assert.ok(e.hasListeners('click', fn, obj));
    assert.ok(e.hasListeners('click', fn));
    assert.ok(e.hasListeners('click'));

    e.off('click', fn);

    assert.ok(e.hasListeners('click', fn, obj));
    assert.ok(!e.hasListeners('click', fn));
    assert.ok(e.hasListeners('click'));

    e.off('click', fn, obj);
    assert.ok(!e.hasListeners('click', fn, obj));
    assert.ok(!e.hasListeners('click'));
});
QUnit.test('test emit()',  assert => {
    var e = new Events();
    e.on('click1', one => {
        assert.equal(1, one);
    });
    e.emit('click1', 1);

    e.on('click2', e => {
        assert.equal(2, e.a);
    });
    e.emit('click2', {
        a: 2
    });
});
QUnit.test('test check instance',  assert => {
    var e1 = new Events();
    var e2 = new Events();
    e1.on('click1', () => {

    });
    e2.on('click2', () => {

    });
    assert.ok(!e1.hasListeners('click2'));
    assert.ok(!e2.hasListeners('click1'));
});

QUnit.test('test once fire',  assert => {
    var e = new Events();
    var i = 0;
    e.once('click', () => i++);
    e.emit('click');
    e.emit('click');
    e.emit('click');
    assert.equal(i, 1);
});

QUnit.test('test emit without listeners',  assert => {
    var e = new Events();
    assert.notOk(e.hasListeners('click'));
    e.emit('click');
});
