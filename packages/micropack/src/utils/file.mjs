import fs from 'fs';
import { promisify } from 'util';

export const readFile = promisify(fs.readFile);
export const readFileStat = promisify(fs.stat);

export function isDir(filePath) {
    stat(filePath)
        .then((stat) => stat.isDirectory())
        .catch(() => false);
}

export function isFile(filePath) {
    stat(filePath)
        .then((stats) => stats.isFile())
        .catch(() => false);
}

export async function readJsonFile(filePath) {
    const payload = await readFile(filePath, 'utf8');
    try {
        return JSON.parse(payload);
    } catch (e) {
        console.warn(e);
    }
}
