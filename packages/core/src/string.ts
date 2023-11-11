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

export function clsx(...args: any[]): string {
    const classes = new Set<string>();
    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (!arg) {
            continue;
        }
        const type = typeof arg;
        if (type === 'string' || type === 'number') {
            classes.add(arg);
        } else if (Array.isArray(arg)) {
            const cn = clsx(...arg);
            if (cn) {
                classes.add(cn);
            }
        } else if (type === 'object') {
            for (const key of Object.keys(arg)) {
                if (key !== 'undefined' && arg[key]) {
                    classes.add(key);
                }
            }
        }
    }
    return [...classes].join(' ').trim();
}

