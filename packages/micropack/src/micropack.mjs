import { resolve, dirname, extname } from 'path';

import { rollup } from 'rollup';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import buble from '@rollup/plugin-buble';
import css from "@modular-css/rollup";
import chokidar from 'chokidar';

import { readJsonFile } from './utils/file.mjs';

async function loadConfig(cwd) {
    const pkg = await readPackageFile(cwd);
    let entries = await readConfigFile(cwd);
    if (entries.length === 0) {
        entries = findPackageEntries(pkg)
    }
    return validateEntries(entries);
}

export default async function micropack(options) {
    options.cwd = resolve(process.cwd(), options.cwd);
    const { entries } = await loadConfig(options.cwd);

    const tasks = entries
        .reduce((acc, entry) => {
            const {input, output} = entry;
            for (const item of output) {
                acc.push({ input, output: item });
            }
            return acc;
        }, [])
        .map(prepareRollupConfig(options));

    if (!tasks.length) {
        console.log('Nothing to build');
        process.exit(1);
    }
    if (options.watch) {
        let input = typeof options.watch === 'string' ? options.watch : dirname(steps[0].input.input);
        const watchPath = resolve(cwd, input);
        const watcher = chokidar.watch(watchPath);
        let lock = false;
        watcher.on('change', async () => {
            if (!lock) {
                lock = true;
                await buildAll(tasks);
                lock = false;
            }
        });
    } else {
        await buildAll(tasks);
    }
}

const prepareRollupConfig = options => ({ input, output }) => {
    if (options.dev) {
        console.log('Entry:', {input, output});
    }
    const useTypescript = extname(input.file) === '.ts' || extname(input.file) === '.tsx';
    // const typescriptModule = useTypescript ? (await import('typescript')).default : null;
    const format = extname(output.file) === '.mjs' ? 'es' : 'cjs';
    return {
        input: {
            input: resolve(options.cwd, input.file),
            onwarn(warning) {
                console.log({ warning });
            },
            external(id) {
                if (id.substr(0, 2) === './') {
                    return false;
                }
                if (extname(id) === '.ts' || extname(id) === '.tsx') {
                    return false;
                }
                return true;
            },
            plugins: [
                nodeResolve({
                    mainFields: ['module', 'jsnext', 'main'],
                    browser: options.target !== 'node',
                    extensions: ['.mjs', '.js', '.jsx', '.json'],
                    preferBuiltins: false,
                }),
                commonjs({
                    include: /\/node_modules\//,
                }),
                json(),
                css({
                    json         : true,
                    meta         : true,
                    namedExports : true,
                    styleExport  : true,
                    dev          : options.dev,
                    verbose      : options.dev,
                    empties      : true,
                    // namer: shornames(),
                }),
                useTypescript && typescript({
                    // typescript: typescriptModule,
                    cacheRoot: `./node_modules/.cache/bundle_cache_${format}`,
                    tsconfigDefaults: {
                        compilerOptions: {
                            sourceMap: options.sourcemap,
                            declaration: true,
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
                !useTypescript &&  buble({
                    jsx: options.jsx || 'h',
                    transforms: {
                        modules: false,
                        objectRestSpread: false,
                        asyncAwait: false,
                        getterSetter: false,
                        arrow: false,
                        classes: false,
                        defaultParameter: false,
                        destructuring: false,
                        generator: false,
                        forOf: false,
                        letConst: false,
                        moduleExport: false,
                        moduleImport: false,
                        numericLiteral: false,
                        parameterDestructuring: false,
                        spreadRest: false,
                        templateString: false,
                        conciseMethodProperty: false,
                        computedProperty: false,
                        unicodeRegExp: false,
                        stickyRegExp: false,
                    },
                }),
            ],
        },
        output: {
            format,
            banner() {
                if (output.cli) {
                    return '#!/usr/bin/env node\n';
                }
                return '';
            },
            name: options.name,
            sourcemap: options.sourcemap,
            strict: options.strict === true,
            file: resolve(options.cwd, output.file),
        }
    }
}

async function buildAll(tasks) {
    for (const { input, output } of tasks) {
        let bundle = await rollup(input);
        await bundle.write(output);
    }
    console.log('Done')
}

async function readPackageFile(cwd) {
    return await readJsonFile(resolve(cwd, 'package.json'));
}

async function readConfigFile(cwd, configFile = 'micropack.json') {
    try {
        return await readJsonFile(resolve(cwd, configFile));
    } catch(e) {
    }
    return [];
}

async function validateEntries(config) {
    if (Array.isArray(config)) {
        config = { entries: config };
    }
    const entries = [];
    for (let { input, output } of config.entries) {
        if (!Array.isArray(output)) {
            output = [output];
        }
        if (typeof input === 'string') {
            input = {
                file: input,
            }
        }
        output = output.map(file => {
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
    return { ...config, entries };
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
                    }
                });
            }
        }
    } else {
        console.warn('Missing "source" in package.json file.');
    }
    return { entries };
}