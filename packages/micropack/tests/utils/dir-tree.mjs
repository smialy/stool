import { readdirSync, statSync } from 'fs';
import { basename, extname, join } from 'path';

/**
 * Minimal directory-tree builder tailored to what these tests need.
 *
 * Supported options (subset of the `directory-tree` npm package):
 *   - attributes: ['type' | 'extension' | 'size']
 *   - extensions: RegExp   — only keep files whose ext matches
 *   - exclude:    RegExp | RegExp[] — drop entries whose path matches
 *   - depth:      number   — stop recursing past this depth (0 = top only)
 *
 * Each returned node has at least `{ path, name }` plus whatever is requested
 * via `attributes`. Directories additionally carry a `children` array.
 *
 * @param {string} rootPath
 * @param {object} [options]
 * @returns {object|null}
 */
export default function directoryTree(rootPath, options = {}, currentDepth = 0) {
    const {
        attributes = [],
        extensions,
        exclude,
        depth,
    } = options;

    const excludes = exclude
        ? Array.isArray(exclude) ? exclude : [exclude]
        : null;

    let stats;
    try {
        stats = statSync(rootPath);
    } catch {
        return null;
    }

    if (excludes && excludes.some((re) => re.test(rootPath))) {
        return null;
    }

    const name = basename(rootPath);
    const node = { path: rootPath, name };

    if (stats.isFile()) {
        const ext = extname(rootPath).toLowerCase();
        if (extensions && !extensions.test(ext)) {
            return null;
        }
        for (const attr of attributes) {
            if (attr === 'type') node.type = 'file';
            else if (attr === 'extension') node.extension = ext;
            else if (attr === 'size') node.size = stats.size;
            else node[attr] = stats[attr];
        }
        return node;
    }

    if (stats.isDirectory()) {
        let entries;
        try {
            entries = readdirSync(rootPath);
        } catch (err) {
            if (err.code === 'EACCES' || err.code === 'EPERM') return null;
            throw err;
        }
        if (depth === undefined || depth > currentDepth) {
            node.children = entries
                .map((child) =>
                    directoryTree(join(rootPath, child), options, currentDepth + 1),
                )
                .filter(Boolean);
        }
        for (const attr of attributes) {
            if (attr === 'type') node.type = 'directory';
            else if (attr === 'extension') continue;
            else if (attr === 'size') {
                if (!node.children) node.size = undefined;
                else if (node.children.some((c) => c.size === undefined)) {
                    node.size = undefined;
                } else {
                    node.size = node.children.reduce((s, c) => s + c.size, 0);
                }
            } else {
                node[attr] = stats[attr];
            }
        }
        return node;
    }

    return null;
}