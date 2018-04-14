export declare type StateEvent = {
    action: string;
    payload: any;
};
export declare type IConfigTransition = {
    action: string;
    target: string;
};
export declare type IConfig = {
    init?: string;
    transitions: Array<IConfigTransition>;
    events: {
        name: (event: any) => {};
    };
};
export declare type IStateEvent = {
    state: IState;
    action: string;
    payload: any;
};
export interface IStateListener {
    onEnter(event: IStateEvent): void;
    onExit(event: IStateEvent): void;
    onChange(event: IStateEvent): void;
}
export interface IStateListeners {
    addListener(listener: IStateListener): void;
    removeListener(listener: IStateListener): void;
    resetListeners(): void;
}
export interface IState extends IStateListeners {
    name: string;
    getTarget(action: string): string | undefined;
    addTransition(action: string, target: string): void;
    removeTransition(action: string): void;
    enter(event: IStateEvent): void;
    exit(event: IStateEvent): void;
    change(event: IStateEvent): void;
}
