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
export declare function camelCase(text: string): string;
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
export declare function hyphenate(text: string): string;
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
export declare function format(text: string, data: {
    [index: string]: any;
}): string;
