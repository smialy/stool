#!/usr/bin/env node

import { program } from 'commander';

import { DEFAULT_OPTIONS } from './consts.mjs';
import { setupExceptionHandler } from './utils/error.mjs';
import micropack from './micropack.mjs';
import { collectDict, collectList, increaseVerbose } from './utils/cmd.mjs';

program
    .description('Build bundle')
    .option('-p, --print-config', 'Show current config', false)
    .option(
        '-c, --config-file <config>',
        'Add custom config file',
        DEFAULT_OPTIONS.configFile
    )
    .option('-f, --format <format>', 'Build only in specified format (es, cjs)')
    .option('-w, --watch', 'Rebuild on change', DEFAULT_OPTIONS.watch)
    .option(
        '-i, --include <package-name>',
        'Include external package',
        collectList,
    )
    .option('-p, --paths <paths>', 'List of module to replace')
    .option('-d, --define <vars>', 'Inline variables.', collectDict)
    .option('--cwd <cwd>', 'Use custom working directory')
    .option(
        '--dev',
        'Developer mode (use quick SWC compiler)',
        DEFAULT_OPTIONS.dev
    )
    .option(
        '--no-modern',
        'Specify your target environment (modern or old)',
        DEFAULT_OPTIONS.modern
    )
    .option('--no-sourcemap', 'Generate sourcemap')
    .option(
        '-v, --verbose',
        'verbosity that can be increased',
        increaseVerbose,
        0
    )
    .option('--jsx <name>', 'JSX Runtime')
    .option('--compress', 'Enable output compressing', DEFAULT_OPTIONS.compress)
    .option(
        '--css-module',
        'Files .css will be parsed as modules (default: null)',
        DEFAULT_OPTIONS.cssModule
    )
    .option('--no-timestamp', 'Add timestamp to beging of file', true)
    .action(async (opts) => {
        try {
            await micropack(opts);
        } catch (e) {
            console.error(e);
        }
    });

program.on('--help', function () {
    console.log(`
        Basic Examples:

        $ micropack
        $ micropack --watch
    `);
});

export function run(argv) {
    setupExceptionHandler();
    program.parse(argv);
}

run(process.argv);
