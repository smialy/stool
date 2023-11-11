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
#### uidFactory()
```js
const uid = uidFactory();
uid(); // '0'
...
uid(); // 'ac'
uid(); // 'ad'
```


classNames('foo', 'bar'); // 'foo bar'
classNames('foo', { bar: true }); // 'foo bar'
classNames({ 'foo-bar': false }); // ''
classNames({ 'foo-bar': true }); // 'foo-bar'
classNames({ foo: true }, { bar: true }); // 'foo bar'
classNames(null, false, 'foo', undefined, 0, 1, { baz: null }, ''); // 'foo 1'
```

#### clsx
> Conditionally joining className together.

```js
import { clsx } from '@stool/core';

clsx('a', 1, 0, null, undefined, NaN, true); 
//=> 'a 1'

clsx('foo', true && 'bar', 'baz');
//=> 'a b c'

clsx(['a', 'b', 'c']);
//=> 'a b c'

clsx({ foo: true, bar: false}, {a: true, b: false})
//=> 'foo a'
```

## License
MIT
