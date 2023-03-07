# @stool/dom

DOM helpers.

## Install

```sh
npm install @stool/dom
```

## Using

### ready() 

> Waiting for DOM ready.

```typescript
declare function ready(): Promise<any>;
```

```js
import { ready } from '@stool/dom';

async function boot(){
    await ready();
    // ...
}
```
### classNames()

> Conditionally joining classNames together.

```typescript
declare function findParent(element: HTMLElement, selector: string): HTMLElement | null;
```
```js
classNames('foo', 'bar'); // 'foo bar'
classNames('foo', { bar: true }); // 'foo bar'
classNames({ 'foo-bar': false }); // ''
classNames({ 'foo-bar': true }); // 'foo-bar'
classNames({ foo: true }, { bar: true }); // 'foo bar'
classNames(null, false, 'foo', undefined, 0, 1, { baz: null }, ''); // 'foo 1'
```

#### findParentNode()
 
 > Find parent of element using selector.

```typescript
declare function findParent(element: HTMLElement, selector: string): HTMLElement|null;
```
```js
const container = findParent(element, '.container');
```
## License
MIT
