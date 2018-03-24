import {Manager} from './manager';

var manager = new Manager();

export default manager.getLogger();
export function getLogger(name) {
    return manager.getLogger(name);
}
export {Filter, Filterer} from './filter';
export {Logger} from './logger';
export {Manager};
