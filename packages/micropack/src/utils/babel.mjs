import babel from '@babel/core';
import babelPlugin from '@rollup/plugin-babel';

export async function createBabelConfig(options) {
    const plugins = await createBabelPlugins('plugin', [
        {
            name: 'babel-plugin-transform-async-to-promises',
            inlineHelpers: true,
            externalHelpers: false,
            minify: true,
        },
        {
            name: '@babel/plugin-transform-react-jsx',
            pragma: options.jsx || 'h',
            // pragmaFrag: customOptions.pragmaFrag || 'Fragment',
        },
        {
            name: '@babel/plugin-proposal-class-properties',
            loose: true,
        },
        {
            name: '@babel/plugin-transform-regenerator',
            async: false,
        },
    ]);
    const presets = await createBabelPlugins('preset', [
        {
            name: '@babel/preset-env',
            loose: true,
            useBuiltIns: false,

        }
    ])
    return babelPlugin.getBabelOutputPlugin({
        plugins,
        presets,
    });
}

async function createBabelPlugins(type, configs) {
    return Promise.all(configs.map(async ({ name, ...options}) => {
        const module = await import(name);
        return babel.createConfigItem([module.default, options], { type });
    }));
}