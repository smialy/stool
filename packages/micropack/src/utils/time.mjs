export function elapsed() {
    const start = Date.now();
    return () => {
        const time = Date.now() - start;
        if (time < 1000) {
            return `${time}ms`;
        }
        return `${time / 1000}sec`;
    };
}
