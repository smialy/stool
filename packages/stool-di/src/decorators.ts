
export function Inject(...args: any[]): any {
    return (target: any, key: string, descriptor: any): void => {
        // is function, not class constructor
        if (descriptor) {
            const fn = descriptor.value;
            fn.inject = args;
        } else {
            // class
            target.inject = args;
        }
    };
}
