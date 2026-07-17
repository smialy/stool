import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
    isFile,
    isDir,
    isFileExists,
    isDirExists,
    readJsonFile,
    writeTextFile,
} from '../../src/utils/file.mjs';

let base;
beforeEach(async () => {
    base = await mkdtemp(join(tmpdir(), 'micropack-file-test-'));
});
afterEach(async () => {
    await rm(base, { recursive: true, force: true });
});

describe('isFile / isDir', () => {
    it('classifies a file as file and not dir', async () => {
        const p = join(base, 'a.txt');
        await writeFile(p, 'hi');
        expect(await isFile(p)).toBe(true);
        expect(await isDir(p)).toBe(false);
    });

    it('classifies a directory as dir and not file', async () => {
        expect(await isDir(base)).toBe(true);
        expect(await isFile(base)).toBe(false);
    });

    it('rejects for missing paths', async () => {
        await expect(isFile(join(base, 'nope'))).rejects.toThrow();
        await expect(isDir(join(base, 'nope'))).rejects.toThrow();
    });
});

describe('isFileExists / isDirExists', () => {
    it('returns true for existing file/dir', async () => {
        const p = join(base, 'a.txt');
        await writeFile(p, 'hi');
        expect(await isFileExists(p)).toBe(true);
        expect(await isDirExists(base)).toBe(true);
    });

    it('returns false for missing paths', async () => {
        expect(await isFileExists(join(base, 'missing'))).toBe(false);
        expect(await isDirExists(join(base, 'missing'))).toBe(false);
    });
});

describe('readJsonFile', () => {
    it('parses JSON content', async () => {
        const p = join(base, 'data.json');
        await writeFile(p, JSON.stringify({ a: 1 }));
        expect(await readJsonFile(p)).toEqual({ a: 1 });
    });

    it('throws on invalid JSON with the file path in the message', async () => {
        const p = join(base, 'bad.json');
        await writeFile(p, '{not json');
        await expect(readJsonFile(p)).rejects.toThrow(/bad\.json/);
    });
});

describe('writeTextFile', () => {
    it('writes content and creates nested directories', async () => {
        const p = join(base, 'nested', 'deep', 'out.txt');
        await writeTextFile(p, 'payload');
        const { readFile } = await import('node:fs/promises');
        expect(await readFile(p, 'utf8')).toBe('payload');
    });

    it('overwrites existing files', async () => {
        const p = join(base, 'out.txt');
        await writeTextFile(p, 'first');
        await writeTextFile(p, 'second');
        const { readFile } = await import('node:fs/promises');
        expect(await readFile(p, 'utf8')).toBe('second');
    });
});