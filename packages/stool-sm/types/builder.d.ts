import { IState } from './interfaces';
import StateMachine from './machine';
export declare function factory(config: any): StateMachine;
export declare function createMachine(): StateMachine;
export declare function createState(config: any): IState;
