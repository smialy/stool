# sjs-events

## Getting Started

#### Install:

```sh
$ npm install sjs-events
```

#### Using Listeners

```js
import { Events } from 'sjs-events';

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
