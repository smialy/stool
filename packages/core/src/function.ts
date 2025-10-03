export const noop = () => {}; // eslint-disable-line

export type IDebounceHandler = (self: any, ...args: any[]) => void;

/**
 * Creates a debounced function that delays the invocation of the input function
 * until after a specified wait time has elapsed since the last time it was called.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - A debounced version of the input function.
 */
export function debounce(fn: () => void, wait: number): IDebounceHandler {
    let timer: any;
    return (self: any, ...args: any): void => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(self, args), wait);
    };
}
/**
 * Creates a throttled function that only invokes the input function
 * at most once per every specified wait time period.
 *
 * @param {Function} fn - The function to throttle.
 * @param {number} wait - The number of milliseconds to wait before allowing another call.
 * @returns {Function} - A throttled version of the input function.
 */
export function throttle(fn: () => void, wait: number) {
    let lastCallTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCallTime >= wait) {
            lastCallTime = now;
            fn.apply(this, args);
        }
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
 */
export function tr<T = any>(...args: (() => T)[]): T | undefined {
    for (const fn of args) {
        try {
            return fn();
        } catch (e) {
            // noop
        }
    }
}

