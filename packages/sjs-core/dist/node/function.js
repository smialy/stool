"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const random_1 = require("./random");
exports.noop = () => { };
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
function tr(...args) {
    for (let fn of args) {
        try {
            return fn();
        }
        catch (e) {
            //noop
        }
    }
    return null;
}
exports.tr = tr;
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
    let t = types_1.getType(o);
    if (t === 'date') {
        return new Date(o.getTime());
    }
    if (t === 'array' || t === 'object') {
        if (o[MARKER]) {
            return m[o[MARKER]];
        }
        let clear = !m;
        m = m || {};
        let _sid = random_1.sid();
        o[MARKER] = _sid;
        m[_sid] = o;
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
                for (let key of Object.keys(o)) {
                    _[key] = cloneInner(o[key], m);
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
}
exports.clone = (o) => cloneInner(o);
