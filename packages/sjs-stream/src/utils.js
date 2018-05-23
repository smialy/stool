export const noop = () => { };
export function toObserver(onData, onError, onComplete) {
    if (typeof onData === 'function') {
        return {
            onData,
            onError: onError || noop,
            onComplete: onComplete || noop
        };
    }
    return Object.assign({
        onData: noop,
        onError: noop,
        onComplete: noop
    }, onData || {});
}
export function runMethod(method, ...args) {
    if (typeof method === 'function') {
        try {
            method(...args);
        }
        catch (e) {
            console.error(e);
        }
    }
}
export function enqueue(fn) {
    Promise.resolve().then(() => {
        try {
            fn();
        }
        catch (e) {
            console.error(e);
        }
    });
}
