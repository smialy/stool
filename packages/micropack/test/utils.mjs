import {readFileSync} from 'fs';
import Path from 'node:path';
import Url from 'node:url';
import {execaSync} from 'execa';
import dirTree from 'directory-tree';


const __dirname = Url.fileURLToPath(new URL('.', import.meta.url));
const mainScript = Path.resolve(__dirname, '../src/cli.mjs');

export function buildFixture(path) {
    const build = JSON.parse(readFileSync(Path.join(path, 'package.json')))['scripts']['build'];
    const buildParams = build.split(' ').slice(1);
    const params = [mainScript, ...buildParams, '--no-timestamp'];
    try {
        const result = execaSync('node', params, {cwd: path});
        if (result.stderr) {
            return result.stderr;
        }
    } catch(err) {
        return err;
    }
}
const sortTreeEntries = nodes => nodes.sort((a,b) => a.path.localeCompare(b.path));

export function* findAllFiles(path, filter) {
    const tree = dirTree(path, { attributes: ["type"]});
    const stack = [tree];
    while (stack.length) {
        const entry = stack.pop();
        if (entry.type === 'directory') {
            if (entry.children) {
                stack.push(...sortTreeEntries(entry.children));
            }
            continue;
        }
        if (filter && !filter(entry)) {
            continue;
        }
        yield [entry.name, entry.path];
    }
}

export function printDirTree(path) {
    const tree = dirTree(path, { attributes: ["type"]});   
    return printTree([tree]);
}

function printTree(nodes, indentLevel=0) {
    const indent = '  '.repeat(indentLevel);
    return sortTreeEntries(nodes)
        .filter(node => node.name[0] !== '.')
        .map(node => {
            const isDir = node.type === 'directory';
            return `${indent}${node.name}\n${
                isDir ? printTree(node.children, indentLevel+1) : ''
            }`; 
        }).join("");
}
