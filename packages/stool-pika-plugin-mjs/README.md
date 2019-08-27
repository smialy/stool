# @stool/pika-plugin-mjs


## Install

Rename file `*.js` to `*.mjs` in `pkg/dist-web/` and `pkg/dist-src/`.

```sh
# npm:
npm install @stool/pika-plugin-mjs --save-dev
# yarn:
yarn add @stool/pika-plugin-mjs --dev
```


## Usage

```js
{
  "name": "example-package-json",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@stool/pika-plugin-mjs"]
    ]
  }
}
```