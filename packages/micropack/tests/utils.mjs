import {readFileSync} from 'fs';
import Path from 'node:path';
import Url from 'node:url';
import {spawnSync} from 'node:child_process';
import dirTree from './utils/dir-tree.mjs';


const __dirname = Url.fileURLToPath(new URL('.', import.meta.url));
const mainScript = Path.resolve(__dirname, '../src/cli.mjs');

/**
 * Minimal drop-in replacement for the `execaSync` surface this test file
 * relies on: returns `{ exitCode, stdout, stderr }` on success, and throws
 * an Error carrying those same fields when the process exits non-zero (so
 * the existing `catch (err) { return err; }` branch keeps working).
 */
function execSync(command, args, options) {
    const result = spawnSync(command, args, {...options, encoding: 'utf8'});
    if (result.error) {
        throw result.error;
    }
    const stdout = result.stdout ?? '';
    const stderr = result.stderr ?? '';
    if (result.status !== 0) {
        const err = new Error(
            `Command failed with exit code ${result.status}: ` +
            `${command} ${args.join(' ')}\n${stderr || stdout}`,
        );
        err.exitCode = result.status;
        err.stdout = stdout;
        err.stderr = stderr;
        throw err;
    }
    return {exitCode: result.status, stdout, stderr};
}

export function buildFixture(path) {
    const build = JSON.parse(readFileSync(Path.join(path, 'package.json')))['scripts']['build'];
    const buildParams = build.split(' ').slice(1);
    const params = [mainScript, ...buildParams, '--no-timestamp'];
    try {
        const result = execSync('node', params, {cwd: path});
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
        .filter(node => node.name[0] !== '.' && node.name !== 'node_modules')
        .map(node => {
            const isDir = node.type === 'directory';
            return `${indent}${node.name}\n${
                isDir ? printTree(node.children, indentLevel+1) : ''
            }`; 
        }).join("");
}
