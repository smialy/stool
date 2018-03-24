# sjs-di

Very simple dependency injection

## Installation

```
$ npm install sjs-di
```

## Lets DI

### Prepare

> repository.js
```js
import {Inject} from 'sjs-di';
import {HttpClient} from 'some-http-client';

@Inject(HttpClient)
export class Repository {
    constructor(http){
        //...
    }
    async getUsers(){
        //...
    }
}
```
> users.js
```js
import {Inject} from 'sjs-di';
import {Repository} from './repository';

@Inject(Repository)
export class Users {
    constructor(repo){
        //...
    }
}
```
```js
import {Inject} from 'sjs-di';
import {Users} from './users';

@Inject(Users)
export class App {
    constructor(users){
        //...
    }
}
```

and use it
> main.js
```js
import {Container} from 'sjs-di';
import {HttpClient} from 'some-http-client';
import {App} from './app';

let container = new Container();
container.registerInstance(HttpClient, new HttpClient('/api'))
let app = container.get(App);
```

## Running tests

```
$ npm test
```

# License

  MIT
