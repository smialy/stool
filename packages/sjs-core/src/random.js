/**
 * Generate random number
 *
 * @example
 *      > random();
 *      0.21633313838851365
 *
 *      > random(10)
 *      [0..10)
 *
 *      > random(5, 10)
 *      [5..10)
 *
 * @method random
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function random(min, max) {
    let l = arguments.length;
    if (l === 0) {
        return Math.random();
    } else if (l === 1) {
        max = min;
        min = 0;
    }
    return parseInt(Math.random() * (max - min) + min, 10);
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
 * @param {ArrayLike} sequence
 * @return {any}
 */
export function choice(sequence) {
    if(sequence && sequence.length) {
        return sequence[random(sequence.length)];
    }
    return null;
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
 * @method sid
 * @param {Number} [len=32] Hash length
 * @return {String}
 */
export function sid(len=32) {
    //start from letter (can be use as DOM id)
    let sid = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
    while (sid.length < len) {
        // between [48,57](number) + [65,90](ascii)
        let code = Math.floor((Math.random() * 42) + 48);
        if (code < 58 || code > 64) {
            sid += String.fromCharCode(code);
        }
    }
    return sid;
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
 * @method uid
 * @return {String}
 */
export function createUID(){
    const uid = ['0'];
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

