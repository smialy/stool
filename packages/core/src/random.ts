export const random = Math.random;

/**
 * Generate random number
 *
 * @example
 *      > randomInt(10)
 *      [0..9]
 *
 *      > randomInt(5, 10)
 *      [5..9]
 */
export function randomInt(min: number, max = 0): number {
    if (max === 0) {
        max = min;
        min = 0;
    }
    return parseInt('' + (Math.random() * (max - min) + min), 10);
}

/**
 * Return a random element from the non-empty sequence seq
 *
 * @example
 *      > choice()
 *      null
 *
 *      > choice([1,2,3])
 *      // 1 or 2 or 3
 *
 */
export function choice<T extends any>(sequence: T[]): T {
    return sequence[randomInt(sequence.length)];
}

/**
 * Generate unique string
 *
 * @example
 *      > sid()
 *      'IBA1CCRQ69NIELNLBG65WHHEGNVGQPO1' (32)
 *
 *      > sid(3)
 *      'WK5' (3)
 *
 */
export function sid(len = 32): string {
    // start from letter (can be use as DOM id)
    let id = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
    while (id.length < len) {
        // between [48,57](number) + [65,90](ascii)
        const code = Math.floor(Math.random() * 42 + 48);
        if (code < 58 || code > 64) {
            id += String.fromCharCode(code);
        }
    }
    return id;
}

/**
 * Genereate sequense hash
 *
 * @example
 *      const uid = createUID()
 *      > uid()
 *      '2c'
 *
 *      > uid()
 *      '2d'
 *
 */
export function uidFactory(uid: [string] = ['0']): () => string {
    return () => {
        let i = uid.length;
        while (i--) {
            if (uid[i] === '9') {
                uid[i] = 'A';
                return uid.join('');
            }
            if (uid[i] === 'Z') {
                uid[i] = '1';
            } else {
                uid[i] = String.fromCharCode(uid[i].charCodeAt(0) + 1);
                return uid.join('');
            }
        }
        uid.unshift('0');
        return uid.join('');
    };
}
