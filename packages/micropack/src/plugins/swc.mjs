import { transform } from '@swc/core';

export const swcRollupPlugin = ({ sourcemap, modern, useTypescript }) => ({
    name: 'swc',
    async transform(code) {
        const syntax = useTypescript ? 'typescript' : 'ecmascript';
        const config = {
            jsc: {
                parser: swcParserConfig[syntax],
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: false,
                },
                target: modern ? 'es2020' : 'es2015',
                loose: true,
                // keepClassNames: true,
            },
            sourceMaps: sourcemap,
            minify: false,
        };
        // config.filename = id;
        return transform(code, config);
    },
});

const swcParserConfig = {
    typescript: {
        syntax: 'typescript',
        decorators: true,
        dynamicImport: true,
    },
    ecmascript: {
        syntax: 'ecmascript',
        jsx: false,
        dynamicImport: true,
        // "privateMethod": false,
        // "functionBind": false,
        // "classPrivateProperty": false,
        // "exportDefaultFrom": false,
        // "exportNamespaceFrom": false,
        decorators: true,
        decoratorsBeforeExport: true,
        importMeta: true,
    },
};
