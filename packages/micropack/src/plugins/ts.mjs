import { resolve } from 'path';

import tsgoPlugin from './tsgo.mjs';

/**
 * Build a TypeScript rollup plugin backed by the native `tsgo` compiler
 * (TypeScript >= 7). Handles TS, JS, and JSX for both dev and prod builds.
 *
 * @param {object} options  micropack options (cwd, pkg, jsx).
 * @param {string} entry    Absolute path to the entry input file.
 */
export default function tsRollupPlugin({ cwd, pkg, jsx }, entry) {
    const tsconfig = resolve(cwd, 'tsconfig.json');
    return tsgoPlugin({
        cwd,
        pkg,
        jsx,
        tsconfig,
        entry,
    });
}
