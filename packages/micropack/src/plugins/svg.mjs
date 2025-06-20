import { readFileSync } from 'fs';
import { extname } from 'node:path';
import { createFilter } from '@rollup/pluginutils';

export default function svg(options = {}) {
    const filter = createFilter(options.include, options.exclude);
    return {
        name: 'svg-import',
        load: (id) => {
            if (!filter(id) || extname(id) !== '.svg') return null;
            const source = readFileSync(id, 'utf-8').trim().replace(/[\r\n]+/gm, '');
            return `export default '${source}';`;
        },
    };
};
