import { sid as randomSid } from './random';
import { getType } from './types';
export const noop = () => { }; // tslint:disable-line
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
    for (const fn of args) {
        try {
            return fn();
        }
        catch (e) {
            // noop
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
const MARKER = Symbol('~~clone-marker~~');
function cloneInner(o, m = null) {
    if (!o) {
        return o;
    }
    const t = getType(o);
    if (t === 'date') {
        return new Date(o.getTime());
    }
    if (t === 'array' || t === 'object') {
        if (o[MARKER]) {
            return m[o[MARKER]];
        }
        const clear = !m;
        m = m || {};
        const sid = randomSid();
        o[MARKER] = sid;
        m[sid] = o;
        let _;
        switch (t) {
            case 'array':
                _ = [];
                for (let i = 0, l = o.length; i < l; ++i) {
                    _.push(cloneInner(o[i], m));
                }
                break;
            case 'object':
                _ = {};
                for (const key of Object.keys(o)) {
                    _[key] = cloneInner(o[key], m);
                }
                break;
        }
        if (clear) {
            for (const key of Object.keys(m)) {
                if (m[key][MARKER]) {
                    m[key][MARKER] = null;
                    delete m[key][MARKER];
                }
            }
        }
        return _;
    }
    return t === 'date' ? new Date(o.getTime()) : o;
}
export const clone = (o) => cloneInner(o);
