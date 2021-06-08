import _ from 'lodash'

import { Keys, KeyValue, Values } from '../../typings/general-types'
import { ObjectMap, Optional } from '../../typings/standard-types'

import { Numbers, Checkers, Errors, CommonUtils } from '..'

export namespace Objects {
    import isFunction = Checkers.isFunction
    import defineProperty = CommonUtils.defineProperty
    import defineStaticProperty = CommonUtils.defineStaticProperty
    import isObject = Checkers.isObject

    const { hasOwnProperty: hasOwnProp } = Object.prototype

    const pathToString = (path: string[]): string => {
        return `.${path.join('.')}`
    }

    export type ComparisonRelaxations = {
        allowMissingNull?: boolean
        allowStringifiedIntegers?: boolean
    }

    export const props = (() => {
        const props = {
            static: {
                extends: '__extends__',
            },
        }

        const extends_ = (obj: any, dest: any, source: any): void => {
            for (const p in source) if (source.hasOwnProperty(p)) dest[p] = source[p]

            function __(): void {
                obj.constructor = dest
            }

            dest.prototype =
                source === null ? Object.create(source) : ((__.prototype = source.prototype), new __())

            return dest
        }

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

        if (!isFunction(Object[props.static.extends])) {
            defineStaticProperty(Object, props.static.extends, {
                value(target, source) {
                    return extends_(this, target, source)
                },
            })
        }
    })()

    export const hasOwn = (obj, propName): boolean => {
        return Object.prototype.hasOwnProperty.call(obj, propName)
    }

    export const pick = (obj: any, keys: any[]): any => {
        return keys.reduce((picked, key) => {
            if (hasOwn(obj, key)) {
                picked[key] = obj[key]
            }
            return picked
        }, {})
    }

    export const deepFreeze3 = (val: any): any => {
        if (isObject(val) && !Object.isFrozen(val)) {
            for (const [key, value] of Object.entries<any>(val)) {
                value[key] = deepFreeze(value[key])
            }

            return Object.freeze(val)
        }

        return val
    }

    export const formatOptions = (options: any, defaultOptions: any): any => {
        if (!options) {
            return defaultOptions
        }

        for (const prop in defaultOptions) {
            if (hasOwnProp.call(defaultOptions, prop)) {
                if (typeof options[prop] === 'undefined') {
                    options[prop] = defaultOptions[prop]
                }
            }
        }

        return options
    }

