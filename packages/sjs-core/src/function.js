import {getType} from './types';
import {sid} from './random';


export const dummy = () => {};


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
export function tr(...args) {
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
 *              > let t1 = [1,2,3];
 *              > let t2 = t1;
 *              > t1 === t2
 *              true
 *
 *              > t2 = clone(t1);
 *              > t1 === t2
 *              false
 *
 * @type {Function}
 * @param {Object} obj
 * @return {Object}
 */
export let clone = (function() {
    let MARKER = '~~clone~~marker~~';

    let _clone = function(o, m) {

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
            let _, i, l;
            switch (t) {
                case 'array':
                    _ = [];
                    for (i = 0, l = o.length; i < l; ++i) {
                        _.push(_clone(o[i], m));
                    }
                    break;
                case 'object':
                    _ = {};
                    for (i in o) {
                        if (i !== MARKER) {
                            _[i] = _clone(o[i], m);
                        }
                    }
                    break;
            }

            if (clear) {
                for (_sid in m) {
                    if (m[_sid][MARKER]) {
                        m[_sid][MARKER] = null;
                        delete m[_sid][MARKER];
                    }
                }
            }
            return _;
        }
        return t === 'date' ? new Date(o.getTime()) : o;
    };
    return function clone(o) {
        return _clone(o);
    };
})();
