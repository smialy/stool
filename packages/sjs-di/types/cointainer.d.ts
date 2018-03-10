import { IResolver } from './resolvers';
export declare class Container {
    private _resolvers;
    constructor();
    registerInstance(key: any, instance: any): IResolver;
    registerSingleton(key: any, fn: Function): IResolver;
    registerResolver(key: any, resolver: IResolver): IResolver;
    unregister(key: any): void;
    get(key: any): any;
    createInstance(fn: any): any;
}