    // https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    export function deepEquals(
        x: any,
        y: any,
        assumeStringsEqual: boolean,
        relax: ComparisonRelaxations,
        path: string[] = [],
    ): boolean {
        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (typeof x === 'number' && typeof y === 'number') {
            if (isNaN(x) && isNaN(y)) {
                return true
            }
            // because sometimes Newtonsoft.JSON is not exact
            if (Math.fround(x) === Math.fround(y)) {
                return true
            }
            console.error(`Numbers are not equal at path ${pathToString(path)}.`)
            return false
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true
        }

        if (!!relax.allowStringifiedIntegers && typeof x === 'string' && typeof y === 'number') {
            if (x === y.toString()) return true
            console.error(`String and number not equal at path ${pathToString(path)}.`)
            return false
        }

        if (x instanceof String && y instanceof String) {
            if (x.toString() === y.toString()) return true
            console.error(`Number or string not equal at path ${pathToString(path)}.`)
            return false
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            console.error(`One is not an object at path ${pathToString(path)}.`)
            return false
        }

        // If the objects have an own property "constructor" then we need to
        // compare it regularly.
        if (x.constructor instanceof String && x.constructor !== y.constructor) {
            console.error(
                `Not the same constructor at path ${pathToString(path)}: should be ${x.constructor} but is ${
                    y.constructor
                }.`,
            )
            return false
        }

        if (x.prototype !== y.prototype) {
            console.error(`Not the same prototype at path ${pathToString(path)}.`)
            return false
        }

        if (Array.isArray(x)) {
            if (x.length !== y.length) {
                console.error(`Arrays don't have the same length at path ${pathToString(path)}.`)
                return false
            }
            for (let i = 0; i < x.length; i++) {
                path.push(i.toString())
                if (!deepEquals(x[i], y[i], assumeStringsEqual, relax, path)) {
                    return false
                }
                path.pop()
            }
            return true
        }

        // FIXME: The way we're looking up properties with `indexOf` makes this
        // quadratic.  So far no problem, so meh.
        const xKeys = Object.keys(x)
        const yKeys = Object.keys(y)

        for (const p of yKeys) {
            // We allow properties in y that aren't present in x
            // so long as they're null.
            if (!xKeys.includes(p)) {
                if (y[p] !== null) {
                    console.error(`Non-null property ${p} is not expected at path ${pathToString(path)}.`)
                    return false
                }
            }
        }

        for (const p of xKeys) {
            if (!yKeys.includes(p)) {
                if (!!relax.allowMissingNull && x[p] === null) {
                    continue
                }
                console.error(`Expected property ${p} not found at path ${pathToString(path)}.`)
                return false
            }

            path.push(p)
            if (!deepEquals(x[p], y[p], assumeStringsEqual, relax, path)) {
                return false
            }
            path.pop()
        }

        return true
    }

    export const clone = (obj: any): any => {
        if (obj === null || obj === undefined) {
            return obj
        }

        const clone = Object.create(null),
            keys = Object.keys(obj)

        for (const key of keys) {
            const val = obj[key]
            if (Array.isArray(val)) {
                clone[key] = val.slice()
                continue
            }

            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                clone[key] = val
                continue
            }

            throw new TypeError('clone is not deep and does not support nested objects')
        }

        return clone
    }

    export const deepFreeze = <T extends Record<string, any>>(object: T): Readonly<T> => {
        for (const value of Object.values(object)) {
            if (_.isPlainObject(value) || _.isArray(value)) {
                deepFreeze(value)
            }
        }

        return Object.freeze(object)
    }

    export const getPropertyByPath = (
        source: { [key: string]: unknown },
        path: string | string[],
    ): unknown => {
        if (typeof path === 'string' && Object.prototype.hasOwnProperty.call(source, path)) {
            return source[path]
        }

        const parsedPath = typeof path === 'string' ? path.split('.') : path

        return parsedPath.reduce((previous: any, key): unknown => {
            if (previous === undefined) {
                return previous
            }
            return previous[key]
        }, source)
    }

    export const randomEnum = <T>(enumType: T): Values<T> => {
        const values = Object.values(enumType) as unknown as Values<T>[]
        const index = Numbers.random(values.length)

        return values[index]
    }

    export const pluckBy = <T, K extends Keys<T>>(obj: T, propertyNames: K[]): T[K][] => {
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
        defineProperty(obj, prop, attributes)

        if (Checkers.is(prop, 'string') && Checkers.isFunction(attributes.value)) {
            const _str = `function ${prop}() {...}`

            defineProperty(attributes.value, 'toString', {
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

    export const newOperator = (obj: any, ...args: any[]): any => {
        const that = Object.create(obj.prototype)
        const result = obj.apply(that, args)

        if (typeof result === 'object' && result !== null) {
            return result
        }

        return that
    }

    /**
     * @param {!Object} obj
     * @returns {Array<string>}
     */
    export const getKeys = (obj: any): string[] => {
        return Object.keys(obj)
    }

    export const values = <T>(objectMap: ObjectMap<T>): T[] => {
        return Object.values(objectMap) as T[]
    }

    export const entries = <T>(objectMap: ObjectMap<T>): [string, T][] => {
        return Object.entries(objectMap) as [string, T][]
    }

    export const keys = (objectMap: ObjectMap<any>): string[] => {
        return Object.keys(objectMap)
    }

    export const getByValue = <K, V>(item: V, values: Map<K, V>): Optional<KeyValue<K, V>> => {
        for (const [key, value] of values) {
            if (value === item) {
                return { key, value }
            }
        }

        return null
    }

    export const getByKey = <K, V>(item: K, values: Map<K, V>): Optional<KeyValue<K, V>> => {
        for (const [key, value] of values) {
            if (key === item) {
                return { key, value }
            }
        }

        return null
    }

    /**
     * @public
     * @function deepFreeze
     * @description Deep freeze object.
     * @param {Object} object - Object to deep freeze.
     * @returns {Object} - Deep frozen object.
     */
    export const deepFreeze2 = (object: any): void => {
        if (!object) return

        let property, propertyKey
        object = Object.freeze(object)

        for (propertyKey in object) {
            if (object.hasOwnProperty(propertyKey)) {
                property = object[propertyKey]
                if (
                    typeof property !== 'object' ||
                    !(property instanceof Object) ||
                    Object.isFrozen(property)
                ) {
                    continue
                }
                deepFreeze2(property)
            }
        }

        return object
    }
}
