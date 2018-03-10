import { Container } from './cointainer';
export interface IResolver {
    get(container: Container, key: any): any;
}
export declare class InstanceResolver implements IResolver {
    private instance;
    constructor(instance: any);
    get(container: Container, key: any): any;
}
export declare class SingletonResolver implements IResolver {
    private fn;
    private instance;
    constructor(fn: Function);
    get(container: Container, key: any): any;
}
