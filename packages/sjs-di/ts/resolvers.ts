import { Container } from './container';


export interface IResolver {
    resolve(container: Container, key: any): any;
}


export class InstanceResolver implements IResolver{

    private instance: any;

    constructor(instance: any){
        this.instance = instance
    }

    resolve(){
        return this.instance;
    }
}

export class SingletonResolver implements IResolver{
    private fn: Function;
    private instance: any;
    constructor(fn: Function){
        this.fn = fn
        this.instance = null;
    }

    resolve(container: Container){
        if(!this.instance){
            this.instance = container.createInstance(this.fn);
        }
        return this.instance;
    }
}
