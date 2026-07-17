import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);

/**
 * Resolve the native `tsgo` executable that ships with `typescript` >= 7.
 * Preferred: the platform-specific native binary from the matching
 * `@typescript/typescript-<platform>-<arch>` optional dependency.
 * Fallback: the `typescript/bin/tsc` Node shim, spawned via `node`.
 *
 * @returns {{ command: string, args: string[] }} A spawnable invocation
 *   (either the binary directly, or `node <shim>`).
 */
function resolveTsgo() {
    const platformPkg = `@typescript/typescript-${process.platform}-${process.arch}`;
    try {
        const pkgJson = require.resolve(`${platformPkg}/package.json`);
        const exe =
            path.join(path.dirname(pkgJson), 'lib', 'tsc') +
            (process.platform === 'win32' ? '.exe' : '');
        if (fs.existsSync(exe)) {
            return { command: exe, args: [] };
        }
    } catch {
        // platform package missing, fall through to shim
    }
    const tsPkg = require.resolve('typescript/package.json');
    const shim = path.join(path.dirname(tsPkg), 'bin', 'tsc');
    return { command: process.execPath, args: [shim] };
}

/**
 * Resolve the ESM tslib helper path so Rollup can bundle it when
 * `importHelpers` is enabled. Mirrors @rollup/plugin-typescript behavior.
 * @returns {string|null}
 */
function resolveTslib() {
    try {
        return require.resolve('tslib/tslib.es6.js');
    } catch {
        return null;
    }
}

/**
 * True for file names tsgo emits as JS (i.e. everything except declaration
 * files and source maps).
 */
function isCodeEmit(name) {
    return (
        !name.endsWith('.map') &&
        !/\.d\.[cm]?ts$/.test(name) &&
        !name.endsWith('.d.ts.map')
    );
}

/**
 * Rollup plugin that compiles TypeScript (and, with `allowJs`, JS/JSX) using
 * the native `tsgo` compiler from `typescript` >= 7.
 *
 * The native compiler has no in-process emit API, so the plugin shells out to
 * the `tsgo` binary, emits JS + sourcemaps into a temporary outDir, then
 * feeds the emitted files back to Rollup via the `load` hook. Declaration
 * files are written directly to the configured `declarationDir`.
 *
 * @param {object} opts
 * @param {string} opts.cwd        Package root.
 * @param {object} opts.pkg        package.json content.
 * @param {string} [opts.jsx]      jsxImportSource (default 'preact').
 * @param {string} [opts.tsconfig] Path to a user tsconfig to extend.
 * @param {string} opts.entry      Absolute path to the entry input file.
 */
export default function tsgoPlugin({ cwd, pkg, jsx, tsconfig, entry }) {
    const tslibPath = resolveTslib();
    const declarationDir = getDeclarationDir(cwd, pkg);
    const rootDir = path.dirname(entry);
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'micropack-tsgo-'));
    const jsOutDir = path.join(tmpRoot, 'js');
    const tmpConfig = path.join(tmpRoot, 'tsconfig.json');

    /** source abs path -> { code, map } */
    let emitted = new Map();
    let didCompile = false;

    function writeTempConfig() {
        const compilerOptions = {
            module: 'esnext',
            target: 'es2020',
            rootDir,
            outDir: jsOutDir,
            sourceMap: true,
            allowJs: true,
            jsx: 'react-jsx',
            jsxImportSource: jsx || 'preact',
            importHelpers: true,
            noEmitHelpers: true,
            noEmitOnError: false,
            declaration: !!declarationDir,
            ...(declarationDir && { declarationDir }),
        };
        const config = {
            ...(tsconfig && fs.existsSync(tsconfig)
                ? { extends: tsconfig }
                : {}),
            compilerOptions,
            files: [entry],
        };
        fs.writeFileSync(tmpConfig, JSON.stringify(config));
    }

    function runCompiler() {
        const { command, args } = resolveTsgo();
        const result = spawnSync(
            command,
            [...args, '-p', tmpConfig, '--listEmittedFiles'],
            { cwd, encoding: 'utf8' },
        );
        const out = `${result.stdout || ''}${result.stderr || ''}`;
        if (result.status !== 0) {
            // tsgo exits non-zero on type errors, but emit still happened
            // (noEmitOnError: false). Surface diagnostics as Rollup warnings.
            for (const line of out.split('\n')) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('TSFILE:')) continue;
                this.warn(`tsgo: ${trimmed}`);
            }
        }
        emitted = indexEmittedFiles(jsOutDir);
        didCompile = true;
    }

    function cleanup() {
        if (!tmpRoot) return;
        try {
            fs.rmSync(tmpRoot, { recursive: true, force: true });
        } catch {
            // ignore
        }
    }

    return {
        name: 'tsgo',
        buildStart() {
            writeTempConfig();
            runCompiler.call(this);
        },
        watchChange() {
            // Rebuild is driven by buildStart on the next pass; just ensure a
            // recompile happens.
            didCompile = false;
        },
        resolveId(importee) {
            if (importee === 'tslib') {
                return tslibPath;
            }
            return null;
        },
        load(id) {
            if (!didCompile) {
                runCompiler.call(this);
            }
            const norm = normalizePath(id);
            const hit = emitted.get(norm) || emitted.get(path.resolve(norm));
            if (!hit) return null;
            this.addWatchFile(id);
            return { code: hit.code, map: hit.map };
        },
        buildEnd() {
            if (this.meta.watchMode !== true) {
                cleanup();
            }
        },
        closeWatcher() {
            cleanup();
        },
    };
}

/**
 * Walk `jsOutDir` and build a map from absolute source path (read from each
 * emitted file's sibling sourcemap `sources[0]`) to `{ code, map }`.
 */
function indexEmittedFiles(jsOutDir) {
    const result = new Map();
    if (!fs.existsSync(jsOutDir)) return result;
    for (const abs of walkFiles(jsOutDir)) {
        const base = path.basename(abs);
        if (!isCodeEmit(base)) continue;
        const code = fs.readFileSync(abs, 'utf8');
        const mapPath = `${abs}.map`;
        let sourceMap = null;
        let sourcePath = null;
        if (fs.existsSync(mapPath)) {
            try {
                sourceMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
                if (
                    Array.isArray(sourceMap.sources) &&
                    sourceMap.sources.length
                ) {
                    sourcePath = path.resolve(
                        path.dirname(abs),
                        sourceMap.sources[0],
                    );
                }
            } catch {
                // ignore malformed map
            }
        }
        if (!sourcePath) continue;
        result.set(normalizePath(sourcePath), { code, map: sourceMap });
    }
    return result;
}

function* walkFiles(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            yield* walkFiles(abs);
        } else if (entry.isFile()) {
            yield abs;
        }
    }
}

function getDeclarationDir(cwd, pkg) {
    const typeFile = pkg.types || pkg.typings;
    if (!typeFile) return null;
    return path.dirname(path.resolve(cwd, typeFile));
}

function normalizePath(p) {
    return p.split(path.win32.sep).join(path.posix.sep);
}
