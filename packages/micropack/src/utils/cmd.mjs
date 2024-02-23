export const collectDict = (vals, acc) => ({
    ...acc,
    ...vals
        .split(',')
        .map((item) => item.split(':'))
        .reduce((acc, val) => {
            acc[val[0]] = val[1];
            return acc;
        }, {}),
});
export const collectList = (vals, acc=[]) => {
    return [...acc, ...vals.split(',')];
}
export const increaseVerbose = (_, acc) => (acc += 1);
