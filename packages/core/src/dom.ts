import { Observable } from './observer';

export class DOM {
    static ready(): Promise<void> {
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

    static findParent(element: HTMLElement, selector: string): HTMLElement|null {
        while (element !== document.body) {
            if (element.classList.contains(selector)) {
                return element;
            }
            element = element.parentNode as HTMLElement;
        }
        return null;
    }

    static importStyles(styles: string[] | string, name: string = '@stool/dom'): () => void {
        const text = (Array.isArray(styles) ? styles : [styles]).join("\n");
        const element = document.createElement('style');
        element.dataset.name = name;
        element.innerHTML = text;
        document.head.appendChild(element);
        return () => element?.parentNode?.removeChild(element);
    }

    static fromEvent(element: HTMLElement, eventName: string): Observable<EventTarget> {
        return new Observable(observer => {
            let handler = event => observer.next(event);
            element.addEventListener(eventName, handler, true);
            return () => element.removeEventListener(eventName, handler, true);
        });
    }
}
