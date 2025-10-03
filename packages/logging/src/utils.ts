import { Levels } from './consts';

const NAMES = Object.keys(Levels);

export function levelToMask(level: number) {
    return level === Levels.NOTSET ? Levels.NOTSET : level * 2 - 1;
}

export function checkLevel(level: number | string): number {
    const type = typeof level;
    if (type === 'number') {
        return level as number;
    } else if (type === 'string') {
        level = (level as string).toUpperCase();
        if (NAMES.includes('' + level)) {
            return Levels[level] as number;
        }
    }
    const msg = `Level is not number or valid string: "${level}" [${NAMES}]`;
    throw TypeError(msg);
}

export function isException(ex: any) {
    return !!(ex && ex.message && ex.stack);
}
