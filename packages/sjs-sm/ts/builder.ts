import { IStateListener, IState } from './interfaces';
import StateMachine from './machine';
import State from './state';


export function factory(config: any) {
    const sm = createMachine();
    for(const data of config.states) {
        sm.addState(createState(data))
    }
    if(config.init){
        sm.start(config.init);
    }
    return sm;
}

export function createMachine(){
    return new StateMachine();
}

export function createState(config: any): IState {
    let state = new State(config.name);
    for(let transition of config.transitions) {
        state.addTransition(transition.action, transition.target);
    }
    if(config.listeners){
        state.addListener(prepareStateListener(config.listeners));
    }
    return state;
}

function prepareStateListener(listener: any): IStateListener {
    const noop = () => {};
    return {
        onEnter: listener.onEnter || noop,
        onExit: listener.onExit || noop,
        onChange: listener.onChange || noop
    };
}
