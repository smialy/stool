export function ready(): Promise<any> {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', loaded, false);
            window.addEventListener('load', loaded, false);
        }
        function loaded() {
            document.removeEventListener('DOMContentLoaded', loaded, false);
            window.removeEventListener('load', loaded, false);
            resolve();
        }
    });
}

export function classNames(...args: any[]): string {
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
            const cn = classNames(...arg);
            if (cn) {
                classes.add(cn);
            }
        } else if (type === 'object') {
            for (const key of Object.keys(arg)) {
                if (arg[key]) {
                    classes.add(key);
                }
            }
        }
    }
    return [...classes].join(' ').trim();
}

export function findParent(element: HTMLElement, selector: string): HTMLElement|null {
    while (element !== document.body) {
        if (element.classList.contains(selector)) {
            return element;
        }
        element = element.parentNode as HTMLElement;
    }
    return null;
}
