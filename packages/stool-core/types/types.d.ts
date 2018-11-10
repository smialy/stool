/**
 * Detect object type
 *
 * @return {string} [null,undefined,string,number,array,function,regexp,date,boolean,object]
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
 * @method stool.isObject
 * @return {Boolean}
 */
export declare const isObject: (o: any) => boolean;
/**
 * @method stool.isNumber
 * @return {Boolean}
 */
export declare const isNumber: (o: any) => boolean;
/**
 * @method stool.isString
 * @return {Boolean}
 */
export declare const isString: (o: any) => boolean;
/**
 * @method stool.isFunction
 * @return {Boolean}
 */
export declare const isFunction: (o: any) => boolean;
export declare const isGenerator: (o: any) => boolean;
export declare const isAsync: (o: any) => boolean;
export declare const isSymbol: (o: any) => boolean;
export declare const isSet: (o: any) => boolean;
export declare const isMap: (o: any) => boolean;
/**
 * @method stool.isBoolean
 * @return {Boolean}
 */
export declare const isBoolean: (o: any) => boolean;
/**
 * @method stool.isElement
 * @return {Boolean}
 */
export declare const isElement: (o: any) => boolean;
/**
 * @method stool.isTextnode
 * @return {Boolean}
 */
export declare const isTextnode: (o: any) => boolean;
/**
 * @method stool.isWhitespace
 * @return {Boolean}
 */
export declare const isWhitespace: (o: any) => boolean;
/**
 * @method stool.isCollection
 * @return {Boolean}
 */
export declare const isCollection: (o: any) => boolean;
