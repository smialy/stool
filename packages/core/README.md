# @stool/core

A simple utility library providing essential tools web development.

## Install

```sh
npm install @stool/core
```

## API Reference

### String Utilities

#### camelCase(text: string): string
Converts hyphenated strings to camelCase.
```js
import { camelCase } from '@stool/core';
camelCase('a-b-c'); // 'aBC'
```

#### hyphenate(text: string): string
Converts camelCase strings to hyphenated format.
```js
import { hyphenate } from '@stool/core';
hyphenate('aBC'); // 'a-b-c'
```

#### format(text: string, data: object): string
Template string formatting with placeholder replacement.
```js
import { format } from '@stool/core';
format('Hello {{name}}!!!', {name:'Tom'}); // 'Hello Tom!!!'
```

#### clsx(...args: any[]): string
Conditionally joins className strings together. Supports strings, objects, arrays, and mixed types.
```js
import { clsx } from '@stool/core';

clsx('a', 1, 0, null, undefined, NaN, true); 
//=> 'a 1'

clsx('foo', true && 'bar', 'baz');
//=> 'foo bar baz'

clsx(['a', 'b', 'c']);
//=> 'a b c'

clsx({ foo: true, bar: false}, {a: true, b: false});
//=> 'foo a'
```

### Function Utilities

#### noop(): void
A no-operation function that does nothing.
```typescript
import { noop } from '@stool/core';
const callback = noop; // Safe default callback
```

#### tr(...functions): any
Executes functions sequentially and returns the first successful result (without throwing an error).
```js
import { tr } from '@stool/core';
tr(() => { throw new Error() }, () => 'Success'); // 'Success'
```

#### debounce(fn: Function, wait: number): Function
Creates a debounced function that delays execution until after the specified wait time.
```js
import { debounce } from '@stool/core';
const debouncedFn = debounce(() => console.log('Called'), 300);
```

#### throttle(fn: Function, wait: number): Function
Creates a throttled function that executes at most once per specified time period.
```js
import { throttle } from '@stool/core';
const throttledFn = throttle(() => console.log('Called'), 300);
```

### Random Utilities

#### randomInt(max: number): number
#### randomInt(min: number, max: number): number
Generates random integers within specified range.
```js
import { randomInt } from '@stool/core';
randomInt(10); // [0..9]
randomInt(5, 10); // [5..9]
```

#### choice(array: T[]): T
Returns a random element from the provided array.
```js
import { choice } from '@stool/core';
choice([1, 2, 3]); // 1 or 2 or 3
```

#### sid(length?: number): string
Generates a unique string identifier. Default length is 32 characters.
```js
import { sid } from '@stool/core';
sid(); // 'IBA1CCRQ69NIELNLBG65WHHEGNVGQPO1' (32 chars)
sid(3); // 'WK5' (3 chars)
```

#### uidFactory(): () => string
Creates a factory function that generates sequential unique identifiers.
```js
import { uidFactory } from '@stool/core';
const uid = uidFactory();
uid(); // '0'
uid(); // '1'
uid(); // '2'
```

### Type Checking

Comprehensive type detection utilities in the `Types` namespace:

```js
import { Types } from '@stool/core';

Types.get([]); // 'array'
Types.get({}); // 'object'
Types.get(null); // 'null'

// Boolean checkers
Types.isArray([1, 2, 3]); // true
Types.isObject({}); // true
Types.isString('hello'); // true
Types.isNumber(42); // true
Types.isFunction(() => {}); // true
Types.isBoolean(true); // true
Types.isNull(null); // true
Types.isUndefined(undefined); // true
Types.isNil(null); // true (null or undefined)
Types.isDate(new Date()); // true
Types.isRegExp(/test/); // true
Types.isElement(document.body); // true
```

### DOM Utilities

#### DOM.ready(): Promise<void>
Returns a promise that resolves when the DOM is fully loaded.
```js
import { DOM } from '@stool/core';
await DOM.ready();
console.log('DOM is ready!');
```

#### DOM.findParent(element: HTMLElement, selector: string): HTMLElement | null
Finds the closest parent element matching the selector class.
```js
import { DOM } from '@stool/core';
const parent = DOM.findParent(element, 'my-class');
```

#### DOM.importStyles(styles: string | string[], name?: string): () => void
Injects CSS styles into the document head. Returns a cleanup function.
```js
import { DOM } from '@stool/core';
const cleanup = DOM.importStyles('.my-class { color: red; }', 'my-styles');
// Later: cleanup() to remove styles
```

#### DOM.fromEvent(element: HTMLElement, eventName: string): Observable
Creates an Observable from DOM events.
```js
import { DOM } from '@stool/core';
const clicks$ = DOM.fromEvent(button, 'click');
clicks$.subscribe(event => console.log('Clicked!'));
```

### Reactive Programming

#### Observable
Re-exported from `zen-observable-ts` for reactive programming patterns.

#### Subject<T>
A custom Subject implementation extending Observable for multi-casting.
```js
import { Subject } from '@stool/core';

const subject = new Subject();
subject.subscribe(value => console.log('Received:', value));
subject.next('Hello World');
subject.complete();
```

#### EventEmitter<T>
A type-safe event emitter with automatic cleanup.
```js
import { EventEmitter } from '@stool/core';

const emitter = new EventEmitter();
const unsubscribe = emitter.events(data => console.log(data));
emitter.fire({ message: 'Hello' });
unsubscribe(); // Remove listener
emitter.dispose(); // Cleanup
```

### Lifecycle Management

#### IDisposable
Interface for objects that require cleanup.
```typescript
import { IDisposable, isDisposable } from '@stool/core';

class MyClass implements IDisposable {
  dispose() {
    // Cleanup logic
  }
}

if (isDisposable(obj)) {
  obj.dispose();
}
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions. All exports are properly typed for the best development experience.

## License

MIT
