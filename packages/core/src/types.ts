const toStr = Object.prototype.toString;
const map = buildTypesMap();
const getTag = (value: any) => toStr.call(value);

/**
 * Detect object type
 *
 * @return {string} [null,undefined,string,number,array,function,regexp,date,boolean,object]
 */
export function getType(o: any): string {
    if (o === null) {
        return 'null';
    }
    if (o === undefined) {
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
            return /\S/.test(o.nodeValue) ? 'textnode' : 'whitespace';
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

const prepareType = (expectType: string) => (o: any) => map[getTag(o)] === expectType;

export const isNull = (o: any) => o === null;

export const isUndefined = (o: any) => o === undefined;

export const isNil = (o: any) => o === null || o === undefined;

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
 * @method stool.isObject
 * @return {Boolean}
 */
export const isObject = (o: any) => o != null && typeof o === 'object';

/**
 * @method stool.isNumber
 * @return {Boolean}
 */
export const isNumber = (o: any) => typeof o === 'number';
/**
 * @method stool.isString
 * @return {Boolean}
 */
export const isString = (o: any) => getType(o) === 'string';
/**
 * @method stool.isFunction
 * @return {Boolean}
 */
export const isFunction = (o: any) => typeof o === 'function';

export const isGenerator = (o: any) => getTag(o) === '[object GeneratorFunction]';

export const isAsync = (o: any) => getTag(o) === '[object AsyncFunction]';

export const isSymbol = (o: any) => getType(o) === 'symbol';

export const isSet = (o: any) => getTag(o) === '[object Set]';

export const isMap = (o: any) => getTag(o) === '[object Map]';

/**
 * @method stool.isBoolean
 * @return {Boolean}
 */
export const isBoolean = (o: any) => typeof o === 'boolean';

/**
 * @method stool.isElement
 * @return {Boolean}
 */
export const isElement = (o: any) => getType(o) === 'element';

/**
 * @method stool.isTextnode
 * @return {Boolean}
 */
export const isTextnode = (o: any) => getType(o) === 'textnode';

/**
 * @method stool.isWhitespace
 * @return {Boolean}
 */
export const isWhitespace = (o: any) => getType(o) === 'whitespace';

/**
 * @method stool.isCollection
 * @return {Boolean}
 */
export const isCollection = (o: any) => getType(o) === 'collection';

function buildTypesMap(): { [index: string]: string } {
    const types = {};
    const names = [
        'Number',
        'String',
        'Function',
        'AsyncFunction',
        'GeneratorFunction',
        'Array',
        'Object',
        'Date',
        'RegExp',
        'Boolean',
        'Arguments',
        'Symbol',
    ];
    for (const name of names) {
        types['[object ' + name + ']'] = name.toLowerCase();
    }
    types['[object AsyncFunction]'] = 'async';
    return types;
}
