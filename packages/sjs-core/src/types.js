const toStr = Object.prototype.toString;
const map = buildTypesMap();
const getTag = value => toStr.call(value);

/**
 * Detect object type
 *
 * @method sjs.type
 * @return {Mixed} [null,undefined,string,number,array,function,regexp,date,boolean,object]
 */
export function getType(o) {
    if (o === null) {
        return 'null';
    }
    if(o === undefined){
        return 'undefined';
    }

    const type = typeof o;
    switch (type) {
        case 'function':
        case 'undefined':
        case 'string':
        case 'number':
        case 'boolean':
        case 'symbol':
            return type;
    }

    if (o.nodeName) {
        if (o.nodeType === 1) {
            return 'element';
        }
        if (o.nodeType === 3) {
            return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
        }
    }
    if (typeof o.length === 'number') {
        if ('callee' in o) {
            return 'arguments';
        }
        if ('item' in o) {
            return 'collection';
        }
    }
    return map[getTag(o)] || 'object';
}

const prepareType = expectType => o => map[getTag(o)] === expectType;

export const isNull = o => o === null;

export const isUndefined = o => o === undefined;

/**
 * @type {Function}
 * @return {Boolean}
 */
export const isArray = Array.isArray;

/**
 * @type {Function}
 * @return {Boolean}
 */
export const isRegExp = prepareType('regexp');

/**
 * @type {Function}
 * @return {Boolean}
 */
export const isDate = prepareType('date');

/**
 * @method sjs.isObject
 * @return {Boolean}
 */
export const isObject = o => o != null && typeof o === 'object';

/**
 * @method sjs.isNumber
 * @return {Boolean}
 */
export const isNumber = o => typeof o === 'number';
/**
 * @method sjs.isString
 * @return {Boolean}
 */
export const isString = o => getType(o) === 'string';
/**
 * @method sjs.isFunction
 * @return {Boolean}
 */
export const isFunction = o => typeof o === 'function';

export const isGenerator = o => getTag(o) === '[object GeneratorFunction]';

export const isAsync = o => getTag(o) === '[object AsyncFunction]';

export const isSymbol = o => getType(o) === 'symbol';

export const isSet = o => getTag(o) === '[object Set]';

export const isMap = o => getTag(o) === '[object Map]';

/**
 * @method sjs.isBoolean
 * @return {Boolean}
 */
export const isBoolean = o => typeof o === 'boolean';

/**
 * @method sjs.isElement
 * @return {Boolean}
 */
export const isElement = o => getType(o) === 'element';

/**
 * @method sjs.isTextnode
 * @return {Boolean}
 */
export const isTextnode = o => getType(o) === 'textnode';

/**
 * @method sjs.isWhitespace
 * @return {Boolean}
 */
export const isWhitespace = o => getType(o) === 'whitespace';

/**
 * @method sjs.isCollection
 * @return {Boolean}
 */
export const isCollection = o => getType(o) === 'collection';


function buildTypesMap() {
    const map = {};
    let names = ['Number', 'String', 'Function', 'AsyncFunction', 'GeneratorFunction', 'Array', 'Object', 'Date', 'RegExp', 'Boolean', 'Arguments', 'Symbol'];
    for (const name of names) {
        map['[object ' + name + ']'] = name.toLowerCase();
    }
    map['[object AsyncFunction]'] = 'async';
    return map;
}