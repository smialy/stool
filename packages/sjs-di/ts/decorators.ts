
export function Inject(...args: any[]): any {
    return function (target: any, key: string, descriptor: any) {
        // is function, not class constructor
        if (descriptor) {
            const fn = descriptor.value;
            fn.inject = args;
        } else {
            // class
            target.inject = args;
        }
    }
}
