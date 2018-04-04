import * as Types from '../src/types';


QUnit.test('import', assert =>
    assert.ok(typeof Types === 'object'));

QUnit.test('test type dectect sjs.type()', assert => {
    let type = Types.getType;
    assert.equal(type(null), 'null');
    assert.equal(type([]), 'array');
    assert.equal(type(1), 'number');
    assert.equal(type(1.1), 'number');
    assert.equal(type(function() {}), 'function');
    assert.equal(type({}), 'object');
    assert.equal(type(''), 'string');
    assert.equal(type('abc'), 'string');
    assert.equal(type(new String('a')), 'string');
    assert.equal(type(true), 'boolean');
    assert.equal(type(false), 'boolean');
    assert.equal(type(/test/g), 'regexp');
    assert.equal(type(new Date()), 'date');
    assert.equal(type(undefined), 'undefined');
    assert.equal(type(arguments), 'arguments');

    if(typeof document !== 'undefined'){
        assert.equal(type(document.createElement('div')), 'element');
        assert.equal(type(document.createTextNode('test')), 'textnode');
        assert.equal(type(document.createTextNode(' ')), 'whitespace');
        assert.equal(type(document.createElement('div').classList), 'collection');
        assert.equal(type(document.createElement('div').style), 'collection');
        assert.equal(type(document.createElement('div').dataset), 'object'); //no in ie10
    }
});

const TYPES_MAP = {
    integers: 1,
    floats: 1.2,
    hexs: 0x98,
    bins: 0b001010,
    octs: 0o00111,
    functions: function(){},
    functionsArrow:  () => {},
    functionsGenerator: function* gen(){ yield 1;},
    functionsAsync: async function asyn(){},
    arrays: [],
    arraysObj: new Array(),
    objects:  {},
    nulls: null,
    undefineds: undefined,
    stringsEmpty: '',
    strings: 'abc',
    stringsObj: new String('abc'),
    boolTrue: true,
    boolFalse: false,
    regexps:/test/g,
    regexpsObj: new RegExp('/abc/'),
    weakmaps: new WeakMap(),
    weaksets: new WeakSet(),
    symbols: Symbol.iterator,
    sets: new Set(),
    maps: new Map(),
    dates: new Date()
};

const TESTS = {
    isArray: ['arrays', 'arraysObj'],
    isRegExp: ['regexps', 'regexpsObj'],
    isDate: ['dates'],
    isObject: ['stringsObj', 'arrays', 'arraysObj', 'objects', 'regexps', 'regexpsObj' ,'weakmaps', 'weaksets', 'sets', 'maps', 'dates'],
    isNumber: ['integers', 'floats', 'octs', 'hexs', 'bins'],
    isString: ['strings', 'stringsObj', 'stringsEmpty'],
    isFunction: ['functions', 'functionsArrow', 'functionsGenerator', 'functionsAsync'],
    isAsync: ['functionsAsync'],
    isSymbol: ['symbols'],
    isGenerator: ['functionsGenerator'],
    isBoolean: ['boolTrue', 'boolFalse'],
    isNull: ['nulls'],
    isUndefined: ['undefineds'],
    isMap: ['maps'],
    isSet: ['sets']
};

QUnit.test('test type by name', assert => {
    for(let method of Object.keys(TESTS)){
        for(let type of Object.keys(TYPES_MAP)){
            let value = TYPES_MAP[type];
            let result = Types[method](value);
            let msg = getMsg(method, value, type, result);
            if(TESTS[method].indexOf(type) === -1){
                assert.notOk(result, msg);
            }else{
                assert.ok(result, msg);
            }
        }
    }
    function getMsg(method, value, type, result){
        try{
            return `${method}(${value}) => ${type} : ${result}`;
        }catch(e){ /*noop*/ }
        return `${method}(symbol) => ${type} : ${result}`;
    }
});
