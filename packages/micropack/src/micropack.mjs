import { resolve } from 'path';

import { DEFAULT_OPTIONS } from './consts.mjs';
import { readJsonFile, isFileExists } from './utils/file.mjs';
import { elapsed } from './utils/time.mjs';
import { RollupTask } from './rollup.mjs';

export default async function micropack({ cwd, configFile, ...cliOptions }) {
    cwd = resolve(process.cwd(), cwd);
    const pkg = await readPackageFile(cwd);
    const ts = await findTsconfigFile(cwd);
    const entries = findPackageEntries(pkg);
    const configOptions = await readConfigFile(cwd, configFile);

    const initOptions = {
        ...DEFAULT_OPTIONS,
        ...cliOptions,
        ...(pkg.micropack || {}),
        ...configOptions,
        cwd,
        pkg,
        ts,
        entries,
    };

    const options = validateConfig(initOptions);
    if (options.printConfig) {
        console.log(options);
        return 0;
    }

    if (!options.entries?.length) {
        console.log('Nothing to build.');
        return;
    }
    const tasks = new Tasks(options);

    if (options.watch) {
        return tasks.watch();
    }
    return tasks.build();
}

class Tasks {
    constructor(options) {
        this.options = options;
        this.tasks = options.entries.map(
            ({ input, outputs }) => new RollupTask(options, input, outputs)
        );
    }
    async build() {
        const elapse = elapsed();
        console.log('Building...');
        await Promise.all(this.tasks.map((task) => task.build()));
        if (this.options.showBuildtime) {
            console.log(`Done. (${elapse()})`);
        } else {
            console.log('Done.');
        }
    }
    async watch() {
        const listener = watchListener();
        return Promise.all(this.tasks.map((task) => task.watch(listener)));
    }
}

function watchListener() {
    let items = 0;
    return (name, payload) => {
        switch (name) {
            case 'start':
                if (items === 0) {
                    console.log('Building...');
                }
                items += 1;
                break;
            case 'error':
                console.warn(payload);
                break;
            case 'end':
                items -= 1;
                for (const file of payload) {
                    console.log(`    ${file}`);
                }
                if (items === 0) {
                    console.log('Done');
                }
                break;
        }
    };
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

async function readConfigFile(cwd, configFile) {
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
            outputs: outputs.map((output) => {
                if (typeof output === 'string') {
                    return {
                        file: output,
                        cli: false,
                    };
                }
                return output;
            }),
        });
    }

    return { ...config, entries };
}

function findPackageEntries(pkg) {
    let entries = checkExportEntries(pkg);
    if (!entries?.length) {
        entries = checkGlobalEntries(pkg);
    }
    if (entries.length) {
        return entries;
    }
    console.warn('Missing key: "source" in package.json file.');
    return [];
}
function* findExportsEntries(exports) {
    const names = ['browser', 'import', 'module', 'main', 'default'];
    if (typeof exports !== 'string') {
        const { source: input } = exports;
        if (input) {
            const outputs = names
                .filter(
                    (name) => exports[name] && typeof exports[name] === 'string'
                )
                .map((name) => exports[name]);
            if (outputs.length) {
                yield {
                    input,
                    outputs: [...new Set(outputs)],
                };
            }
        }
    }
}

function checkExportEntries(pkg) {
    const { exports } = pkg;
    const entries = [];
    if (exports) {
        for (const values of Object.values(exports)) {
            for (const entry of [...findExportsEntries(values)]) {
                entries.push(entry);
            }
        }
    }
    return entries;
}
function checkGlobalEntries(pkg) {
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
