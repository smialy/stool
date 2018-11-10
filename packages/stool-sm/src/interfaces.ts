export interface IStateEvent {
    action: string;
    payload: any;
}

export interface IConfigTransition {
    action: string;
    target: string;
}

export interface IConfig {
    init?: string;
    transitions: IConfigTransition[];
    events: {
        name: (event: any) => {},
    };
}

export interface IStateEvent {
    state: IState;
    action: string;
    payload: any;
}

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
