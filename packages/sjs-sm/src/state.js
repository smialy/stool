import { StateListeners } from './listeners';
export default class State extends StateListeners {
    constructor(name) {
        super();
        this._transitions = new Map();
        this.name = name;
    }
    getTarget(action) {
        if (this._transitions.has(action)) {
            return this._transitions.get(action);
        }
        throw new TypeError(`State ${this.name} doesn't have transitions for action: ${action}`);
    }
    addTransition(action, target) {
        this._transitions.set(action, target);
    }
    removeTransition(action) {
        this._transitions.delete(action);
    }
}
