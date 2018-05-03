export function ready() {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        }
        else {
            document.addEventListener("DOMContentLoaded", loaded, false);
            window.addEventListener("load", loaded, false);
        }
        function loaded() {
            document.removeEventListener("DOMContentLoaded", loaded, false);
            window.removeEventListener("load", loaded, false);
            resolve();
        }
    });
}
