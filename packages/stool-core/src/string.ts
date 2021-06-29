/**
 * Camel case text
 *
 * @example
 *      > camelCase('a-b-c');
 *      aBC
 */
export function camelCase(text: string): string {
    return text.replace(/-(.)/g, (_, char) => char.toUpperCase());
}

/**
 * Hyphenate text
 *
 * @example
 *      > hyphenate('aBC');
 *      a-b-c
 */
export function hyphenate(text: string): string {
    return text.replace(/[A-Z]/g, match => '-' + match.charAt(0).toLowerCase());
}

/**
 * Format string
 *
 * @example
 *      > format('Hello {{name}}!!!', {name:'Bill'});
 *      'Hello Bill!!!'
 */
export function format(text: string, data: { [index: string]: any }): string {
    return text.replace(/\{\{(.+?)\}\}/g, (_, name) => data[name] || '');
}
