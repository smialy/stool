import State from './state';
import { StateListeners } from './listeners';
const noop = () => { };
const prepareStateListener = (listener) => ({
    onEnter: listener.onEnter || noop,
    onExit: listener.onExit || noop,
    onChange: listener.onChange || noop
});
export class StateEvent {
    constructor(state, action, payload) {
        this.state = state;
        this.action = action;
        this.payload = payload;
    }
}
export default class StateMachine {
    constructor() {
        this._states = new Map();
        this._currentState = null;
        this._previousState = null;
        this._history = [];
        this._stateQueue = [];
        this._pending = false;
        this._listeners = new StateListeners();
    }
    static build(config) {
        const sm = new StateMachine();
        for (const item of config.transition) {
            let state = new State(item.name);
            for (let transition of item.transitions) {
                state.addTransition(transition.action, transition.target);
            }
            if (item.listeners) {
                state.addListener(prepareStateListener(item.listeners));
            }
            sm.addState(state);
        }
        return sm;
    }
    start(stateName, payload = null) {
        const state = this._states.get(stateName);
        if (state) {
            return this._transition(state, '', payload);
        }
        throw new TypeError(`Not found state: ${stateName}`);
    }
    goto(action, payload = null) {
        this._stateQueue.push({ action, payload });
        this._next();
    }
    addState(state) {
        if (this._states.has(state.name)) {
            throw new TypeError(`State: ${state.name} already exists`);
        }
        this._states.set(state.name, state);
    }
    getState(name) {
        if (!this._states.has(name)) {
            throw new TypeError(`State: ${name} doesn't exists`);
        }
        return this._states.get(name);
    }
    removeState(name) {
        return this._states.delete(name);
    }
    currentState() {
        return this._currentState;
    }
    addListener(listener) {
        this._listeners.addListener(listener);
    }
    removeListener(listener) {
        this._listeners.removeListener(listener);
    }
    resetListeners() {
        this._listeners.resetListeners();
    }
    _transition(nextState, action, payload = null) {
        // console.log('_transition', nextState, action, payload);
        this._beginTransition();
        if (this._currentState) {
            const prevEvent = new StateEvent(this._currentState, action, payload);
            this._currentState.exit(prevEvent);
            this._listeners.exit(prevEvent);
        }
        const event = new StateEvent(nextState, action, payload);
        nextState.enter(event);
        this._listeners.enter(event);
        if (this._currentState) {
            this._history.push(this._currentState.name);
        }
        this._currentState = nextState;
        this._currentState.change(event);
        this._listeners.change(event);
        this._endTransition();
        this._next();
    }
    _beginTransition() {
        this._pending = true;
    }
    _endTransition() {
        this._pending = false;
    }
    isPending() {
        return this._pending;
    }
    _next() {
        if (this.isPending()) {
            return;
        }
        const state = this._stateQueue.shift();
        if (state) {
            let { action, payload } = state;
            if (this._currentState) {
                const target = this._currentState.getTarget(action);
                if (target) {
                    const state = this._states.get(target);
                    if (state) {
                        return this._transition(state, action, payload);
                    }
                }
            }
            this._next();
        }
    }
}
