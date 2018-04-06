import {getType} from './types';
import {sid} from './random';


export const noop = () => {};


/*
 * Pick first value without error
 *
 * @example
 *      tr(function(){
 *          throw 1;
 *      }, function(){
 *          return 2
 *      });
 *
 * @method tr
 * @return {Object}
 */
export function tr(...args: any[]) {
    for (let fn of args) {
        try {
            return fn();
        } catch (e) {
            //noop
        }
    }
    return null;
}



/**
 * Clone object
 *
 * @example
 *      > let t1 = [1,2,3];
 *      > let t2 = t1;
 *      > t1 === t2
 *      true
 *
 *      > t2 = clone(t1);
 *      > t1 === t2
 *      false
 *
 * @type {Function}
 * @param {Object} obj
 * @return {Object}
 */
export const clone = (function() {
    const MARKER = '~~clone~~marker~~';
    function _clone(o: any, m: any=null): any {

        if (!o) {
            return o;
        }
        let t = getType(o);
        if (t === 'date') {
            return new Date(o.getTime());
        }

        if (t === 'array' || t === 'object') {
            if (o[MARKER]) {
                return m[o[MARKER]];
            }
            let clear = !m;
            m = m || {};
            let _sid = sid();
            o[MARKER] = _sid;
            m[_sid] = o;
            let _: any;
            switch (t) {
                case 'array':
                    _ = [];
                    for (let i = 0, l = o.length; i < l; ++i) {
                        _.push(_clone(o[i], m));
                    }
                    break;
                case 'object':
                    _ = {};
                    for (let key of Object.keys(o)) {
                        if (key !== MARKER) {
                            _[key] = _clone(o[key], m);
                        }
                    }
                    break;
            }

            if (clear) {
                for (let key of Object.keys(m)) {
                    if (m[key][MARKER]) {
                        m[key][MARKER] = null;
                        delete m[key][MARKER];
                    }
                }
            }
            return _;
        }
        return t === 'date' ? new Date(o.getTime()) : o;
    };
    return function clone(o: any) {
        return _clone(o);
    };
})();
