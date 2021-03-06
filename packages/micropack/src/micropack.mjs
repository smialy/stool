import { resolve } from 'path';

import { DEFAULT_OPTIONS } from './consts.mjs';
import { readJsonFile, isFileExists } from './utils/file.mjs';
import { elapsed } from './utils/time.mjs';
import { RollupTask } from './rollup.mjs';

export default async function micropack(options) {
    options = { ...DEFAULT_OPTIONS, ...options };
    options.cwd = resolve(process.cwd(), options.cwd);
    options.pkg = await readPackageFile(options.cwd);
    options.ts = await findTsconfigFile(options.cwd);
    options.entries = findPackageEntries(options.pkg);
    const config = await readConfigFile(options.cwd, options.configFile);
    options = validateConfig({ ...options, ...config });
    if (!options.entries?.length) {
        console.log('Nothing to build.');
        return;
    }

    const tasks = options.entries.map(
        ({ input, outputs }) => new RollupTask(options, input, outputs)
    );

    if (options.watch) {
        return Promise.all(tasks.map((task) => task.watch()));
    }
    if (tasks.length) {
        console.log('Building...');
        const elapse = elapsed();
        for (const task of tasks) {
            await task.build();
        }
        if (options.showBuildime) {
            console.log(`Done. (${elapse()})`);
        } else {
            console.log('Done.');
        }
    }
}

function readPackageFile(cwd) {
    return readJsonFile(resolve(cwd, 'package.json'));
}
async function findTsconfigFile(cwd) {
    const tsConfigFile = resolve(cwd, 'tsconfig.json');
    if (await isFileExists(tsConfigFile)) {
        return await readJsonFile(tsConfigFile);
    }
    return {};
}

async function readConfigFile(cwd, configFile = '.micropack.json') {
    const filePath = resolve(cwd, configFile);
    if (await isFileExists(filePath)) {
        try {
            return await readJsonFile(filePath);
        } catch (e) {
            console.warn(e);
        }
    }
    return {};
}

function validateConfig(conf) {
    const config = {
        include: [],
        global: {},
        define: {},
        entries: {},
        ...conf,
    };
    const entries = [];
    for (let { input, outputs } of config.entries) {
        if (!Array.isArray(outputs)) {
            outputs = [outputs];
        }
        if (typeof input === 'string') {
            input = {
                file: input,
                cli: false,
            };
        }
        if (!input.file) {
            throw new Error('Not found input file.');
        }
        if (!outputs.length) {
            throw new Error(`Not found any outputs files for: "${input.file}"`);
        }
        entries.push({
            input,
            outputs,
        });
    }

    return { ...config, entries };
}

function findPackageEntries(pkg) {
    const { source: file } = pkg;
    if (file) {
        const names = ['main', 'module', 'unpkg'];
        const outputs = names.reduce((acc, name) => {
            if (pkg[name]) {
                const file = pkg[name];
                acc.push({
                    file,
                    cli: false,
                });
            }
            return acc;
        }, []);
        return [
            {
                input: {
                    file,
                },
                outputs,
            },
        ];
    }
    console.warn('Missing key: "source" in package.json file.');
    return [];
}

//"@modular-css/rollup": "26.0.0",
// css({
//     json: true,
//     meta: true,
//     namedExports: true,
//     styleExport: true,
//     dev: options.dev,
//     verbose: options.dev,
//     empties: true,
//     // namer: shornames(),
// }),
