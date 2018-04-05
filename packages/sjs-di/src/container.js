import { InstanceResolver, SingletonResolver } from './resolvers';
export class Container {
    constructor() {
        this._resolvers = new Map();
    }
    set(key, instance) {
        this._resolvers.set(key, new InstanceResolver(instance));
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
        return resolver.resolve(this, key);
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
    unregisterResolver(key) {
        this._resolvers.delete(key);
    }
    createInstance(fn) {
        const deps = getDependenciesInherit(fn);
        const args = [];
        for (let dep of deps) {
            args.push(this.get(dep));
        }
        return createType(fn, args);
    }
}
function createType(target, args) {
    if (Reflect && Reflect.construct) {
        return Reflect.construct(target, args);
    }
    switch (args.length) {
        case 0: return new target(args[0]);
        case 1: return new target(args[0], args[1]);
        case 2: return new target(args[0], args[1], args[2]);
        case 3: return new target(args[0], args[1], args[2], args[3]);
        case 4: return new target(args[0], args[1], args[2], args[3], args[4]);
    }
    return new (Function.bind.apply(target, [null].concat(args)))();
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
