import { resolve } from 'path';

import { DEFAULT_OPTIONS } from './consts.mjs';
import { readJsonFile, isFileExists } from './utils/file.mjs';
import { elapsed } from './utils/time.mjs';
import { RollupTask } from './rollup.mjs';

export default async function micropack({
    cwd,
    printConfig,
    configFile,
    watch,
    ...cliOptions
}) {
    cwd = cwd ? resolve(process.cwd(), cwd) : process.cwd();
    const fileOptions = await readConfigFile(cwd, configFile);
    const pkg = await readPackageFile(cwd);
    const { type, entries } = findEntries(fileOptions, pkg);
    const ts = await findTsconfigFile(cwd);
    const options = validateConfig({
        ...DEFAULT_OPTIONS,
        ...(pkg.micropack || {}),
        ...fileOptions,
        ...cliOptions,
        cwd,
        pkg,
        ts,
        entries,
        entriesType: type,
    });

    if (printConfig) {
        console.log(options);
        return 0;
    }
    if (!options.entries?.length) {
        console.log('Nothing to build.');
        return 0;
    }
    const tasks = new Tasks(options);

    if (watch) {
        return tasks.watch();
    }
    return tasks.build();
}

class Tasks {
    constructor(options) {
        this.options = options;
        this.tasks = options.entries.map(
            ({ input, outputs }) => new RollupTask(options, input, outputs),
        );
    }
    async build() {
        const elapse = elapsed();
        console.log('Building...');
        await Promise.all(this.tasks.map((task) => task.build()));
        if (this.options.timestamp) {
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

export function validateConfig(conf) {
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
export function findEntries({ entries }, pkg) {
    if (entries) {
        return { entries, type: 'config.file' };
    }
    return findPackageEntries(pkg);
}

export function findPackageEntries(pkg) {
    let entries = checkExportEntries(pkg);
    if (entries.length) {
        return { entries, type: 'pkg.exports' };
    }
    entries = checkGlobalEntries(pkg);
    if (entries.length) {
        return { entries, type: 'pkg.global' };
    }
    if (pkg.micropack?.entries) {
        return { entries, type: 'pkg.micropack' };
    }
    console.warn('Missing key: "source" in package.json file.');
    return { entries: [], type: 'none' };
}

export function* findExportsEntries(exports) {
    if (typeof exports === 'string') return;
    const { source: input } = exports;
    if (!input) return;
    const names = ['browser', 'import', 'module', 'main', 'default'];
    const outputs = [
        ...new Set(
            names
                .filter(
                    (name) =>
                        exports[name] && typeof exports[name] === 'string',
                )
                .map((name) => exports[name]),
        ),
    ];
    if (outputs.length) {
        yield { input, outputs };
    }
}

export function checkExportEntries(pkg) {
    if (!pkg.exports) return [];
    return Object.values(pkg.exports).flatMap((values) => [
        ...findExportsEntries(values),
    ]);
}
export function checkGlobalEntries(pkg) {
    const { source: file } = pkg;
    if (!file) return [];
    const outputs = ['main', 'module', 'unpkg']
        .filter((name) => pkg[name])
        .map((name) => ({ file: pkg[name], cli: false }));
    return [{ input: { file }, outputs }];
}
