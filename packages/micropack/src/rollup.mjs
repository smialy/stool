import * as Path from 'path';

import { rollup, watch } from 'rollup';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';

import { swcRollupPlugin } from './plugins/swc.mjs';
import { tsRollupPlugin } from './plugins/ts.mjs';

const isRelative = (path) => path.startsWith('./') || path.startsWith('../');

export class RollupTask {
    constructor(options, input, outputs) {
        this.options = options;
        this.input = input;
        this.outputs = outputs;
    }
    prepareConfig() {
        const {
            options: {
                modern,
                format,
                include,
                paths,
                sourcemap,
                compress,
                dev,
                jsx,
                timestamp,
                pkg: { name }
            },
            input,
            outputs,
        } = this;
        const useTypescript =
            Path.extname(input.file) === '.ts' ||
            Path.extname(input.file) === '.tsx';
        return outputs.map(({ cli, file }, i) => ({
            source: {
                input: Path.resolve(this.options.cwd, input.file),
                onwarn(warning) {
                    console.log({ warning });
                },
                external(id) {
                    if (id === 'tslib') {
                        return false;
                    }
                    if (isRelative(id) || Path.isAbsolute(id)) {
                        return false;
                    }
                    return !include.some(name => {
                        if (name.endsWith('/*')) {
                            return id.startsWith(name.substring(0, name.length - 2));
                        }
                        return name === id;
                    });
                },
                plugins: [
                    postcss({
                        inject: false,
                        extract: false,
                        autoModules: true,
                        modules: !!this.options.cssModule,
                        autoModules: true,
                        namedExports: (name) => {
                            return name.replace(/-/g,'_');
                        },
                    }),
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

                    dev || !useTypescript
                        ? swcRollupPlugin({
                                jsx,
                                sourcemap,
                                useTypescript,
                                modern,
                          })
                        : tsRollupPlugin({
                                jsx,
                                sourcemap,
                                modern,
                                id: i
                          }),
                    (compress || file.includes('.min.')) && terser({
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
                        module: modern,
                        keep_fnames: true,
                        ecma: modern ? 2017 : 5,
                    }),
                ].filter(Boolean),
            },
            output: {
                format: format
                    ? format
                    : Path.extname(file) === '.mjs'
                    ? 'es'
                    : 'cjs',
                banner() {
                    if (cli) {
                        return '#!/usr/bin/env node\n';
                    }
                    if (timestamp) {
                        return `// Generated: ${name} ${new Date().toISOString()}`;
                    }
                    return '';
                },
                // name: options.name,
                paths,
                sourcemap,
                // strict: options.strict === true,
                file: Path.resolve(this.options.cwd, file),
            },
        }));
    }
    async build() {
        const { cwd } = this.options;
        const jobs = this.prepareConfig()
            .map(async ({ source, output }) => {
                let bundle = await rollup(source);
                await bundle.write(output);
                await bundle.close();
                console.log(`    ${Path.relative(cwd, output.file)}`);
            });
        await Promise.all(jobs);
    }
    watch(listener = () => {}) {
        const { cwd } = this.options;
        const jobs = this.prepareConfig().map(({ source, output}) => {
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
                        const files = e.output.map(file => Path.relative(cwd, file));
                        listener('end', files);
                    }
                });
            });
        });
        return Promise.all(jobs);
    }
}
