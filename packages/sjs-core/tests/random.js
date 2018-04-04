import {sid, random, choice, createUID} from '../src/random'

QUnit.test('create sid by sid()', assert => {
    assert.ok(sid());
    let items = new Set();
    for (let i = 0; i < 1000; i++) {
        let value = sid();
        if (items.has(value)) {
            fail('Find sid: ' + value);
        }
        items.add(value)
    }
    assert.equal(32, sid().length);
    assert.equal(100, sid(100).length);
});

QUnit.test('Match.random()', assert => {
    let min = 0;
    let max = 1;
    for (let i = 0; i < 100; i++) {
        let r = random();
        assert.ok(r > min, `Excpected random number: r > ${min} is ${r}`);
        assert.ok(r < max, `Excpected random number: r < ${max} is ${r}`);
    }
});

QUnit.test('random(max)', assert => {
    let min = 0;
    let max = 10;
    for (let i = 0; i < 100; i++) {
        let r = random(10);
        assert.ok(r >= min, `Excpected random number: r >= ${min} is ${r}`);
        assert.ok(r < max, `Excpected random number: r <= ${max} is ${r}`);
    }
});

QUnit.test('random(min, max)', assert => {
    let min = 10;
    let max = 20;
    for (let i = 0; i < 100; i++) {
        let r = random(10, 20);
        assert.ok(r >= min, `Excpected random number: r >= ${min} is ${r}`);
        assert.ok(r < max, `Excpected random number: r <= ${max} is ${r}`);
    }
});

QUnit.test('choice()', assert => {
    assert.equal(choice(), null);
});

QUnit.test('choice([1])', assert => {
    assert.equal(choice([1]), 1);
});

QUnit.test('choice([1,2,3])', assert => {
    const seq = [1,2,3];
    for(let i = 0; i < 10; i += 1){
        assert.ok(seq.includes(choice(seq)));
    }
});

QUnit.test('choice([1,2,3])', assert => {
    const seq = {0:'a', 1:'b', length:2};
    for(let i = 0; i < 10; i += 1){
        assert.ok(['a', 'b'].includes(choice(seq)));
    }
});

QUnit.test('createUID()', assert => {
    let uid = createUID();
    assert.equal(uid(), '1');
    assert.equal(uid(), '2');
    assert.equal(uid(), '3');

    for (let i = 0; i < 100; i++) { uid(); }
    assert.equal('1Y', uid());

    for (let i = 0; i < 100; i++) { uid(); }
    assert.equal(uid(), '4U');
    assert.equal(uid(), '4V');

    let newUid = createUID();
    assert.equal(newUid(), '1');
});

