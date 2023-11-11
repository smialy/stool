export const noop = () => {}; // eslint-disable-line

export type IDebounceHandler = (self: any, ...args: any[]) => void;

export function debounce(fn: () => void, wait: number): IDebounceHandler {
    let timer: any;
    return (self: any, ...args: any): void => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(self, args), wait);
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

