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
export declare function random(min: number, max?: number): number;
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
export declare function choice(sequence: Array<any>): any;
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
export declare function sid(len?: number): string;
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
export declare function createUID(): Function;
