export class InstanceResolver {
    constructor(instance) {
        this.instance = instance;
    }
    get() {
        return this.instance;
    }
}
export class SingletonResolver {
    constructor(fn) {
        this.fn = fn;
        this.instance = null;
    }
    get(container) {
        if (!this.instance) {
            this.instance = container.createInstance(this.fn);
        }
        return this.instance;
    }
}
