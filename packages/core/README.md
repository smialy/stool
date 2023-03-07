# @stool/core

JavaScript core tools.

## Install

```sh
npm install @stool/core
```

## Using

### String

#### camelCase()
```js
camelCase('a-b-c'); // aBC
```
#### hyphenate()
```js
hyphenate('aBC'); // a-b-c
```
#### format()
```js
format('Hello {{name}}!!!', {name:'Tom'}); // 'Hello Tom!!!'
```

### Function

#### noop()
```typescript
declarate function noop() {};
```
#### tr()
> Pick first value without error
```js
tr(() => { throw new Error() }, () => 'One'); // 'One';
```

#### clone()
> Clone object


### Random
#### randomInt()
```js
randomInt(10); // [0..9]
randomInt(5, 10); //[5..9]
```

#### choice()
```js
choice(); // null
choice([1,2,3]); // 1 or 2 or 3
```

#### sid(len=32)
```js
sid(); // IBA1CCRQ69NIELNLBG65WHHEGNVGQPO1 (32)
sid(3); //WK5
```
#### createUID()
```js
const uid = createUID();
uid(); // '0'
...
uid(); // 'ac'
uid(); // 'ad'
```

## License
MIT
