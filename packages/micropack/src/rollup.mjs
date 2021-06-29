import * as Path from 'path';

import { rollup, watch } from 'rollup';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import { swcRollupPlugin } from './plugins/swc.mjs';
import { tsRollupPlugin } from './plugins/ts.mjs';
// import css from '@modular-css/rollup';

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
                pkg,
                ts,
                cwd,
                modern,
                format,
                include,
                paths,
                sourcemap,
                compress,
            },
            input,
            outputs,
        } = this;

        const useTypescript =
            Path.extname(input.file) === '.ts' ||
            Path.extname(input.file) === '.tsx';
        const useSwc =
            !pkg.types && !ts?.compilerOptions?.emitDecoratorMetadata;
        return {
            source: {
                input: Path.resolve(cwd, input.file),
                onwarn(warning) {
                    console.log({ warning });
                },
                external(id) {
                    if (id === 'tslib') {
                        return false;
                    }
                    if (
                        isRelative(id) ||
                        Path.isAbsolute(id) ||
                        include.includes(id)
                    ) {
                        return false;
                    }
                    return true;
                },
                plugins: [
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
                    useSwc
                        ? swcRollupPlugin({
                              sourcemap,
                              useTypescript,
                              modern,
                          })
                        : tsRollupPlugin({
                              sourcemap,
                              format,
                          }),
                    compress && terser(),
                ].filter(Boolean),
            },
            outputs: outputs.map(({ cli, file }) => ({
                format: format
                    ? format
                    : Path.extname(file) === '.mjs'
                    ? 'es'
                    : 'cjs',
                banner() {
                    if (cli) {
                        return '#!/usr/bin/env node\n';
                    }
                    return `// ${new Date().toISOString()}`;
                },
                // name: options.name,
                paths,
                sourcemap,
                // strict: options.strict === true,
                file: Path.resolve(cwd, file),
            })),
        };
    }
    async build() {
        const { cwd } = this.options;
        const { source, outputs } = this.prepareConfig();
        let bundle = await rollup(source);
        await Promise.all(
            outputs.map((output) => {
                console.log(`    ${Path.relative(cwd, output.file)}`);
                return bundle.write(output);
            })
        );
        await bundle.close();
    }
    watch() {
        const { cwd } = this.options;
        const { source, outputs } = this.prepareConfig();
        return new Promise((_, reject) => {
            watch({
                ...source,
                output: outputs,
                watch: {
                    exclude: 'node_modules/**',
                },
            }).on('event', (e) => {
                if (e.code === 'BUNDLE_START') {
                    console.log('Building...');
                }
                if (e.code === 'FATAL') {
                    return reject(e.error);
                } else if (e.code === 'ERROR') {
                    console.warn(e.error);
                } else if (e.code === 'BUNDLE_END') {
                    const files = e.output
                        .map((file) => `    ${Path.relative(cwd, file)}`)
                        .join('\n');
                    console.log(`${files}\nDone.`);
                }
            });
        });
    }
}
