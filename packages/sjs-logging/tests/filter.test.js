import {
    LEVELS,
    LEVEL_NAMES
} from '../src/consts';
import {
    Filter,
    Filterer
} from '../src/filter';


QUnit.module('sjs-logging.Filters');

QUnit.test('Filter', assert => {
    let filter = new Filter('a.b');

    assert.notOk(filter.filter({name:'a'}), 'a.b FAIL a');
    assert.notOk(filter.filter({name:'a.bc'}), 'a.bc FAIL a.b');
    assert.ok(filter.filter({name:'a.b'}), 'a.b PASS a.b');
    assert.ok(filter.filter({name:'a.b.c'}), 'a.b.c PASS a.b');
});

QUnit.test('Filterer.addFilter(filter)', assert => {
    let filter = new Filterer();
    assert.throws(() => filter.addFilter(null), 'Add undefined filter');
    assert.ok(filter.addFilter(new Filter('a')));
    assert.ok(filter.addFilter(record => record.name === 'a'));
});


QUnit.test('Filterer.filter', assert => {
    let filter = new Filterer();
    filter.addFilter(new Filter('a.b'));
    assert.notOk(filter.filter({name:'a'}), 'a.b FAIL a');
    assert.notOk(filter.filter({name:'a.bc'}), 'a.bc FAIL a.b');
    assert.ok(filter.filter({name:'a.b'}), 'a.b PASS a.b');
    assert.ok(filter.filter({name:'a.b.c'}), 'a.b.c PASS a.b');
});

QUnit.test('Filterer.removeFilter()', assert => {
    let filter = new Filterer();
    let f = new Filter('a.b');
    filter.addFilter(f);
    filter.removeFilter(f);
    assert.ok(filter.filter({name:'a'}), 'a.b PASS a');
    assert.ok(filter.filter({name:'a.bc'}), 'a.bc PASS a.b');
    assert.ok(filter.filter({name:'a.b'}), 'a.b PASS a.b');
    assert.ok(filter.filter({name:'a.b.c'}), 'a.b.c PASS a.b');
});
