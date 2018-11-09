"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("./random");
const types_1 = require("./types");
exports.noop = () => { }; // tslint:disable-line
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
    const t = types_1.getType(o);
    if (t === 'date') {
        return new Date(o.getTime());
    }
    if (t === 'array' || t === 'object') {
        if (o[MARKER]) {
            return m[o[MARKER]];
        }
        const clear = !m;
        m = m || {};
        const sid = random_1.sid();
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
exports.clone = (o) => cloneInner(o);
