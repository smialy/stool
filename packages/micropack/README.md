# Micropack 
## Simple bundler for tiny modules, powered by [rollup](https://github.com/rollup/rollup)


## Installation

`npm i -D @stool/micropack`

Example of `package.json`:

```json
{
"source": "src/index.(js|mjs|jsx|ts|tsx)",
"main": "dist/foo.js",
"module": "dist/foo.mjs",
"types": "dist/types/index.d.ts",
"scripts": {
    "build": "micropack",
    "dev": "micropack --watch"
}
```

For multiple entries: `micropack.json`
```json
[{
    "input": "src/bundler.mjs",
    "output": ["dist/smicro.js", "dist/smicro.mjs"]
}, {
    "input": "src/cli.mjs",
    "output": [{
        "file":"dist/cli.mjs",
        "cli": true
    }]
}]
```
## CLI Options
```
Usage: micropack [options]

Build bundle

Options:
  --cwd <cwd>            User custom working directory (default: "/home/smialy/works/my/stool/packages/micropack")
  -f, --format <format>  Output format: (amd, cjs, es, iife, umd, system) (default: "")
  -w, --watch            Rebuilds on change (default: false)
  --compress             Compress output using Terser (default: false)
  --no-modern            Specify your target environment (modern or old)
  --dev                  Developer mode (default: false)
  --config <config>      Add cumstom config file
  --tsconfig <tsconfig>  Path to a custom tsconfig.json
  --sourcemap            Generate sourcemap (default: false)
  --jsx                  JSX pragma like React.createElement
  -h, --help             display help for command

        Basic Examples:

        $ micropack
        $ micropack --watch
```

## Roadmap
 - [ ] Async to promise (https://github.com/rpetrich/babel-plugin-transform-async-to-promises)

## License

MIT
