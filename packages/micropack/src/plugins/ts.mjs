import typescript from 'rollup-plugin-typescript2';

export function tsRollupPlugin(options) {
    return typescript({
        cacheRoot: `./node_modules/.cache/.rts2_cache_${options.format}`,
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
            compilerOptions: {
                sourceMap: options.sourcemap,
                declaration: true,
                allowJs: true,
                // declarationDir: getDeclarationDir({ options, pkg }),
                jsx: 'preserve',
                jsxFactory:
                    options.jsx === 'React.createElement'
                        ? undefined
                        : options.jsx || 'h',
            },
            // files: options.entries,
        },
        tsconfigOverride: {
            compilerOptions: {
                module: 'ESNext',
                target: 'esnext',
            },
        },
    });
}
