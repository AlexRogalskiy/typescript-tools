import { Numbers } from './numbers'
import { Checkers } from './checkers'
import { Errors } from './errors'
import { Utils } from './utils'

export namespace Objects {
    import Commons = Utils.Commons;
    import isFunction = Checkers.isFunction;

    export const init = (() => {
        /**
         * Freezes an object, makes the object effectively immutable.
         */
        if (!isFunction(Object.freeze)) {
            Object.freeze = o => o
        }

        /**
         * Defines a new property directly on an object, or modifies an existing property on an object, and returns the object
         */
        if (!isFunction(Object.defineProperty)) {
            Object.defineProperty = (obj: any, prop: PropertyKey, attr: PropertyDescriptor): any => {
                obj[prop] = attr.get ? attr.get.apply(obj) : attr.value
            }
        }

        /**
         * Creates new object returns the instance
         */
        if (!isFunction(Object.create)) {
            Object.create = function (o) {
                function F(): void {
                    // empty
                }

                F.prototype = o
                return new F()
            }
        }
    })()

    export const randomEnum = <T>(enumType: T): T[keyof T] => {
        const values = (Object.values(enumType) as unknown) as T[keyof T][]
        const index = Numbers.random(values.length)

        return values[index]
    }

    export const pluckBy = <T, K extends keyof T>(obj: T, propertyNames: K[]): T[K][] => {
        return propertyNames.map(n => obj[n])
    }

    export const updateBy = <T>(obj: T, fieldsToUpdate: Partial<T>): T => {
        return { ...obj, ...fieldsToUpdate }
    }

    export const omitNull = <T>(obj: T): T => {
        for (const key of Object.keys(obj).keys()) {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key]
            }
        }

        return obj
    }

    export const merge = <A, B>(a: A, b: B): A & B => {
        return Object.assign({}, a, b)
    }

    export const shallowEquals = (a: any, b: any): boolean => {
        if (Object.is(a, b)) {
            return true
        }

        if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
            return false
        }

        const keysA = Object.keys(a)
        const keysB = Object.keys(b)

        if (keysA.length !== keysB.length) {
            return false
        }

        for (const key of keysA) {
            if (!b.hasOwnProperty(key) || !Object.is(a[key], b[key])) {
                return false
            }
        }

        return true
    }

    export const randWeightedObject = (nums: any): number[] => {
        if (!Checkers.isObject(nums)) {
            throw Errors.typeError(`incorrect input argument: {numbers} is not object < ${nums} >`)
        }

        let total = 0
        const dist = {}
        for (const index of nums) {
            if (nums.hasOwnProperty(index)) {
                total += nums[index]
                dist[index] = total
            }
        }

        const rand = Numbers.randInt(0, total)
        const result: number[] = []
        for (const index in dist) {
            if (dist.hasOwnProperty(index)) {
                if (rand < dist[index]) {
                    result.push(Number(index))
                }
            }
        }

        return result
    }

    export const classof = (obj: any): string => {
        if (obj === null) {
            return 'Null'
        }

        if (obj === undefined) {
            return 'Undefined'
        }

        return Object.prototype.toString.call(obj).slice(8, -1)
    }

    export const hasPrototypeProperty = (obj: any, name: string): boolean => {
        return !obj.hasOwnProperty(name) && name in obj
    }

    export const inheritPrototype = (subType: any, superType: any): void => {
        const prototype = new Object(superType.prototype)
        prototype.constructor = subType
        subType.prototype = prototype
    }

    export const getAllProperties = (o: any): string[] => {
        let result: string[] = []

        for (
            let objectToInspect = o;
            objectToInspect !== null;
            objectToInspect = Object.getPrototypeOf(objectToInspect)
        ) {
            result = result.concat(Object.getOwnPropertyNames(objectToInspect))
        }

        return result
    }

    /**
     * Determines whether the specified object is array-like.
     * @param {Object} obj The object to check.
     * @returns {Boolean}
     */
    export const isArrayLike = (obj: any): boolean => {
        if (obj instanceof Array || typeof obj === 'string') {
            // Arrays/String
            return true
        } else if (typeof obj === 'object' && typeof obj.length === 'number') {
            // Array-likes have 'length' property (excelude 'function' type)

            if (
                typeof obj.splice === 'function' || // third party libraries. eg. jQuery
                obj.toString() === '[object Arguments]' || // arguments
                obj.buffer || // typed-array
                obj instanceof NodeList
            ) {
                // NodeList: document.querySelectorAll
                return true
            }
        }

        return false
    }

    /**
     * Defines new or modifies existing properties directly on the specified object, returning the object.
     * @param {Object} obj The object on which to define or modify properties.
     * @param {String} prop The name of the property to be defined or modified.
     * @param {PropertyDescriptor} attributes The descriptor for the property being defined or modified.
     * @returns {Object}
     */
    export const define = <T>(
        obj: any,
        prop: string,
        attributes: { value: T; writable?: boolean; enumerable?: boolean; configurable?: boolean },
    ): any => {
        Commons.defineProperty(obj, prop, attributes)

        if (Checkers.is(prop, 'string') && Checkers.isFunction(attributes.value)) {
            const _str = `function ${prop}() {...}`

            Commons.defineProperty(attributes.value, 'toString', {
                value() {
                    return _str
                },
                writable: true,
            })
        }

        return obj
    }

    /**
     * Extends the given object by implementing supplied members.
     * @param {Object} obj The object on which to define or modify properties.
     * @param {Object} properties Represetnts the mixin source object
     * @param {PropertyDescriptor=} attributes The descriptor for the property being defined or modified.
     * @returns {Object}
     */
    export const mixin = (
        obj: any,
        properties: any,
        attributes = { writable: true, enumerable: true, configurable: true },
    ): any => {
        if (obj) {
            for (const _prop in properties) {
                if (!Checkers.hasProperty(obj, _prop)) {
                    define(obj, _prop, {
                        value: properties[_prop],
                        writable: attributes.writable || false,
                        enumerable: attributes.enumerable || false,
                        configurable: attributes.configurable || false,
                    })
                }
            }
        }

        return obj
    }

    /**
     * Extends the given type by inheriting from a superType and/or extending its prototype.
     * @param {Function} type The type to extend.
     * @param {Function|Object} extender The super-type or the prototype mixin object.
     * @param {Object=} args The prototype mixin object or a mixin source object to extend the type.
     * @returns {Function}
     */
    export const extend = (type, extender, ...args: any[]): any => {
        const _args = args,
            _super = Checkers.isFunction(extender) ? extender : null,
            _proto = _args.length === 4 || _super ? _args[2] : extender,
            _static = _args.length === 4 || _super ? _args[3] : _args[2]

        if (_super) {
            const _ = (): void => {
                define({}, 'constructor', { value: type })
            }
            _.prototype = _super.prototype
            type.prototype = new _()
        }

        if (_proto) {
            mixin(type.prototype || type, _proto)
        }

        if (_static) {
            mixin(type, _static)
        }

        return type
    }

    export const extend2 = (...args: any[]): any => {
        for (let i = 1; i < args.length; i++) {
            for (const key in args[i]) {
                if (args[i].hasOwnProperty(key)) {
                    args[0][key] = args[i][key]
                }
            }
        }
        return args[0]
    }

    export const nextId = (startId: number): { next: () => number; reset: () => void } => {
        let id: number = startId || 0

        return {
            next: (): number => id++,
            reset: (): void => {
                id = 0
            },
        }
    }
}
