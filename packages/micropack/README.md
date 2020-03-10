# smicro
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

## License

MIT
