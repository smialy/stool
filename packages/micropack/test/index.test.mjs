import { readdirSync, statSync, readFileSync } from 'fs';
import url from 'node:url';
import path from 'node:path';
import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

import { buildFixture, printDirTree, findAllFiles } from './utils.mjs';

chai.use(jestSnapshotPlugin());


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const FIXTURES_DIR = `${__dirname}fixtures`;


describe('fixtures', () => {
    const files = readdirSync(FIXTURES_DIR);
    const dirs = files
        .map(file => path.join(FIXTURES_DIR, file))
        .filter(file => statSync(file).isDirectory());

    dirs.forEach((fdir) => {
        const rdir = path.relative(__dirname, fdir);
        it(`build ${rdir}`, () => {
            const output = buildFixture(fdir);
            const tree = printDirTree(fdir);
            expect([
                "Tree:",
                tree,
                "Output:",
                output,
                ].join('\n'),
            ).toMatchSnapshot();

            const distDir = path.join(fdir, 'dist');
            const files = findAllFiles(distDir, entry => {
                if (/.map$/.test(entry.name)) return false;
                return true;
            });
            for(const [name, filePath] of files) {
                expect(readFileSync(filePath, { encoding: 'utf8'})).toMatchSnapshot(`dist/${name}`);
            }
        });
    });
});
