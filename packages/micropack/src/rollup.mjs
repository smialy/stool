import * as Path from 'path';

import { rollup, watch } from 'rollup';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';

import svg from './plugins/svg.mjs';
import ts from './plugins/ts.mjs';

const isRelative = (path) => path.startsWith('./') || path.startsWith('../');

const RESOLVE_EXTENSIONS = ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'];

/**
 * Rollup `external` predicate: keep relative/absolute imports and anything
 * listed in `options.include` (with `pkg/*` wildcard support) as bundled,
 * treat everything else as external.
 */
function createExternal(options) {
    return (id) => {
        if (id === 'tslib') return false;
        if (isRelative(id) || Path.isAbsolute(id)) return false;
        return !options.include.some((name) =>
            name.endsWith('*') ? id.startsWith(name.slice(0, -2)) : name === id,
        );
    };
}

/**
 * Build the terser plugin config used when compression is enabled.
 */
function terserPlugin(options) {
    return terser({
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
    });
}

/**
 * Assemble the Rollup plugin pipeline for an entry. The TS/JSX transform
 * plugin is built per-entry because it resolves the entry's absolute path.
 */
async function buildPlugins(options, entryFile, compress) {
    const entry = Path.resolve(options.cwd, entryFile);
    return [
        postcss({
            inject: false,
            extract: false,
            modules: !!options.cssModule,
            autoModules: true,
            namedExports: (name) => name.replace(/-/g, '_'),
        }),
        svg(),
        image(),
        nodeResolve({
            mainFields: ['module', 'unpkg', 'main'],
            browser: true,
            extensions: RESOLVE_EXTENSIONS,
            preferBuiltins: true,
        }),
        json(),
        ts(options, entry),
        compress && terserPlugin(options),
    ].filter(Boolean);
}

/**
 * Build the Rollup output config for a single output file.
 */
function buildOutputConfig(options, cli, file) {
    return {
        format: options.format
            ? options.format
            : Path.extname(file) === '.mjs'
              ? 'es'
              : 'cjs',
        banner() {
            if (cli) return '#!/usr/bin/env node\n';
            if (options.timestamp) {
                return `// Generated: ${options.pkg.name} ${new Date().toISOString()}`;
            }
            return '';
        },
        paths: options.paths,
        sourcemap: options.sourcemap,
        file: Path.resolve(options.cwd, file),
    };
}

export class RollupTask {
    constructor(options, input, outputs) {
        this.options = options;
        this.input = input;
        this.outputs = outputs;
    }

    async prepareConfig() {
        const { cwd } = this.options;
        const configs = await Promise.all(
            this.outputs.map(async ({ cli, file }) => {
                const compress =
                    this.options.compress || file.includes('.min.');
                const source = {
                    input: Path.resolve(cwd, this.input.file),
                    external: createExternal(this.options),
                    onwarn(warning) {
                        console.log(warning);
                    },
                    plugins: await buildPlugins(
                        this.options,
                        this.input.file,
                        compress,
                    ),
                };
                return {
                    source,
                    output: buildOutputConfig(this.options, cli, file),
                };
            }),
        );
        return configs;
    }

    async build() {
        const configs = await this.prepareConfig();
        await Promise.all(
            configs.map(async ({ source, output }) => {
                const bundle = await rollup(source);
                await bundle.write(output);
                await bundle.close();
            }),
        );
    }

    async watch(listener = () => {}) {
        const { cwd } = this.options;
        const configs = await this.prepareConfig();
        return Promise.all(
            configs.map(({ source, output }) => {
                return new Promise((_, reject) => {
                    watch({
                        ...source,
                        output,
                        watch: { exclude: 'node_modules/**' },
                    }).on('event', (e) => {
                        if (e.code === 'BUNDLE_START') {
                            listener('start');
                        } else if (e.code === 'FATAL') {
                            reject(e.error);
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
            }),
        );
    }
}
