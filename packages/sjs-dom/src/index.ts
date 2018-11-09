
export function ready(): Promise<any> {
    return new Promise((resolve) => {
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

export function findParent(element: HTMLElement, selector: string): HTMLElement|null {
    while (element !== document.body) {
        if (element.classList.contains(selector)) {
            return element;
        }
        element = element.parentNode as HTMLElement;
    }
    return null;
}

export function classNames(...args: any[]): string {
    const classes: any[] = [];
    for (const arg of args) {
        if (!arg) {
            continue;
        }
        const type = typeof arg;
        if (type === 'string' || type === 'number') {
            classes.push(arg);
        } else if (Array.isArray(arg)) {
            const cn = classNames(...arg);
            if (cn) {
                classes.push(cn);
            }
        } else if (type === 'object') {
            for (const [key, value] of Object.entries(arg)) {
                if (value) {
                    classes.push(key);
                }
            }
        }
    }
    return classes.join(' ');
}
