import { IResolver } from './resolvers';
export declare class Container {
    private _resolvers;
    constructor();
    set(key: any, instance: any): void;
    get(key: any): any;
    registerInstance(key: any, instance: any): IResolver;
    registerSingleton(key: any, fn: Function): IResolver;
    registerResolver(key: any, resolver: IResolver): IResolver;
    unregisterResolver(key: any): void;
    createInstance(fn: any): any;
}
