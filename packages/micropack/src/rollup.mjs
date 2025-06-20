import * as Path from 'path';

import { rollup, watch } from 'rollup';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';

import svg from './plugins/svg.mjs';
import swc from './plugins/swc.mjs';
import ts from './plugins/ts.mjs';

const isRelative = (path) => path.startsWith('./') || path.startsWith('../');

export class RollupTask {
    constructor(options, input, outputs) {
        this.options = options;
        this.input = input;
        this.outputs = outputs;
    }
    prepareConfig() {
        const options = this.options;
        const useTypescript =
            Path.extname(this.input.file) === '.ts' ||
            Path.extname(this.input.file) === '.tsx';
        return this.outputs.map(({ cli, file }) => ({
            source: {
                input: Path.resolve(options.cwd, this.input.file),
                onwarn(warning) {
                    console.log(warning);
                },
                external(id) {
                    if (id === 'tslib') {
                        return false;
                    }
                    if (isRelative(id) || Path.isAbsolute(id)) {
                        return false;
                    }
                    return !options.include.some((name) => {
                        if (name.endsWith('*')) {
                            return id.startsWith(
                                name.substring(
                                    0,
                                    name.length - 2,
                                ),
                            );
                        }
                        return name === id;
                    });
                },
                plugins: [
                    postcss({
                        inject: false,
                        extract: false,
                        modules: !!options.cssModule,
                        autoModules: true,
                        namedExports: (name) => {
                            return name.replace(/-/g, '_');
                        },
                    }),
                    svg(),
                    image(),
                    nodeResolve({
                        mainFields: ['module', 'unpkg', 'main'],
                        browser: true,
                        extensions: [
                            '.mjs',
                            '.js',
                            '.jsx',
                            '.json',
                            '.ts',
                            '.tsx',
                        ],
                        preferBuiltins: true,
                    }),
                    json(),
                    // css({
                    //     verbose: true,
                    //     styleExport: true,
                    //     json: true,
                    // }),

                    options.dev || !useTypescript
                        ? swc(options, useTypescript)
                        : ts(options),
                    (options.compress || file.includes('.min.')) &&
                        terser({
                            compress: {
                                keep_classnames: true,
                                keep_infinity: true,
                                pure_getters: true,
                            },
                            format: {
                                comments: /^\/\/ Generated: .+?$/,
                                preserve_annotations: true,
                                wrap_func_args: false,
                            },
                            module: options.modern,
                            keep_fnames: true,
                            ecma: options.modern ? 2023 : 5,
                        }),
                ].filter(Boolean),
            },
            output: {
                format: options.format
                    ? options.format
                    : Path.extname(file) === '.mjs'
                      ? 'es'
                      : 'cjs',
                banner() {
                    if (cli) {
                        return '#!/usr/bin/env node\n';
                    }
                    if (options.timestamp) {
                        return `// Generated: ${options.pkg.name} ${new Date().toISOString()}`;
                    }
                    return '';
                },
                // name: options.name,
                paths: options.paths,
                sourcemap: options.sourcemap,
                // strict: options.strict === true,
                file: Path.resolve(options.cwd, file),
            },
        }));
    }
    async build() {
        const jobs = this.prepareConfig().map(async ({ source, output }) => {
            let bundle = await rollup(source);
            await bundle.write(output);
            await bundle.close();
            // console.log(`    ${Path.relative(cwd, output.file)}`);
        });
        await Promise.all(jobs);
    }
    watch(listener = () => {}) {
        const { cwd } = this.options;
        const jobs = this.prepareConfig().map(({ source, output }) => {
            return new Promise((_, reject) => {
                watch({
                    ...source,
                    output,
                    watch: {
                        exclude: 'node_modules/**',
                    },
                }).on('event', (e) => {
                    if (e.code === 'BUNDLE_START') {
                        listener('start');
                    }
                    if (e.code === 'FATAL') {
                        return reject(e.error);
                    } else if (e.code === 'ERROR') {
                        listener('error', e.error);
                        console.warn(e.error);
                    } else if (e.code === 'BUNDLE_END') {
                        const files = e.output.map((file) =>
                            Path.relative(cwd, file),
                        );
                        listener('end', files);
                    }
                });
            });
        });
        return Promise.all(jobs);
    }
}
