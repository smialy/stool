import { InstanceResolver, SingletonResolver } from './resolvers';
export class Container {
    constructor() {
        this._resolvers = new Map();
    }
    registerInstance(key, instance) {
        return this.registerResolver(key, new InstanceResolver(instance));
    }
    registerSingleton(key, fn) {
        return this.registerResolver(key, new SingletonResolver(fn));
    }
    registerResolver(key, resolver) {
        validateKey(key);
        if (this._resolvers.has(key)) {
            throw TypeError(`Resolver for key: ${key} was already registered.`);
        }
        this._resolvers.set(key, resolver);
        return resolver;
    }
    unregister(key) {
        this._resolvers.delete(key);
    }
    get(key) {
        let resolver = this._resolvers.get(key);
        if (resolver === undefined) {
            if (typeof key === 'function') {
                resolver = this.registerSingleton(key, key);
            }
            else {
                resolver = this.registerInstance(key, key);
            }
        }
        return resolver.get(this, key);
    }
    createInstance(fn) {
        const deps = getDependenciesInherit(fn);
        const args = [];
        for (let dep of deps) {
            args.push(this.get(dep));
        }
        return Reflect.construct(fn, args);
    }
}
function validateKey(key) {
    if (key === null || key === undefined) {
        throw new TypeError('Key cannot be null or undefined');
    }
}
function getDependenciesInherit(fn) {
    const dependencies = [];
    while (typeof fn === 'function') {
        dependencies.push(...getDependencies(fn));
        fn = Object.getPrototypeOf(fn);
    }
    return dependencies;
}
function getDependencies(fn) {
    if (!fn.hasOwnProperty('inject')) {
        return [];
    }
    if (typeof fn.inject === 'function') {
        return fn.inject();
    }
    return fn.inject;
}
