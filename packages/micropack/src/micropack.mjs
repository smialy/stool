import { resolve, dirname, extname } from 'path';

import { rollup, watch } from 'rollup';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
// import buble from '@rollup/plugin-buble';
import css from '@modular-css/rollup';
import cleanup from 'rollup-plugin-cleanup';
import terser from 'rollup-plugin-terser';

import { readJsonFile } from './utils/file.mjs';
import { createBabelConfig } from './utils/babel.mjs';


async function loadConfig(pkg, cwd) {
    let config = await readConfigFile(cwd);
    if (!config) {
        config = findPackageEntries(pkg);
    }
    return validateEntries(config);
}

export default async function micropack(options) {
    if (options.dev) {
        console.log(options);
    }
    options.cwd = resolve(process.cwd(), options.cwd);
    options.pkg = await readPackageFile(options.cwd);
    const { include, entries } = await loadConfig(options.pkg, options.cwd);

    const tasks = await Promise.all(entries
        .reduce((acc, entry) => {
            const { input, output } = entry;
            for (const item of output) {
                acc.push({ include, input, output: item });
            }
            return acc;
        }, [])
        .map(prepareRollupConfig(options)));
    console.log({ tasks })
    if (!tasks.length) {
        console.log('Nothing to build');
        process.exit(1);
    }

    if (options.watch) {
        return new Promise((_, reject) => {
            for (const { input, output } of tasks) {
                watch({
                    ...input,
                    output: output,
                    watch: {
                        exclude: 'node_modules/**',
                    },
                }).on('event', (e) => {
                    if (e.code === 'FATAL') {
                        return reject(e.error);
                    } else if (e.code === 'ERROR') {
                        console.warn(e.error);
                    } else if (e.code === 'END') {
                        console.log('Saved.');
                    }
                });
            }
        });
    }
    for (const { input, output } of tasks) {
        let bundle = await rollup(input);
        await bundle.write(output);
    }
    console.log('Builded.');
}

const prepareRollupConfig = (options) => async ({ include, input, output }) => {
    if (options.dev) {
        console.log('Entry:', { input, output });
    }
    const useTypescript =
        extname(input.file) === '.ts' || extname(input.file) === '.tsx';
    const declarationDir = findTypesEntry(options.pkg);
    const format = options.format
        ? options.format
        : extname(output.file) === '.mjs'
        ? 'es'
        : 'cjs';
    return {
        input: {
            input: resolve(options.cwd, input.file),
            onwarn(warning) {
                console.log({ warning });
            },
            external(id) {
                if (id === 'tslib') {
                    return false;
                }
                if (include.includes(id)) {
                    return false;
                }
            },
            plugins: [
                nodeResolve({
                    mainFields: ['module', 'jsnext', 'main'],
                    browser: false,
                    extensions: ['.mjs', '.js', '.jsx', '.json'],
                    preferBuiltins: false,
                }),
                commonjs({
                    include: /\/node_modules\//,
                }),
                json(),
                css({
                    json: true,
                    meta: true,
                    namedExports: true,
                    styleExport: true,
                    dev: options.dev,
                    verbose: options.dev,
                    empties: true,
                    // namer: shornames(),
                }),
                useTypescript &&
                    typescript({
                        // typescript: typescriptModule,
                        cacheRoot: `./node_modules/.cache/bundle_cache_${format}`,
                        useTsconfigDeclarationDir: true,
                        tsconfigDefaults: {
                            compilerOptions: {
                                sourceMap: options.sourcemap,
                                declaration: !!declarationDir,
                                declarationDir,
                                jsx: 'react',
                                jsxFactory: options.jsx || 'h',
                            },
                        },
                        tsconfig: options.tsconfig,
                        tsconfigOverride: {
                            compilerOptions: {
                                target: 'esnext',
                            },
                        },
                    }),
                !useTypescript && !options.modern && await createBabelConfig(options),
                options.compress &&
                    terser.terser({
                        warnings: true,
                        ecma: options.modern ? 9 : 5,
                        toplevel:
                            options.modern ||
                            format === 'cjs' ||
                            format === 'es',
                    }),
                cleanup({
                    comments: 'none',
                }),
            ],
        },
        output: {
            format,
            banner() {
                if (output.cli) {
                    return '#!/usr/bin/env node\n';
                }
                return `// ${new Date().toISOString()}`;
            },
            name: options.name,
            sourcemap: options.sourcemap,
            strict: options.strict === true,
            file: resolve(options.cwd, output.file),
        },
    };
};

async function readPackageFile(cwd) {
    return await readJsonFile(resolve(cwd, 'package.json'));
}

async function readConfigFile(cwd, configFile = 'micropack.json') {
    try {
        return await readJsonFile(resolve(cwd, configFile));
    } catch (e) {}
}

async function validateEntries(config) {
    if (Array.isArray(config)) {
        config = { include: [], entries: config };
    }
    const entries = [];
    for (let { input, output } of config.entries) {
        if (!Array.isArray(output)) {
            output = [output];
        }
        if (typeof input === 'string') {
            input = {
                file: input,
            };
        }
        output = output.map((file) => {
            if (typeof file === 'string') {
                return {
                    file,
                };
            }
            return file;
        });
        entries.push({
            input,
            output,
        });
    }
    return { include: [], ...config, entries };
}

function findPackageEntries(pkg) {
    const entries = [];
    if (pkg.source) {
        for (const name of ['main', 'module']) {
            if (pkg[name]) {
                entries.push({
                    input: pkg.source,
                    output: {
                        file: pkg[name],
                    },
                });
            }
        }
    } else {
        console.warn('Missing "source" in package.json file.');
    }
    return { entries };
}

function findTypesEntry(pkg) {
    if (pkg.types) {
        return dirname(pkg.types);
    }
}
