import fs from 'fs';
import afs from 'fs/promises';
import * as Path from 'path';
import { fileURLToPath } from 'url';
import micropack from '../src/micropack.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const FIXTURES_DIR = `${__dirname}/fixtures`;

describe('fixtures', () => {
    const dirs = fs
        .readdirSync(FIXTURES_DIR)
        .filter(fixturePath =>
            fs.statSync(Path.resolve(FIXTURES_DIR, fixturePath)).isDirectory(),
        );
    it.each(dirs)("build package: %s", async dir => {
        const path = Path.resolve(FIXTURES_DIR, dir);
        const stdout = await build(path);
        expect(stdout).toMatchSnapshot();

        const pkg = await readPackeageFile(path);
        const outputFiles = findOutputFiles(pkg);
        const result = await Promise.all(
            outputFiles.map(file => Path.resolve(path, file))
            .map(isFileExist));
        const fileExists = outputFiles.map((file, i) => [file, result[i]]);
        expect(fileExists).toMatchSnapshot();
    });
});

async function build(cwd) {
    const cl = console.log;
    const cw = console.warn;

    const buff = [];
    console.log = msg => buff.push(`log: ${msg}`);
    console.warn = msg => buff.push(`warn: ${msg}`);
    try {
        await micropack({ cwd });
    } catch(e) {
        buff.push(e.toString());
    } finally {
        console.log = cl;
        console.warn = cw;
    }
    return buff.join("\n");
}

async function readPackeageFile(dir) {
    return readJsonFile(Path.resolve(dir, 'package.json'));
}

async function readJsonFile(filePath) {
    const data = await afs.readFile(filePath, "utf-8");
    return JSON.parse(data);
}

function findOutputFiles(pkg) {
    return ['main', 'module', 'types'].map(name => pkg[name]).filter(path => path);
}

async function isFileExist(filePath) {
    try {
        return (await afs.stat(filePath)).isFile();
    } catch(e) {

    }
    return false;
}