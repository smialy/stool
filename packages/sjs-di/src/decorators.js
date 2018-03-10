export function Inject(...args) {
    return function (target, key, descriptor) {
        // is function, not class constructor
        if (descriptor) {
            const fn = descriptor.value;
            fn.inject = args;
        }
        else {
            // class
            target.inject = args;
        }
    };
}
