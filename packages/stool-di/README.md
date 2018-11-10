# @stool/di

Very simple dependency injection

## Installation

```
$ npm install @stool/di
```

## Lets DI

### Prepare

> repository.js
```js
import {Inject, Container} from '@stool/di';
import {HttpClient} from 'some-http-client';


@Inject(HttpClient)
class Repository {
    constructor(http){
        //...
    }
    async getUsers(){
        //...
    }
}

@Inject(Repository)
class Users {
    constructor(repo){
        //...
    }
}

@Inject(Users)
class App {
    constructor(users){
        //...
    }
}

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
