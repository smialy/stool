export function elapsed() {
    const start = new Date().getTime();
    return () => {
        const end = new Date().getTime();
        let time = end - start;
        let sufix = 'ms';
        if (time >= 1000) {
            time = time / 1000;
            sufix = 'sec';
        }
        return `${time}${sufix}`;
    };
}
