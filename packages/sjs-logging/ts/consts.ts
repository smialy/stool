
export type LevelsType = { [key: string] : number };
export const LEVELS: LevelsType = {
    FATAL:    16,
    CRITICAL: 16,
    ERROR:    8,
    WARNING:  4,
    WARN:     4,
    INFO:     2,
    DEBUG:    1,
    NOTSET:   0
};

export interface LevelsNamesType {
    [index: number] : string
}

export const LEVEL_NAMES: LevelsNamesType = {
    16:      'FATAL',
    8:       'ERROR',
    4:       'WARN',
    2:       'INFO',
    1:       'DEBUG',
    0:       'NOTSET'
};
