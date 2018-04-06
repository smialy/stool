
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
export function camelCase(text: string) {
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
export function hyphenate (text: string) {
    return text.replace(/[A-Z]/g,
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
 * @param {String} text
 * @param {Object} data
 */
export function format(text: string, data: {[index: string]: any}) {
    return text.replace(/\{\{(.+?)\}\}/g, (_, name) => data[name] || '');
}