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
export function camelCase(text) {
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
export function hyphenate(text) {
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
export function format(text, data) {
    return text.replace(/\{\{(.+?)\}\}/g, (_, name) => data[name] || '');
}
