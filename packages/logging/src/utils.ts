import { Levels } from './consts';

const NAMES = Object.keys(Levels);

export function checkLevel(level: number | string): number {
    if (typeof level === 'number') {
        return level;
    }

    if (typeof level === 'string') {
        const normalizedLevel = level.toUpperCase();
        if (NAMES.includes(normalizedLevel)) {
            return Levels[normalizedLevel] as number;
        }
    }

    throw new TypeError(`Level is not number or valid string: "${level}" [${NAMES.join(', ')}]`);
}

export function isException(ex: unknown): ex is Error {
    return (
        ex instanceof Error ||
        (typeof ex === 'object' && ex !== null && 'message' in ex && 'stack' in ex)
    );
}
