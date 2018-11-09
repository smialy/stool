import { IState, IStateListeners } from './interfaces';
import { StateListeners } from './listeners';

export default class State extends StateListeners implements IState, IStateListeners {

    public readonly name: string;
    private _transitions: Map<string, string> = new Map<string, string>();
    constructor(name: string) {
        super();
        this.name = name;
    }
    public getTarget(action: string): string|undefined {
        if (this._transitions.has(action)) {
            return this._transitions.get(action);
        }
        throw new TypeError(`State ${this.name} doesn't have transitions for action: ${action}`);
    }
    public addTransition(action: string, target: string) {
        this._transitions.set(action, target);
    }
    public removeTransition(action: string) {
        this._transitions.delete(action);
    }
}
