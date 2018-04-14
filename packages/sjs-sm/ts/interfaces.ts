export type StateEvent = {action: string, payload: any};


export type IConfigTransition = {
    action: string,
    target: string
};

export type IConfig = {
    init?: string,
    transitions: Array<IConfigTransition>,
    events: {
        name: (event: any) => {}
    }
};

export type IStateEvent = {
    state: IState,
    action: string;
    payload: any
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

    getTarget(action: string): string|undefined;
    addTransition(action: string, target: string): void;
    removeTransition(action: string): void;

    enter(event: IStateEvent): void;
    exit(event: IStateEvent): void;
    change(event: IStateEvent): void;
}
