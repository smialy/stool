import { transform } from '@swc/core';

export default function swcRollupPlugin(
    { sourcemap, modern, jsx },
    useTypescript,
) {
    return {
        name: 'swc',
        async transform(code) {
            const syntax = useTypescript ? 'typescript' : 'ecmascript';
            const config = {
                jsc: {
                    parser: swcParserConfig[syntax],
                    transform: {
                        legacyDecorator: true,
                        decoratorMetadata: false,
                        react: {
                            runtime: 'automatic',
                            importSource: jsx ? jsx : 'preact',
                            // pragma: "h",
                            // pragmaFrag: "Fragment",
                            throwIfNamespace: true,
                            development: false,
                            useBuiltins: false,
                        },
                    },
                    target: 'es2020',
                    loose: true,
                    keepClassNames: true,
                },
                sourceMaps: sourcemap,
                minify: false,
            };
            // config.filename = id;
            return transform(code, config);
        },
    };
}

const swcParserConfig = {
    typescript: {
        syntax: 'typescript',
        tsx: true,
        decorators: true,
        dynamicImport: true,
    },
    ecmascript: {
        syntax: 'ecmascript',
        jsx: true,
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
