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
}
```

Running `micropack` with no extra options reads `source` as the entry and
writes one output per `main` / `module` / `unpkg` field it finds.

## Multiple entries

There are two ways to declare multiple entries. Micropack picks the first
that matches, in this order:

1. **`micropack.json`** (or any file passed via `-c`) — explicit config.
2. **`package.json#exports`** — per-subpath `source` + output keys.
3. **`package.json`** global keys (`source` + `main`/`module`/`unpkg`).

### Via `package.json#exports`

Each subpath of `exports` may carry a `source` (the input) alongside any of
the output keys `browser`, `import`, `module`, `main`, `default`. Outputs are
deduplicated, so pointing `import` and `default` at the same file builds it
once.

```json
{
    "exports": {
        ".": {
            "source": "./src/index.ts",
            "import": "./dist/index.mjs",
            "main": "./dist/index.js"
        },
        "./sub": {
            "source": "./src/sub.ts",
            "import": "./dist/sub.mjs"
        }
    }
}
```

### Via a config file

Default config file name is `micropack.json`. Override with `-c <path>`:

```json
{
    "entries": [
        {
            "input": "src/bundler.mjs",
            "outputs": ["dist/smicro.js", "dist/smicro.mjs"]
        },
        {
            "input": "src/cli.mjs",
            "outputs": [{ "file": "dist/cli.mjs", "cli": true }]
        }
    ]
}
```

Each entry has an `input` (string, or `{ file, cli }`) and `outputs` (an
array of strings or `{ file, cli, format }` objects). A single non-array
`outputs` value is normalised to a one-element array.

## CLI Options

```
Usage: micropack [options]

Build bundle

Options:
  --show-config                 Show current config (default: false)
  -c, --config-file <config>    Add custom config file (default: "micropack.json")
  -f, --format <format>         Build only in specified format (es, cjs)
  -w, --watch                   Rebuild on change (default: false)
  -i, --include <package-name>  Include external package (repeatable, comma-separated)
  -p, --paths <paths>           List of modules to replace
  -d, --define <vars>           Inline variables, e.g. -d VERSION:1.0.0 (repeatable)
  --cwd <cwd>                   Use custom working directory
  --dev                         Developer mode (faster rebuilds) (default: false)
  --no-modern                   Target older environments (defaults to modern)
  --no-sourcemap                Skip sourcemap generation
  -v, --verbose                 Increase verbosity (repeatable)
  --jsx <name>                  JSX runtime (default: "preact")
  --compress                    Enable output compression via Terser (default: false)
  --css-module                  Parse .css files as CSS modules (default: null)
  --no-timestamp                Omit the build timestamp from output
  -h, --help                    Display help for commander

Basic Examples:

    $ micropack
    $ micropack --watch
    $ micropack -c ./build.config.json --compress
    $ micropack -f es --no-sourcemap
```

## Tests

```bash
npm test        # vitest run
npm run lint    # eslint src/**/*.mjs
```

End-to-end build tests live in `tests/fixtures/`. Each fixture is a tiny
package with its own `package.json` `build` script; `tests/index.test.mjs`
runs the CLI against it and snapshots the resulting `dist/` tree and file
contents. Existing fixtures cover:

- `simple` — default build
- `compress` — `--compress`
- `css-module` — CSS modules via `*.module.css`
- `no-modern` — `--no-modern`
- `no-sourcemap` — `--no-sourcemap`
- `pkg-exports` — multiple entries via `package.json#exports`
- `config-file` — custom config loaded via `-c`

To add a new build test, drop a directory under `tests/fixtures/` with a
`package.json` `build` script and `src/`; the snapshot harness picks it up
automatically.

## Roadmap

## License

MIT