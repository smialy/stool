#!/usr/bin/env node

import commander from 'commander';

import { setupExceptionHandler } from './utils/error.mjs';
import micropack from './micropack.mjs';

commander
    .description('Build bundle')
    .option('--cwd <cwd>', 'User custom working directory', process.cwd())

    .option('-f, --format <format>', 'Output format: (amd, cjs, es, iife, umd, system)', '')
    .option('-w, --watch', 'Rebuilds on change', false)
    .option('--compress', 'Compress output using Terser', false)
    .option('--no-modern', 'Specify your target environment (modern or old)')
    .option('--dev', 'Developer mode', false)
    .option('--config <config>', 'Add cumstom config file')
    .option('--tsconfig <tsconfig>', 'Path to a custom tsconfig.json')
    .option('--sourcemap', 'Generate sourcemap', false)
    .option('--jsx','JSX pragma like React.createElement', 'h')
    .action(async ({ cwd, format, modern, compress, dev, config, tsconfig, sourcemap, jsx, watch }) => {
        micropack({ cwd, format, modern, compress, dev, config, tsconfig, sourcemap, jsx, watch });
    });

commander.on('--help', function() {
    console.log(`
        Basic Examples:

        $ micropack

    `);
});

export function run(argv) {
    setupExceptionHandler();
    commander.parse(argv);
}

run(process.argv);