// import CRITERIAS from './criterias';


export class Filter{

    public opt: string;
    public value: any;
    public name: string;

    /**
     * @constructor
     * @param {string} opt
     * @param {mix} value
     * @param {string} name
     */
    constructor(opt:string, value:any=null, name:string='') {
        this.opt = opt;
        this.value = value;
        this.name = name;
    }
    /**
     * Try find filter and check it
     *
     * @param {mix} param
     * @return {Boolean}
     */
    match(params: any) {
        return this[this.opt](params);
    }
    /**
     * Filter items
     *
     * @param {Array} list
     * @return {Array}
     */
    filter(list: Array<any>): Array<any> {
        return list.filter(params => this.match(params));
    }
    tostring(): string {
        return '[Filter opt=' + this.opt + ' name=' + this.name + ' value=' + this.value + ']';
    }
    eq(params) {
        if (this.name in params) {
            if (Array.isArray(params[this.name])) {
                return params[this.name].indexOf(this.value) !== -1;
            }
            return params[this.name] === this.value;
        }
        return false;
    }
    lte(params) {
        return this.name in params ? params[this.name] <= this.value : false;
    }
    gte(params) {
        return this.name in params ? params[this.name] >= this.value : false;
    }
    approx(params) {
        if (this.name in params) {
            if (Array.isArray(params[this.name])) {
                return params[this.name].some(item => item.indexOf(this.value) !== -1);
            }
            return params[this.name].indexOf(this.value) !== -1;
        }
        return false;
    }
    present(params) {
        return this.name in params;
    }
    substring(params) {
        if (this.name in params) {
            if (Array.isArray(params[this.name])) {
                return params[this.name].some(item => this.value.test(item));
            }
            return this.value.test(params[this.name]);
        }
        return false;
    }
    or(params) {
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].match(params)) {
                return true;
            }
        }
        return false;
    }
    and(params) {
        for (let i = 0; i < this.value.length; i++) {
            if (!this.value[i].match(params)) {
                return false;
            }
        }
        return true;
    }
    not(params) {
        for (let i = 0; i < this.value.length; i++) {
            if (!this.value[i].match(params)) {
                return true;
            }
        }
        return false;
    }
    all(/* params */) {
        return true;
    }
    none(/* params */){
        return false;
    }
}
