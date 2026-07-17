export const collectDict = (vals, acc) => ({
    ...acc,
    ...Object.fromEntries(
        vals
            .split(',')
            .map((item) => item.split(':'))
            .map(([key, val]) => [key, val]),
    ),
});

export const collectList = (vals, acc = []) => [...acc, ...vals.split(',')];

export const increaseVerbose = (_, acc) => acc + 1;
