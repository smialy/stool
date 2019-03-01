import * as utils from '../src/string';


QUnit.test('camelCase(string)', assert => {
    assert.expect(6);

    let map = {
        'foo-bar': 'fooBar',
        'foo-bar-baz': 'fooBarBaz',
        'a-b-c': 'aBC',
        '-o-attr': 'OAttr',
        '-moz-attr': 'MozAttr',
        '-ms-attr': 'MsAttr'
    };
    for (let name of Object.keys(map)) {
        assert.equal(utils.camelCase(name), map[name], 'Convert: ' + name + ' => ' + map[name]);
    }
});

QUnit.test('hyphenate(string)', assert => {
    assert.expect(6);

    let map = {
        'fooBar': 'foo-bar',
        'fooBarBaz': 'foo-bar-baz',
        'aBC': 'a-b-c',
        'OAttr': '-o-attr',
        'MozAttr': '-moz-attr',
        'MsAttr': '-ms-attr'
    };
    for (let name of Object.keys(map)) {
        assert.equal(utils.hyphenate(name), map[name], 'Convert: ' + name + ' => ' + map[name]);
    }
});

QUnit.test('empty format()', assert => {
    const text = 'Hello {{name}}!!!';
    const result = utils.format(text, {});
    assert.equal('Hello !!!', result);
});

QUnit.test('format()', assert => {
    const text = 'Hello {{name}}!!!';
    const result = utils.format(text, {name:'Bill'});
    assert.equal('Hello Bill!!!', result);
});
