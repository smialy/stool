import StateMachine from '../src/machine';
import State from '../src/state';
import { Actions, States } from './data';


QUnit.module('sjs-sm::State');

QUnit.test('create empty state', assert => {
    let state = new State(States.CLOSED);
    assert.equal(state.name, States.CLOSED);
});

QUnit.test('add transitions', assert => {
    let state = new State(States.CLOSED);
    state.addTransition(Actions.OPEN, States.OPENED);
    let target = state.getTarget(Actions.OPEN);
    assert.equal(target, States.OPENED);
});

QUnit.test('remove transitions', assert => {
    let state = new State(States.CLOSED);
    state.addTransition(Actions.OPEN, States.OPENED);
    state.removeTransition(Actions.OPEN);
    assert.throws(() => state.getTarget(Actions.OPEN));
});


QUnit.module('StateMachine');

QUnit.test('add the same state', assert => {
    let door = new StateMachine();
    let state = new State(States.CLOSED);

    door.addState(state);
    assert.throws(() => door.addState(state));

    state = new State(States.CLOSED);
    assert.throws(() => door.addState(state));
});

QUnit.test('remove state', assert => {
    let door = new StateMachine();
    let state = new State(States.CLOSED);
    door.addState(state);

    assert.throws(() => {
        door.addState(new State(States.CLOSED));
    });

    door.removeState(States.CLOSED);
    door.addState(state);
    assert.ok(true);
});

QUnit.test('start', assert => {
    let door = new StateMachine();

    let opened = new State(States.OPENED);
    door.addState(opened);

    let closed = new State(States.CLOSED);
    door.addState(closed);


    door.start(States.CLOSED);
    assert.equal(door.currentState().name, States.CLOSED);
});

QUnit.test('incorrect action', assert => {
    let door = new StateMachine();

    let opened = new State(States.OPENED);
    door.addState(opened);

    let closed = new State(States.CLOSED);
    door.addState(closed);
    door.start(States.CLOSED);

    assert.throws(() => door.goto(Actions.OPEN));
});

QUnit.test('flow door actions', assert => {
    let door = new StateMachine();
    let listener = new StateListener();
    let closeListener = new StateListener();
    let openListener = new StateListener();

    let opened = new State(States.OPENED);
    opened.addTransition(Actions.CLOSE, States.CLOSED);
    door.addState(opened);

    let closed = new State(States.CLOSED);
    closed.addTransition(Actions.OPEN, States.OPENED);
    door.addState(closed);

    door.start(States.CLOSED); // initial are closed


    assert.throws(() => door.goto(Actions.CLOSE)); // is imposible to second close

    assert.equal(openListener.size(), 0);
    assert.equal(closeListener.size(), 0);

    // global listener
    door.addListener(listener);
    // state listener
    opened.addListener(openListener);
    closed.addListener(closeListener);

    assert.equal(door.currentState().name, States.CLOSED);
    assert.equal(listener.size(), 0);
    assert.equal(openListener.size(), 0);
    assert.equal(closeListener.size(), 0);

    door.goto(Actions.OPEN); // try open it
    assert.equal(door.currentState().name, States.OPENED);

    assert.equal(listener.size(), 3);

    let event = listener.events[0];
    assert.equal(event.name, 'onExit');
    assert.equal(event.event.state.name, States.CLOSED);
    assert.equal(event.event.action, Actions.OPEN);
    assert.equal(event.event.payload, null);

    event = listener.events[1];
    assert.equal(event.name, 'onEnter');
    assert.equal(event.event.state.name, States.OPENED);
    assert.equal(event.event.action, Actions.OPEN);
    assert.equal(event.event.payload, null);

    event = listener.events[2];
    assert.equal(event.name, 'onChange');
    assert.equal(event.event.state.name, States.OPENED);
    assert.equal(event.event.action, Actions.OPEN);
    assert.equal(event.event.payload, null);

    assert.equal(closeListener.size(), 1);

    event = closeListener.events[0];
    assert.equal(event.name, 'onExit');
    assert.equal(event.event.action, Actions.OPEN);
    assert.equal(event.event.payload, null);

    assert.equal(openListener.size(), 2);

    event = openListener.events[0];
    assert.equal(event.name, 'onEnter');
    assert.equal(event.event.action, Actions.OPEN);
    assert.equal(event.event.payload, null);

    event = openListener.events[1];
    assert.equal(event.name, 'onChange');
    assert.equal(event.event.action, Actions.OPEN);
    assert.equal(event.event.payload, null);

    door.goto(Actions.CLOSE); // try close door
    assert.equal(listener.size(), 6);

    event = listener.events[3];
    assert.equal(event.name, 'onExit');
    assert.equal(event.event.state.name, States.OPENED);
    assert.equal(event.event.action, Actions.CLOSE);
    assert.equal(event.event.payload, null);

    event = listener.events[4];
    assert.equal(event.name, 'onEnter');
    assert.equal(event.event.state.name, States.CLOSED);
    assert.equal(event.event.action, Actions.CLOSE);
    assert.equal(event.event.payload, null);

    event = listener.events[5];
    assert.equal(event.name, 'onChange');
    assert.equal(event.event.state.name, States.CLOSED);
    assert.equal(event.event.action, Actions.CLOSE);
    assert.equal(event.event.payload, null);

    assert.equal(openListener.size(), 3);

    event = openListener.events[2];
    assert.equal(event.name, 'onExit');
    assert.equal(event.event.action, Actions.CLOSE);
    assert.equal(event.event.payload, null);

    assert.equal(closeListener.size(), 3);

    event = closeListener.events[1];
    assert.equal(event.name, 'onEnter');
    assert.equal(event.event.action, Actions.CLOSE);
    assert.equal(event.event.payload, null);

    event = closeListener.events[2];
    assert.equal(event.name, 'onChange');
    assert.equal(event.event.action, Actions.CLOSE);
    assert.equal(event.event.payload, null);

    assert.equal(door.currentState().name, States.CLOSED);
});

class StateListener {

    constructor(){
        this.events = [];
    }
    onEnter(event){
        this.events.push({name: 'onEnter', event});
    }
    onExit(event){
        this.events.push({name: 'onExit', event});
    }
    onChange(event){
        this.events.push({name: 'onChange', event});
    }
    size(){
        return this.events.length;
    }
}
