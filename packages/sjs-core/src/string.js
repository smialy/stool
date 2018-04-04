
/**
 * Camel case text
 *
 * @example
 *      > camelCase('a-b-c');
 *      aBC
 *
 * @method camelCase
 * @param {String} txt
 * @return {String}
 */
export function camelCase(txt) {
    return txt.replace(/-(.)/g, (_, char) => char.toUpperCase());
}

/**
 * Hyphenate text
 *
 * @example
 *      > hyphenate('aBC');
 *      a-b-c
 *
 * @method hyphenate
 * @param {String} txt
 * @return {String}
 */
export function hyphenate (txt) {
    return txt.replace(/[A-Z]/g,
        match => '-' + match.charAt(0).toLowerCase()
    );
}

/**
 * Format string
 *
 * @example
 *      > format('Hello {{name}}!!!', {name:'Bill'});
 *      'Hello Bill!!!'
 *
 * @method format
 * @param {String} txt
 * @param {Object} data
 */
export function format(txt, data) {
    return txt.replace(/\{\{(.+?)\}\}/g, (_, name) => data[name] || '');
}
