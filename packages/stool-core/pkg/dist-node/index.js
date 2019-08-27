'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const toStr = Object.prototype.toString;
const map = buildTypesMap();

const getTag = value => toStr.call(value);
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

const prepareType = expectType => o => map[getTag(o)] === expectType;

const isNull = o => o === null;
const isUndefined = o => o === undefined;
/**
 * @type {Function}
 * @return {Boolean}
 */

const isArray = Array.isArray;
/**
 * @type {Function}
 * @return {Boolean}
 */

const isRegExp = prepareType('regexp');
/**
 * @type {Function}
 * @return {Boolean}
 */

const isDate = prepareType('date');
/**
 * @method stool.isObject
 * @return {Boolean}
 */

const isObject = o => o != null && typeof o === 'object';
/**
 * @method stool.isNumber
 * @return {Boolean}
 */

const isNumber = o => typeof o === 'number';
/**
 * @method stool.isString
 * @return {Boolean}
 */

const isString = o => getType(o) === 'string';
/**
 * @method stool.isFunction
 * @return {Boolean}
 */

const isFunction = o => typeof o === 'function';
const isGenerator = o => getTag(o) === '[object GeneratorFunction]';
const isAsync = o => getTag(o) === '[object AsyncFunction]';
const isSymbol = o => getType(o) === 'symbol';
const isSet = o => getTag(o) === '[object Set]';
const isMap = o => getTag(o) === '[object Map]';
/**
 * @method stool.isBoolean
 * @return {Boolean}
 */

const isBoolean = o => typeof o === 'boolean';
/**
 * @method stool.isElement
 * @return {Boolean}
 */

const isElement = o => getType(o) === 'element';
/**
 * @method stool.isTextnode
 * @return {Boolean}
 */

const isTextnode = o => getType(o) === 'textnode';
/**
 * @method stool.isWhitespace
 * @return {Boolean}
 */

const isWhitespace = o => getType(o) === 'whitespace';
/**
 * @method stool.isCollection
 * @return {Boolean}
 */

const isCollection = o => getType(o) === 'collection';

function buildTypesMap() {
  const types = {};
  const names = ['Number', 'String', 'Function', 'AsyncFunction', 'GeneratorFunction', 'Array', 'Object', 'Date', 'RegExp', 'Boolean', 'Arguments', 'Symbol'];

  for (const name of names) {
    types['[object ' + name + ']'] = name.toLowerCase();
  }

  types['[object AsyncFunction]'] = 'async';
  return types;
}

const random = Math.random;
/**
 * Generate random number
 *
 * @example
 *      > randomInt(10)
 *      [0..9]
 *
 *      > randomInt(5, 10)
 *      [5..9]
 *
 * @method random
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */

function randomInt(min, max = 0) {
  if (max === 0) {
    max = min;
    min = 0;
  }

  return parseInt('' + (Math.random() * (max - min) + min), 10);
}
/**
 * Return a random element from the non-empty sequence seq
 *
 * @example
 *      > choice()
 *      null
 *
 *      > choice([1,2,3])
 *      // 1 or 2 or 3
 *
 * @param {ArrayLike} sequence
 * @return {any}
 */

function choice(sequence) {
  if (sequence && sequence.length) {
    return sequence[randomInt(sequence.length)];
  }

  return null;
}
/**
 * Generate unique string
 *
 * @example
 *      > sid()
 *      'IBA1CCRQ69NIELNLBG65WHHEGNVGQPO1' (32)
 *
 *      > sid(3)
 *      'WK5' (3)
 *
 * @method sid
 * @param {Number} [len=32] Hash length
 * @return {String}
 */

function sid(len = 32) {
  // start from letter (can be use as DOM id)
  let id = String.fromCharCode(Math.floor(Math.random() * 25 + 65));

  while (id.length < len) {
    // between [48,57](number) + [65,90](ascii)
    const code = Math.floor(Math.random() * 42 + 48);

    if (code < 58 || code > 64) {
      id += String.fromCharCode(code);
    }
  }

  return id;
}
/**
 * Genereate sequense hash
 *
 * @example
 *      const uid = createUID()
 *      > uid()
 *      '2c'
 *
 *      > uid()
 *      '2d'
 *
 * @method uid
 * @return {String}
 */

