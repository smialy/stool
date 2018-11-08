"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.camelCase = camelCase;
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
exports.hyphenate = hyphenate;
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
exports.format = format;
