"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toStr = Object.prototype.toString;
const map = buildTypesMap();
const getTag = (value) => toStr.call(value);
/**
 * Detect object type
 *
 * @return {string} [null,undefined,string,number,array,function,regexp,date,boolean,object]
 */
function getType(o) {
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
exports.getType = getType;
const prepareType = (expectType) => (o) => map[getTag(o)] === expectType;
exports.isNull = (o) => o === null;
exports.isUndefined = (o) => o === undefined;
/**
 * @type {Function}
 * @return {Boolean}
 */
exports.isArray = Array.isArray;
/**
 * @type {Function}
 * @return {Boolean}
 */
exports.isRegExp = prepareType('regexp');
/**
 * @type {Function}
 * @return {Boolean}
 */
exports.isDate = prepareType('date');
/**
 * @method sjs.isObject
 * @return {Boolean}
 */
exports.isObject = (o) => o != null && typeof o === 'object';
/**
 * @method sjs.isNumber
 * @return {Boolean}
 */
exports.isNumber = (o) => typeof o === 'number';
/**
 * @method sjs.isString
 * @return {Boolean}
 */
exports.isString = (o) => getType(o) === 'string';
/**
 * @method sjs.isFunction
 * @return {Boolean}
 */
exports.isFunction = (o) => typeof o === 'function';
exports.isGenerator = (o) => getTag(o) === '[object GeneratorFunction]';
exports.isAsync = (o) => getTag(o) === '[object AsyncFunction]';
exports.isSymbol = (o) => getType(o) === 'symbol';
exports.isSet = (o) => getTag(o) === '[object Set]';
exports.isMap = (o) => getTag(o) === '[object Map]';
/**
 * @method sjs.isBoolean
 * @return {Boolean}
 */
exports.isBoolean = (o) => typeof o === 'boolean';
/**
 * @method sjs.isElement
 * @return {Boolean}
 */
exports.isElement = (o) => getType(o) === 'element';
/**
 * @method sjs.isTextnode
 * @return {Boolean}
 */
exports.isTextnode = (o) => getType(o) === 'textnode';
/**
 * @method sjs.isWhitespace
 * @return {Boolean}
 */
exports.isWhitespace = (o) => getType(o) === 'whitespace';
/**
 * @method sjs.isCollection
 * @return {Boolean}
 */
exports.isCollection = (o) => getType(o) === 'collection';
function buildTypesMap() {
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
