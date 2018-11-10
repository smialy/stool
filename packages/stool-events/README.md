# @stool/events

## Getting Started

#### Install:

```sh
$ npm install @stool/events
```

#### Using Listeners

```js
import { Events } from '@stool/events';

class Client extends Events {
    //...
}

var client = new Client();
client.once('connect', (connection) => {
    //...
});
//...

client.on('message', (msg) => {

});
//...

client.offs('message') //remove all listeners
```

## License
MIT
