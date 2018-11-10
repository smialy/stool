import { Container } from './container';

export interface IResolver {
    resolve(container: Container, key: any): any;
}

export class InstanceResolver implements IResolver {

    private instance: any;

    constructor(instance: any) {
        this.instance = instance;
    }

    public resolve(): any {
        return this.instance;
    }
}

export class SingletonResolver implements IResolver {
    private fn: () => void;
    private instance: any;
    constructor(fn: () => void) {
        this.fn = fn;
        this.instance = null;
    }

    public resolve(container: Container): any {
        if (!this.instance) {
            this.instance = container.createInstance(this.fn);
        }
        return this.instance;
    }
}
