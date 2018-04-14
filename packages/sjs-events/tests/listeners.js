import {Listeners} from '../src/index';


QUnit.module('sjs-events::Listeners');

QUnit.test('test add(simple + fn)',  assert => {
    var e = new Listeners();
    var fn = () => {};
    var obj = {};
    assert.ok(!e.has(fn));
    e.add(fn, obj);
    e.add(fn);

    assert.ok(e.has(fn, obj));
    assert.ok(e.has(fn));

    e.remove(fn);

    assert.ok(e.has(fn, obj));
    assert.ok(!e.has(fn));

    e.remove(fn, obj);
    assert.ok(!e.has(fn, obj));
    assert.equal(0, e.size());

});
QUnit.test('test emit()',  assert => {
    var e = new Listeners();
    e.add(one => {
        assert.equal(1, one);
    });
    e.emit(1);

    e = new Listeners();
    e.add(e => {
        assert.equal(2, e.a);
    });
    e.emit({
        a: 2
    });
});
QUnit.test('test check instance',  assert => {
    var e1 = new Listeners();
    var e2 = new Listeners();
    e1.add(() => {

    });
    e2.add(() => {

    });
    assert.equal(1, e1.size());
    assert.equal(1, e2.size());

    e1.clear();
    assert.equal(0, e1.size());
    assert.equal(1, e2.size());
});
