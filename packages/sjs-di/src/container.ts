import { Inject } from './decorators';
import { InstanceResolver, IResolver, SingletonResolver } from './resolvers';

export class Container {

    private _resolvers: Map<any, IResolver>;

    constructor() {
        this._resolvers = new Map();
    }

    public set(key: any, instance: any): void {
        this._resolvers.set(key, new InstanceResolver(instance));
    }

    public get(key: any): any {
        let resolver = this._resolvers.get(key);
        if (resolver === undefined) {
            if (typeof key === 'function') {
                resolver = this.registerSingleton(key, key);
            } else {
                resolver = this.registerInstance(key, key);
            }
        }
        return resolver.resolve(this, key);
    }

    public registerInstance(key: any, instance: any): IResolver {
        return this.registerResolver(key, new InstanceResolver(instance));
    }

    public registerSingleton(key: any, fn: () => void): IResolver {
        return this.registerResolver(key, new SingletonResolver(fn));
    }

    public registerResolver(key: any, resolver: IResolver): IResolver {
        validateKey(key);
        if (this._resolvers.has(key)) {
            throw TypeError(`Resolver for key: ${key} was already registered.`);
        }
        this._resolvers.set(key, resolver);
        return resolver;
    }

    public unregisterResolver(key: any): void {
        this._resolvers.delete(key);
    }

    public createInstance(fn: any) {
        const deps = getDependenciesInherit(fn);
        const args: any[] = [];
        for (const dep of deps) {
            args.push(this.get(dep)); /* ts:disable-line */
        }
        return createType(fn, args);
    }
}

function createType(target: any, args: any[]): any {
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

function validateKey(key: any) {
    if (key === null || key === undefined) {
        throw new TypeError('Key cannot be null or undefined');
    }
}

interface InjectFunction {
    inject: () => any[];
}

function getDependenciesInherit(fn: InjectFunction): any[] {
    const dependencies: any[] = [];
    while (typeof fn === 'function') {
        const items = getDependencies(fn);
        dependencies.push(...items);
        fn = Object.getPrototypeOf(fn);
    }
    return dependencies;
}

function getDependencies(fn: InjectFunction): any[] {
    if (!fn.hasOwnProperty('inject')) {
        return [];
    }
    if (typeof fn.inject === 'function') {
        return fn.inject();
    }
    return fn.inject;
}