function createUID(uid = ['0']) {
  return () => {
    let i = uid.length;

    while (i--) {
      if (uid[i] === '9') {
        uid[i] = 'A';
        return uid.join('');
      }

      if (uid[i] === 'Z') {
        uid[i] = '1';
      } else {
        uid[i] = String.fromCharCode(uid[i].charCodeAt(0) + 1);
        return uid.join('');
      }
    }

    uid.unshift('0');
    return uid.join('');
  };
}

const noop = () => {}; // tslint:disable-line

function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
/*
 * Pick first value without error
 *
 * @example
 *      tr(function(){
 *          throw 1;
 *      }, function(){
 *          return 2
 *      });
 *
 * @method tr
 * @return {Object}
 */

function tr(...args) {
  for (const fn of args) {
    try {
      return fn();
    } catch (e) {// noop
    }
  }

  return null;
}
/**
 * Clone object
 *
 * @example
 *      > let t1 = [1,2,3];
 *      > let t2 = t1;
 *      > t1 === t2
 *      true
 *
 *      > t2 = clone(t1);
 *      > t1 === t2
 *      false
 *
 * @type {Function}
 * @param {Object} obj
 * @return {Object}
 */

const MARKER = Symbol('~~clone-marker~~');

function cloneInner(o, m = null) {
  if (!o) {
    return o;
  }

  const t = getType(o);

  if (t === 'date') {
    return new Date(o.getTime());
  }

  if (t === 'array' || t === 'object') {
    if (o[MARKER]) {
      return m[o[MARKER]];
    }

    const clear = !m;
    m = m || {};
    const sid$1 = sid();
    o[MARKER] = sid$1;
    m[sid$1] = o;

    let _;

    switch (t) {
      case 'array':
        _ = [];

        for (let i = 0, l = o.length; i < l; ++i) {
          _.push(cloneInner(o[i], m));
        }

        break;

      case 'object':
        _ = {};

        for (const key of Object.keys(o)) {
          _[key] = cloneInner(o[key], m);
        }

        break;
    }

    if (clear) {
      for (const key of Object.keys(m)) {
        if (m[key][MARKER]) {
          m[key][MARKER] = null;
          delete m[key][MARKER];
        }
      }
    }

    return _;
  }

  return t === 'date' ? new Date(o.getTime()) : o;
}

const clone = o => cloneInner(o);

/**
 * Camel case text
 *
 * @example
 *      > camelCase('a-b-c');
 *      aBC
 *
 * @method camelCase
 * @param {String} text
 * @return {String}
 */
function camelCase(text) {
  return text.replace(/-(.)/g, (_, char) => char.toUpperCase());
}
/**
 * Hyphenate text
 *
 * @example
 *      > hyphenate('aBC');
 *      a-b-c
 *
 * @method hyphenate
 * @param {String} text
 * @return {String}
 */

function hyphenate(text) {
  return text.replace(/[A-Z]/g, match => '-' + match.charAt(0).toLowerCase());
}
/**
 * Format string
 *
 * @example
 *      > format('Hello {{name}}!!!', {name:'Bill'});
 *      'Hello Bill!!!'
 *
 * @method format
 * @param {String} text
 * @param {Object} data
 */

function format(text, data) {
  return text.replace(/\{\{(.+?)\}\}/g, (_, name) => data[name] || '');
}

exports.camelCase = camelCase;
exports.choice = choice;
exports.clone = clone;
exports.createUID = createUID;
exports.debounce = debounce;
exports.format = format;
exports.getType = getType;
exports.hyphenate = hyphenate;
exports.isArray = isArray;
exports.isAsync = isAsync;
exports.isBoolean = isBoolean;
exports.isCollection = isCollection;
exports.isDate = isDate;
exports.isElement = isElement;
exports.isFunction = isFunction;
exports.isGenerator = isGenerator;
exports.isMap = isMap;
exports.isNull = isNull;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isRegExp = isRegExp;
exports.isSet = isSet;
exports.isString = isString;
exports.isSymbol = isSymbol;
exports.isTextnode = isTextnode;
exports.isUndefined = isUndefined;
exports.isWhitespace = isWhitespace;
exports.noop = noop;
exports.random = random;
exports.randomInt = randomInt;
exports.sid = sid;
exports.tr = tr;
//# sourceMappingURL=index.js.map
