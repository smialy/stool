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
declare function ready(): Promise<void>;
```

```js
import { ready } from '@stool/dom';

async function boot(){
    await ready();
    // ...
}
```
## findParentNode()
 
 > Find parent of element using selector.

```typescript
declare function findParent(element: HTMLElement, selector: string): HTMLElement|null;
```
```js
const container = findParent(element, '.container');
```


### fromEvent()

> Create event stream base on Observable.

```typescript
function fromEvent(element: HTMLElement, eventName: string): Observable
```

```typescript
cosnt subscription = fromEvent(element, "keydown").subscribe(event => {
    console.log(event);
});
// ...
subscription.unsubscribe();
```
@see: <br/>
[proposal-observable](https://github.com/tc39/proposal-observable) <br/>
[zen-observer](https://github.com/zenparsing/zen-observable)

### 

> Import style(s) to `document`.

```typescript
function importStyles(styles: string[] | string, name: string = '@stool/dom'): () => void
```

## License
MIT
