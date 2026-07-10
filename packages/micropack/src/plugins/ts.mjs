import { resolve, dirname } from 'path';
// import typescript2 from 'rollup-plugin-typescript2';
import typescript from '@rollup/plugin-typescript';

function getDeclarationDir(cwd, pkg) {
    if (pkg.types || pkg.typings) {
        const typeFile = pkg.types || pkg.typings;
        return dirname(resolve(cwd, typeFile));
    }
    return null;
}
export default function tsRollupPlugin({ cwd, pkg, sourcemap, jsx }, outDir) {
    const declarationDir = getDeclarationDir(cwd, pkg);
    return typescript({
            compilerOptions: {
                allowJs: true,
                // outDir must match the Rollup output dir, otherwise
                // @rollup/plugin-typescript auto-creates a temp outDir
                // outside the output dir and fails validatePaths.
                ...(outDir && { outDir }),
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
