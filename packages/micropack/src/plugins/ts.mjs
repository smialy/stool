import typescript from '@rollup/plugin-typescript';

export function tsRollupPlugin({ sourcemap, jsx, modern }) {
    return typescript({
        compilerOptions: {
            module: 'ESNext',
            target: modern ? 'ES2020' : 'ES2015',
            // sourceMap: sourcemap,
            // declaration: true,
            // allowJs: true,
            // declarationDir: getDeclarationDir({ options, pkg }),
            jsx: 'react-jsx',
            jsxImportSource: jsx ? jsx : 'preact',
            // jsx: 'react',
            // jsxFactory: jsx === 'React.createElement' ? undefined: jsx || 'h',
            // jsxFragmentFactory: 'Fragment',
        },
    });
}
