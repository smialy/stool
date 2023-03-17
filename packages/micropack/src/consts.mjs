export const DEFAULT_CONFIG_NAME = 'micropack.json';

export const DEFAULT_OPTIONS = {
    cwd: process.cwd(),
    dev: false,
    watch: false,
    configFile: DEFAULT_CONFIG_NAME,
    modern: true,
    sourcemap: true,
    include: [],
    paths: {},
    define: {},
    compress: false,
    css: 'inline',
    cssModule: null,
};
