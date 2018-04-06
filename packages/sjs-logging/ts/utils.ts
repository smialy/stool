import {LEVELS} from './consts';


const NAMES = Object.keys(LEVELS);

/**
 * @param {nuber} level Log level
 * @return {number}
 */
export function levelToMask(level: number) {
    return level === LEVELS.NOTSET ? LEVELS.NOTSET : level * 2 - 1;
}

/**
 *
 * @param {numbe|string} level
 */
export function checkLevel(level: number|string): number {
    let type = typeof level;
    if(type === 'number'){
        return <number>level;
    }else if(type === 'string'){
        if(NAMES.includes(''+level)){
            return <number>LEVELS[level];
        }
    }
    let msg = `Level not number or valid string: "${level}" [${NAMES}]`;
    throw TypeError(msg);
}