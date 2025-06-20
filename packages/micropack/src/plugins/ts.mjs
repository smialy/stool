import { resolve, dirname } from 'path';
import typescript2 from 'rollup-plugin-typescript2';
import typescript from '@rollup/plugin-typescript';

function getDeclarationDir(cwd, pkg) {
    if (pkg.types || pkg.typings) {
        const typeFile = pkg.types || pkg.typings;
        return dirname(resolve(cwd, typeFile));
    }
    return null;
}
export default function tsRollupPlugin({ cwd, pkg, sourcemap, jsx }) {
    const declarationDir = getDeclarationDir(cwd, pkg);
    return typescript({
            compilerOptions: {
                allowJs: true,
                sourceMap: sourcemap,
                declaration: !!declarationDir,
                ...(declarationDir && {
                    declarationDir,
                }),
                jsx: 'react-jsx',
                jsxImportSource: jsx ? jsx : 'preact',
                // jsxFactory: jsx,
                // jsxFragmentFactory: options.jsxFragment,
            },
    });
}

export function tsRollupPlugin2({ cwd, pkg, sourcemap, jsx }) {
    const declarationDir = getDeclarationDir(cwd, pkg);
    return typescript2({
        cwd,
        useTsconfigDeclarationDir: true,
        // cacheRoot: `./node_modules/.cache/.rts2_cache_${format}`,
        tsconfigDefaults: {
            compilerOptions: {
                allowJs: true,
                sourceMap: sourcemap,
                declaration: !!declarationDir,
                ...(declarationDir && {
                    declarationDir,
                }),
                jsx: 'react-jsx',
                jsxImportSource: jsx ? jsx : 'preact',
                // jsxFactory: jsx,
                // jsxFragmentFactory: options.jsxFragment,
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
