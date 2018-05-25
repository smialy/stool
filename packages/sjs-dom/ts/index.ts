
export function ready(): Promise<any> {
    return new Promise(resolve => {
        if(document.readyState === 'complete'){
            resolve();
        }else{
            document.addEventListener('DOMContentLoaded', loaded, false);
            window.addEventListener('load', loaded, false);
        }
        function loaded(){
            document.removeEventListener('DOMContentLoaded', loaded, false);
            window.removeEventListener('load', loaded, false);
            resolve();
        }
    });
}

export function findParent(element: HTMLElement, selector: string): HTMLElement|null {
    while(element !== document.body) {
        if(element.classList.contains(selector)) {
            return element;
        }
        element = <HTMLElement>element.parentNode;
    }
    return null;
}
