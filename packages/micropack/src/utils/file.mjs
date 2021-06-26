import { stat, writeFile, readFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export async function isFileExists(filePath) {
    try {
        await isFile(filePath);
    } catch (e) {
        return false;
    }
    return true;
}
export async function isDirExists(filePath) {
    try {
        await isDir(filePath);
    } catch (e) {
        return false;
    }
    return true;
}

export async function isDir(filePath) {
    const info = await stat(filePath);
    return info.isDirectory();
}

export async function isFile(filePath) {
    const info = await stat(filePath);
    return info.isFile();
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
    const exists = await isDirExists(basePath);
    if (!exists) {
        await mkdir(basePath, { recursive: true });
    }
    await writeFile(filePath, content);
}
