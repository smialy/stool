# State Machine

## Getting Started

### 1. Install:

```sh
$ npm install sjs-sm
```

### 2 Using

```js
import {StateMachine, State} from 'sjs-sm';

const States = {
    CLOSED: 'CLOSED',
    OPENED: 'OPENED',
    LOCKED: 'LOCKED'
};

const Actions = {
    CLOSE: 'CLOSE',
    OPEN: 'OPEN',
    LOCK: 'LOCK',
    UNLOCK: 'UNLOCK'
};

let door = new StateMachine();

let opened = new State(States.OPENED);
opened.addTransition(Actions.CLOSE, States.CLOSED);
door.addState(opened);

let closed = new State(States.CLOSED);
closed.addTransition(Actions.OPEN, States.OPENED);
door.addState(closed);

door.start(States.CLOSED); // initial are closed

door.goto(Actions.LOCK) // raise error

door.goto(Actions.OPEN); // try open it
assert(door.currentState().name === States.OPENED);
```

## License
MIT
