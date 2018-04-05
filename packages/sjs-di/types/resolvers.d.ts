import { Container } from './container';
export interface IResolver {
    resolve(container: Container, key: any): any;
}
export declare class InstanceResolver implements IResolver {
    private instance;
    constructor(instance: any);
    resolve(): any;
}
export declare class SingletonResolver implements IResolver {
    private fn;
    private instance;
    constructor(fn: Function);
    resolve(container: Container): any;
}
