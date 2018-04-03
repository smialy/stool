export class InstanceResolver {
    constructor(instance) {
        this.instance = instance;
    }
    get(container, key) {
        return this.instance;
    }
}
export class SingletonResolver {
    constructor(fn) {
        this.fn = fn;
        this.instance = null;
    }
    get(container, key) {
        if (!this.instance) {
            this.instance = container.createInstance(this.fn);
        }
        return this.instance;
    }
}
