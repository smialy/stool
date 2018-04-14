import { IStateEvent, IStateListener, IStateListeners } from './interfaces';
export declare class StateListeners implements IStateListeners {
    protected _listeners: Set<IStateListener>;
    addListener(listener: IStateListener): void;
    removeListener(listener: IStateListener): void;
    resetListeners(): void;
    enter(event: IStateEvent): void;
    change(event: IStateEvent): void;
    exit(event: IStateEvent): void;
}
