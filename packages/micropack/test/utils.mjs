import {execaSync} from 'execa';
import dirTree from 'directory-tree';


export function buildFixture(path) {
    try {
        const result = execaSync('npm', ['run', 'build'], {cwd: path});
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
