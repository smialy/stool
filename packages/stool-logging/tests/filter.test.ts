import {
    Filter,
    Filterer
} from '../src/filter';
import { IRecord } from '../src/interfaces';


QUnit.module('@stool/logging.Filters');

function makeRecord(name: string): IRecord {
    return {
        name,
        level: 1,
    }
}

QUnit.test('Filter', assert => {
    let filter = new Filter('a.b');

    assert.notOk(filter.filter(makeRecord('a')), 'a.b FAIL a');
    assert.notOk(filter.filter(makeRecord('a.bc')), 'a.bc FAIL a.b');
    assert.ok(filter.filter(makeRecord('a.b')), 'a.b PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b.c')), 'a.b.c PASS a.b');
});

QUnit.test('Filterer.addFilter(filter)', assert => {
    let filter = new Filterer();
    assert.ok(filter.addFilter(new Filter('a')));
    assert.ok(filter.addFilter(record => record.name === 'a'));
});


QUnit.test('Filterer.filter', assert => {
    let filter = new Filterer();
    filter.addFilter(new Filter('a.b'));
    assert.notOk(filter.filter(makeRecord('a')), 'a.b FAIL a');
    assert.notOk(filter.filter(makeRecord('a.bc')), 'a.bc FAIL a.b');
    assert.ok(filter.filter(makeRecord('a.b')), 'a.b PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b.c')), 'a.b.c PASS a.b');
});

QUnit.test('Filterer.removeFilter()', assert => {
    let filter = new Filterer();
    let f = new Filter('a.b');
    filter.addFilter(f);
    filter.removeFilter(f);
    assert.ok(filter.filter(makeRecord('a')), 'a.b PASS a');
    assert.ok(filter.filter(makeRecord('a.bc')), 'a.bc PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b')), 'a.b PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b.c')), 'a.b.c PASS a.b');
});
