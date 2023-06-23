import { Observable } from '@stool/core';

export function ready(): Promise<void> {
    return new Promise(resolve => {
        if (typeof document === 'undefined') {
            resolve();
        }
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

export function importStyles(styles: string[] | string, name: string = '@stool/dom'): () => void {
    styles = Array.isArray(styles) ? styles : [styles];
    const element = document.createElement('style');
    element.dataset.name = name;
    element.innerHTML = styles.join("\n");
    document.head.appendChild(element);
    return () => element?.parentNode?.removeChild(element);
}

export function fromEvent(element: HTMLElement, eventName: string): Observable<EventTarget> {
    return new Observable(observer => {
        let handler = event => observer.next(event);
        element.addEventListener(eventName, handler, true);
        return () => element.removeEventListener(eventName, handler, true);
    });
}
