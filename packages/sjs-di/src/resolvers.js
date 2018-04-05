export class InstanceResolver {
    constructor(instance) {
        this.instance = instance;
    }
    resolve() {
        return this.instance;
    }
}
export class SingletonResolver {
    constructor(fn) {
        this.fn = fn;
        this.instance = null;
    }
    resolve(container) {
        if (!this.instance) {
            this.instance = container.createInstance(this.fn);
        }
        return this.instance;
    }
}
