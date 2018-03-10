import { InstanceResolver, SingletonResolver, IResolver } from './resolvers';


export class Container {

    private _resolvers: Map<any, any>;

    constructor() {
        this._resolvers = new Map();
    }

    registerInstance(key: any, instance: any): IResolver {
        return this.registerResolver(key, new InstanceResolver(instance));
    }

    registerSingleton(key: any, fn: Function): IResolver {
        return this.registerResolver(key, new SingletonResolver(fn));
    }

    registerResolver(key: any, resolver: IResolver): IResolver {
        validateKey(key);
        if (this._resolvers.has(key)) {
            throw TypeError(`Resolver for key: ${key} was already registered.`);
        }
        this._resolvers.set(key, resolver);
        return resolver;
    }

    unregister(key: any): void {
        this._resolvers.delete(key);
    }

    get(key: any) {
        let resolver = this._resolvers.get(key);
        if (resolver === undefined) {
            if (typeof key === 'function') {
                resolver = this.registerSingleton(key, key);
            } else {
                resolver = this.registerInstance(key, key);
            }
        }
        return resolver.get(this, key);
    }

    createInstance(fn: any) {
        const deps = getDependenciesInherit(fn);
        const args = [];
        for (let dep of deps) {
            args.push(this.get(dep));
        }
        return Reflect.construct(fn, args);
    }
}

function createType(fn: Function, ...args: any[]): any {
    let obj = Object.create(fn.prototype);
    fn.apply(obj, args);
    return obj;
}

function validateKey(key: any) {
    if (key === null || key === undefined) {
        throw new TypeError('Key cannot be null or undefined');
    }
}

function getDependenciesInherit(fn: Function){
    const dependencies = []
    while(typeof fn === 'function'){
        dependencies.push(...getDependencies(fn));
        fn = Object.getPrototypeOf(fn);
    }
    return dependencies;
}

function getDependencies(fn: Function) {
    if (!fn.hasOwnProperty('inject')) {
        return [];
    }
    if (typeof fn.inject === 'function') {
        return fn.inject();
    }
    return fn.inject;
}
