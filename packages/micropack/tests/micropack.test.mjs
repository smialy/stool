import { describe, it, expect } from 'vitest';

import {
    validateConfig,
    findEntries,
    findPackageEntries,
    findExportsEntries,
    checkExportEntries,
    checkGlobalEntries,
} from '../src/micropack.mjs';

describe('findExportsEntries', () => {
    it('yields an entry with deduplicated outputs from named keys', () => {
        const entries = [...findExportsEntries({
            source: './src/index.ts',
            import: './dist/index.mjs',
            main: './dist/index.js',
            default: './dist/index.js',
        })];
        expect(entries).toEqual([
            {
                input: './src/index.ts',
                outputs: ['./dist/index.mjs', './dist/index.js'],
            },
        ]);
    });

    it('yields nothing when source is missing', () => {
        expect([...findExportsEntries({ import: './a.js' })]).toEqual([]);
    });

    it('yields nothing when no named output keys are present', () => {
        expect([...findExportsEntries({ source: './src/index.ts' })]).toEqual([]);
    });

    it('returns nothing for string exports', () => {
        expect([...findExportsEntries('./dist/index.js')]).toEqual([]);
    });
});

describe('checkExportEntries', () => {
    it('collects entries from every exports subtree', () => {
        const pkg = {
            exports: {
                '.': {
                    source: './src/index.ts',
                    import: './dist/index.mjs',
                    main: './dist/index.js',
                },
                './sub': {
                    source: './src/sub.ts',
                    import: './dist/sub.mjs',
                },
            },
        };
        const entries = checkExportEntries(pkg);
        expect(entries).toHaveLength(2);
        expect(entries[0].input).toBe('./src/index.ts');
        expect(entries[1].input).toBe('./src/sub.ts');
    });

    it('returns [] when there are no exports', () => {
        expect(checkExportEntries({})).toEqual([]);
    });
});

describe('checkGlobalEntries', () => {
    it('builds an entry from pkg.source with main/module/unpkg outputs', () => {
        const entries = checkGlobalEntries({
            source: './src/index.ts',
            main: './dist/index.js',
            module: './dist/index.mjs',
            unpkg: './dist/index.umd.js',
        });
        expect(entries).toEqual([
            {
                input: { file: './src/index.ts' },
                outputs: [
                    { file: './dist/index.js', cli: false },
                    { file: './dist/index.mjs', cli: false },
                    { file: './dist/index.umd.js', cli: false },
                ],
            },
        ]);
    });

    it('skips missing output keys', () => {
        const entries = checkGlobalEntries({
            source: './src/index.ts',
            main: './dist/index.js',
        });
        expect(entries[0].outputs).toEqual([
            { file: './dist/index.js', cli: false },
        ]);
    });

    it('returns [] when source is missing', () => {
        expect(checkGlobalEntries({ main: './dist/index.js' })).toEqual([]);
    });
});

describe('findPackageEntries', () => {
    it('prefers exports entries', () => {
        const pkg = {
            source: './src/index.ts',
            exports: { '.': { source: './src/index.ts', import: './dist/index.mjs' } },
        };
        const { entries, type } = findPackageEntries(pkg);
        expect(type).toBe('pkg.exports');
        expect(entries).toHaveLength(1);
    });

    it('falls back to global (source) entries', () => {
        const { entries, type } = findPackageEntries({
            source: './src/index.ts',
            main: './dist/index.js',
        });
        expect(type).toBe('pkg.global');
        expect(entries).toHaveLength(1);
    });

    it('returns none with a warning when nothing matches', () => {
        const { entries, type } = findPackageEntries({});
        expect(type).toBe('none');
        expect(entries).toEqual([]);
    });
});

describe('findEntries', () => {
    it('uses explicit entries from config when present', () => {
        const explicit = [{ input: './src/a.ts', outputs: ['./dist/a.js'] }];
        const { entries, type } = findEntries({ entries: explicit }, {});
        expect(type).toBe('config.file');
        expect(entries).toBe(explicit);
    });

    it('delegates to package entries when config has none', () => {
        const { type } = findEntries({}, {
            source: './src/index.ts',
            main: './dist/index.js',
        });
        expect(type).toBe('pkg.global');
    });
});

describe('validateConfig', () => {
    it('wraps string inputs and string outputs into objects', () => {
        const result = validateConfig({
            entries: [{ input: './src/a.ts', outputs: ['./dist/a.js'] }],
        });
        expect(result.entries).toEqual([
            {
                input: { file: './src/a.ts', cli: false },
                outputs: [{ file: './dist/a.js', cli: false }],
            },
        ]);
    });

    it('normalises a single (non-array) output into an array', () => {
        const result = validateConfig({
            entries: [{ input: './src/a.ts', outputs: './dist/a.js' }],
        });
        expect(result.entries[0].outputs).toHaveLength(1);
    });

    it('keeps structured inputs and outputs untouched', () => {
        const input = { file: './src/a.ts', cli: false };
        const output = { file: './dist/a.js', format: 'cjs' };
        const result = validateConfig({
            entries: [{ input, outputs: [output] }],
        });
        expect(result.entries[0].input).toBe(input);
        expect(result.entries[0].outputs[0]).toBe(output);
    });

    it('throws when an input file is missing', () => {
        expect(() =>
            validateConfig({ entries: [{ input: { cli: false }, outputs: ['./dist/a.js'] }] }),
        ).toThrow(/input file/i);
    });

    it('throws when there are no outputs', () => {
        expect(() =>
            validateConfig({ entries: [{ input: './src/a.ts', outputs: [] }] }),
        ).toThrow(/outputs files for/);
    });

    it('applies default empty collections for include/global/define/entries', () => {
        const result = validateConfig({ entries: [] });
        expect(result.include).toEqual([]);
        expect(result.global).toEqual({});
        expect(result.define).toEqual({});
        expect(result.entries).toEqual([]);
    });
});