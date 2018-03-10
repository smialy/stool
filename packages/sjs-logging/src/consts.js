/**
 * @type {Object}
 * @param {number} LEVELS.ALL
 * @param {number} LEVELS.FATAL
 * @param {number} LEVELS.CRITICAL
 * @param {number} LEVELS.ERROR
 * @param {number} LEVELS.WARNING
 * @param {number} LEVELS.WARN
 * @param {number} LEVELS.INFO
 * @param {number} LEVELS.DEGUG
 * @param {number} lelves.NOTSET
 */
var LEVELS = {
    ALL:      1024,
    FATAL:    16,
    CRITICAL: 16,
    ERROR:    8,
    WARNING:  4,
    WARN:     4,
    INFO:     2,
    DEBUG:    1,
    NOTSET:   0
};

/**
 * @type {Object}
 * @param {string} LEVELS.FATAL
 * @param {string} LEVELS.CRITICAL
 * @param {string} LEVELS.ERROR
 * @param {string} LEVELS.WARNING
 * @param {string} LEVELS.WARN
 * @param {string} LEVELS.INFO
 * @param {string} LEVELS.DEGUG
 * @param {string} lelves.NOTSET
 */
var LEVEL_NAMES = {
    FATAL:   'FATAL',
    CRITICAL:'CRITICAL',
    ERROR:   'ERROR',
    WARNING: 'WARN',
    WARN:    'WARN',
    INFO:    'INFO',
    DEBUG:   'DEBUG',
    NOTSET:  'NOTSET',
    16:      'FATAL',
    8:       'ERROR',
    4:       'WARN',
    2:       'INFO',
    1:       'DEBUG',
    0:       'NOTSET'
};

/**
 * @param {nuber} level Log level
 * @return {number}
 */
function LEVEL_TO_MASK(level) {
    return level === LEVELS.NOTSET ? LEVELS.NOTSET : level * 2 - 1;
}

export {
    LEVELS,
    LEVEL_NAMES,
    LEVEL_TO_MASK
};
