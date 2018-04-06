/**
 * Detect object type
 *
 * @method sjs.type
 * @return {Mixed} [null,undefined,string,number,array,function,regexp,date,boolean,object]
 */
export declare function getType(o: any): string;
export declare const isNull: (o: any) => boolean;
export declare const isUndefined: (o: any) => boolean;
/**
 * @type {Function}
 * @return {Boolean}
 */
export declare const isArray: (arg: any) => arg is any[];
/**
 * @type {Function}
 * @return {Boolean}
 */
export declare const isRegExp: (o: any) => boolean;
/**
 * @type {Function}
 * @return {Boolean}
 */
export declare const isDate: (o: any) => boolean;
/**
 * @method sjs.isObject
 * @return {Boolean}
 */
export declare const isObject: (o: any) => boolean;
/**
 * @method sjs.isNumber
 * @return {Boolean}
 */
export declare const isNumber: (o: any) => boolean;
/**
 * @method sjs.isString
 * @return {Boolean}
 */
export declare const isString: (o: any) => boolean;
/**
 * @method sjs.isFunction
 * @return {Boolean}
 */
export declare const isFunction: (o: any) => boolean;
export declare const isGenerator: (o: any) => boolean;
export declare const isAsync: (o: any) => boolean;
export declare const isSymbol: (o: any) => boolean;
export declare const isSet: (o: any) => boolean;
export declare const isMap: (o: any) => boolean;
/**
 * @method sjs.isBoolean
 * @return {Boolean}
 */
export declare const isBoolean: (o: any) => boolean;
/**
 * @method sjs.isElement
 * @return {Boolean}
 */
export declare const isElement: (o: any) => boolean;
/**
 * @method sjs.isTextnode
 * @return {Boolean}
 */
export declare const isTextnode: (o: any) => boolean;
/**
 * @method sjs.isWhitespace
 * @return {Boolean}
 */
export declare const isWhitespace: (o: any) => boolean;
/**
 * @method sjs.isCollection
 * @return {Boolean}
 */
export declare const isCollection: (o: any) => boolean;
