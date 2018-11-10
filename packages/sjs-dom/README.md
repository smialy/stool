# sjs-dom

### Install

```sh
npm install sjs-dom
```

### Using

#### ready()
```typescript
declare function ready(): Promise<any>;
```

```js
import { ready } from 'sjs-dom';

async function boot(){
    await ready();
    // ...
}
```
#### classNames()
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
```typescript
declare function classNames(...args: any[]): string;
```

## License
MIT
