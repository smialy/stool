import * as utils from '../src/function';

QUnit.test('tr(fn,...)', assert => {
    assert.equal('test', utils.tr(() => {
        return 'test';
    }));
    assert.equal(null, utils.tr(() => {
        throw new Error('test');
    }));
    assert.equal('test2', utils.tr(() => {
        throw new Error('test');
    }, () => {
        return 'test2';
    }));
});

QUnit.test('clone(array)', assert => {
    let a1 = [1, 2, 3];
    let a2 = utils.clone(a1);

    assert.deepEqual(a1, a2);
    a2[1] = 22;
    assert.notDeepEqual(a1, a2);
    assert.equal(22, a2[1]);
});

QUnit.test('clone(empty array)', assert => {
    let a1 = [];
    let a2 = utils.clone(a1);
    assert.deepEqual(a1, a2);
    a2.push(1);
    assert.notDeepEqual(a1, a2);
});

QUnit.test('clone(empty object)', assert => {
    let o1 = {};
    let o2 = utils.clone(o1);
    assert.deepEqual(o1, o2);
    o2.b = 22;
    assert.notDeepEqual(o1, o2);
    assert.equal(22, o2.b);
});

QUnit.test('clone(object)', assert => {
    let o1 = {
        a: 1,
        b: 2,
        c: 3
    };
    let o2 = utils.clone(o1);
    assert.deepEqual(o1, o2);
    o2.b = 22;
    assert.notDeepEqual(o1, o2);
    assert.equal(22, o2.b);
});

QUnit.test('clone(date)', assert => {
    let d1 = new Date();
    let d2 = utils.clone(d1);
    assert.equal(d1.getTime(), d2.getTime());
    d2.setTime(d1.getTime() + 3600);
    assert.notDeepEqual(d1.getTime(), d2.getTime());
});

QUnit.test('clone(object 2)', assert => {
    let o1 = {
        a: 1,
        b: 2,
        c: 3,
        o1: {},
    };
    o1.o1 = o1;
    let o2 = utils.clone(o1);
    assert.deepEqual(o1, o2);
});

QUnit.test('clone()', assert => {
    let i1 = 1;
    let i2 = utils.clone(i1);
    assert.equal(i1, i2);
    i2 = 2;
    assert.notEqual(i1, i2);

    assert.equal(false, utils.clone(false));
    assert.equal(true, utils.clone(true));
    assert.equal(1.1, utils.clone(1.1));
    assert.equal('test', utils.clone('test'));
    assert.equal(null, utils.clone(null));
});
