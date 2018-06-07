
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

export function classNames(...args: any[]): string {
    const classes: any[] = [];
    for(let arg of args){
        if(!arg){
            continue;
        }
        let type = typeof arg;
        if (type === 'string' || type === 'number') {
            classes.push(arg);
        }else if(Array.isArray(arg)){
            let cn = classNames(...arg);
            if(cn){
                classes.push(cn);
            }
        }else if(type === 'object') {
            for(let [key, value] of Object.entries(arg)) {
                if(value){
                    classes.push(key);
                }
            }
        }
    }
    return classes.join(' ');
}

export function dataset()