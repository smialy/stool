#!/usr/bin/env node

import commander from 'commander';

import { DEFAULT_OPTIONS } from './consts.mjs';
import { setupExceptionHandler } from './utils/error.mjs';
import micropack from './micropack.mjs';

const collectDict = (vals, acc) => ({
    ...acc,
    ...vals
        .split(',')
        .map((item) => item.split(':'))
        .reduce((acc, val) => {
            acc[val[0]] = val[1];
            return acc;
        }, {}),
});
const collectList = (vals, acc) => [...acc, ...vals.split(',')];
const increaseVerbose = (_, acc) => (acc += 1);

commander
    .description('Build bundle')
    .option(
        '-c, --config-file <config>',
        'Add custom config file',
        DEFAULT_OPTIONS.configFile
    )
    .option('-w, --watch', 'Rebuilds on change', DEFAULT_OPTIONS.watch)
    .option(
        '-i, --include <package-name>',
        'Include external package',
        collectList,
        []
    )
    .option('-p, --paths <paths>', 'List of module to replace', collectDict, {})
    .option('-d, --define <vars>', 'Variables to inline.', collectDict, {})
    .option('--cwd <cwd>', 'Use custom working directory', DEFAULT_OPTIONS.cwd)
    .option('--dev', 'Developer mode', DEFAULT_OPTIONS.dev)
    .option(
        '--no-modern',
        'Specify your target environment (modern or old)',
        !DEFAULT_OPTIONS.modern
    )
    .option('--no-sourcemap', 'Generate sourcemap', !DEFAULT_OPTIONS.sourcemap)
    .option(
        '-v, --verbose',
        'verbosity that can be increased',
        increaseVerbose,
        0
    )
    .option('--jsx', 'JSX pragma like React.createElement', 'h')
    .option(
        '--no-compress',
        'Disable output compressing',
        !DEFAULT_OPTIONS.compress
    )
    .action(async (opts) => {
        try {
            await micropack(opts);
        } catch (e) {
            console.error(e);
        }
    });

commander.on('--help', function () {
    console.log(`
        Basic Examples:

        $ micropack
        $ micropack --watch
    `);
});

export function run(argv) {
    setupExceptionHandler();
    commander.parse(argv);
}

run(process.argv);
