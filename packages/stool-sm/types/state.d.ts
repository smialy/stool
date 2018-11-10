import { IState, IStateListeners } from './interfaces';
import { StateListeners } from './listeners';
export default class State extends StateListeners implements IState, IStateListeners {
    readonly name: string;
    private _transitions;
    constructor(name: string);
    getTarget(action: string): string | undefined;
    addTransition(action: string, target: string): void;
    removeTransition(action: string): void;
}
