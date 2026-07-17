import { stat, writeFile, readFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export async function isFile(filePath) {
    return (await stat(filePath)).isFile();
}

export async function isDir(filePath) {
    return (await stat(filePath)).isDirectory();
}

export async function isFileExists(filePath) {
    return isFile(filePath).catch(() => false);
}

export async function isDirExists(filePath) {
    return isDir(filePath).catch(() => false);
}

export async function readJsonFile(filePath) {
    const payload = await readFile(filePath, 'utf8');
    try {
        return JSON.parse(payload);
    } catch (e) {
        throw new Error(`Problem with parse: ${filePath}\n${e}`);
    }
}

export async function writeTextFile(filePath, content) {
    const basePath = dirname(filePath);
    if (!(await isDirExists(basePath))) {
        await mkdir(basePath, { recursive: true });
    }
    await writeFile(filePath, content);
}
