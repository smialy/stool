import { Container } from './container';


export interface IResolver {
    get(container: Container, key: any): any;
}


export class InstanceResolver implements IResolver{

    private instance: any;

    constructor(instance: any){
        this.instance = instance
    }

    get(){
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

    get(container: Container){
        if(!this.instance){
            this.instance = container.createInstance(this.fn);
        }
        return this.instance;
    }
}
