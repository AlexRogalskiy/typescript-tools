import _ from 'lodash'

import { Keys, KeyValue, Values } from '../../typings/general-types'
import { ObjectMap, Optional } from '../../typings/standard-types'

import { Checkers, CommonUtils, Errors, Numbers } from '..'

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
    ;((): void => {
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

    // let index = 2;
    // const data = {
    //     foo: {
    //         foz: [1, 2, 3],
    //         bar: {
    //             baz: ['a', 'b', 'c']
    //         }
    //     }
    // };
    // deepGet(data, ['foo', 'foz', index]); // get 3
    // deepGet(data, ['foo', 'bar', 'baz', 8, 'foz']); // null
    export const deepGet = (obj: any, keys: string[]): any =>
        keys.reduce((xs, x) => (xs && xs[x] !== null && xs[x] !== undefined ? xs[x] : null), obj)

    // const data = {
    //     level1: {
    //         level2: {
    //             level3: 'some data'
    //         }
    //     }
    // };
    // dig(data, 'level3'); // 'some data'
    // dig(data, 'level4'); // undefined
    export const dig = (obj: any, target: PropertyKey): any => {
        if (target in obj) {
            return obj[target]
        }

        return Object.values(obj).reduce((acc, val) => {
            if (acc !== undefined) return acc
            if (typeof val === 'object') return dig(val, target)
        }, undefined)
    }

    // equals(
    //     { a: [2, { e: 3 }], b: [4], c: 'foo' },
    //     { a: [2, { e: 3 }], b: [4], c: 'foo' }
    // ); // true
    // equals([1, 2, 3], { 0: 1, 1: 2, 2: 3 }); // true
    export const equals = (a: any, b: any): boolean => {
        if (a === b) return true
        if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
        if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b
        if (a.prototype !== b.prototype) return false
        const keys = Object.keys(a)
        if (keys.length !== Object.keys(b).length) return false

        return keys.every(k => equals(a[k], b[k]))
    }

    // findKey(
    //     {
    //         barney: { age: 36, active: true },
    //         fred: { age: 40, active: false },
    //         pebbles: { age: 1, active: true }
    //     },
    //     x => x['active']
    // ); // 'barney'
    export const findKey = (obj: any, fn: any): any => Object.keys(obj).find(key => fn(obj[key], key, obj))

    // const ages = {
    //     Leo: 20,
    //     Zoey: 21,
    //     Jane: 20,
    // };
    // findKeys(ages, 20); // [ 'Leo', 'Jane' ]
    export const findKeys = (obj: any, val: any): any => Object.keys(obj).filter(key => obj[key] === val)

    // flattenObject({ a: { b: { c: 1 } }, d: 1 }); // { 'a.b.c': 1, d: 1 }
    export const flattenObject = (obj: any, prefix = ''): any =>
        Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? `${prefix}.` : ''

            if (typeof obj[k] === 'object' && obj[k] !== null && Object.keys(obj[k]).length > 0)
                Object.assign(acc, flattenObject(obj[k], pre + k))
            else acc[pre + k] = obj[k]

            return acc
        }, {})

    // forOwn({ foo: 'bar', a: 1 }, v => console.log(v)); // 'bar', 1
    export const forOwn = (obj: any, fn: any): any => {
        for (const key of Object.keys(obj)) {
            fn(obj[key], key, obj)
        }
    }

    // forOwnRight({ foo: 'bar', a: 1 }, v => console.log(v)); // 1, 'bar'
    export const forOwnRight = (obj: any, fn: any): void => {
        for (const key of Object.keys(obj).reverse()) {
            fn(obj[key], key, obj)
        }
    }

    // const obj = {
    //     selector: { to: { val: 'val to select' } },
    //     target: [1, 2, { a: 'test' }],
    // };
    // get(obj, 'selector.to.val', 'target[0]', 'target[2].a');
    // ['val to select', 1, 'test']
    export const get = (from: any, ...selectors: string[]): any[] =>
        [...selectors].map(s =>
            s
                .replace(/\[([^[\]]*)]/g, '.$1.')
                .split('.')
                .filter(t => t !== '')
                .reduce((prev, cur) => prev && prev[cur], from),
        )

    // invertKeyValues({ a: 1, b: 2, c: 1 }); // { 1: [ 'a', 'c' ], 2: [ 'b' ] }
    // invertKeyValues({ a: 1, b: 2, c: 1 }, value => 'group' + value);
    // { group1: [ 'a', 'c' ], group2: [ 'b' ] }
    export const invertKeyValues = (obj: any, fn: any): any =>
        Object.keys(obj).reduce((acc, key) => {
            const val = fn ? fn(obj[key]) : obj[key]
            acc[val] = acc[val] || []
            acc[val].push(key)
            return acc
        }, {})

    // longestItem('this', 'is', 'a', 'testcase'); // 'testcase'
    // longestItem(...['a', 'ab', 'abc']); // 'abc'
    // longestItem(...['a', 'ab', 'abc'], 'abcd'); // 'abcd'
    // longestItem([1, 2, 3], [1, 2], [1, 2, 3, 4, 5]); // [1, 2, 3, 4, 5]
    // longestItem([1, 2, 3], 'foobar'); // 'foobar'
    export const longestItem = (...vals: any[]): any => vals.reduce((a, x) => (x.length > a.length ? x : a))

    // const users = {
    //     fred: { user: 'fred', age: 40 },
    //     pebbles: { user: 'pebbles', age: 1 }
    // };
    // mapValues(users, u => u.age); // { fred: 40, pebbles: 1 }
    export const mapValues = (obj: any, fn: any): any =>
        Object.keys(obj).reduce((acc, k) => {
            acc[k] = fn(obj[k], k, obj)
            return acc
        }, {})

    // omit({ a: 1, b: '2', c: 3 }, ['b']); // { 'a': 1, 'c': 3 }
    export const omit = (obj: any, arr: PropertyKey[]): any =>
        Object.keys(obj)
            .filter(k => !arr.includes(k))
            .reduce((acc, key) => ((acc[key] = obj[key]), acc), {})

    // omitBy({ a: 1, b: '2', c: 3 }, x => typeof x === 'number'); // { b: '2' }
    export const omitBy = (obj: any, fn: any): any =>
        Object.keys(obj)
            .filter(k => !fn(obj[k], k))
            .reduce((acc, key) => ((acc[key] = obj[key]), acc), {})

    // const obs = observeMutations(document, console.log);
    // Logs all mutations that happen on the page
    //     obs.disconnect();
    // Disconnects the observer and stops logging mutations on the page
    export const observeMutations = (element: any, callback: any, options: any): MutationObserver => {
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                callback(m)
            }
        })

        observer.observe(
            element,
            Object.assign(
                {
                    childList: true,
                    attributes: true,
                    attributeOldValue: true,
                    characterData: true,
                    characterDataOldValue: true,
                    subtree: true,
                },
                options,
            ),
        )

        return observer
    }

    // pick({ a: 1, b: '2', c: 3 }, ['a', 'c']); // { 'a': 1, 'c': 3 }
    export const pick2 = (obj: any, arr: any[]): any =>
        arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {})

    // objectFromPairs([['a', 1], ['b', 2]]); // {a: 1, b: 2}
    export const objectFromPairs = (arr: any[]): any => arr.reduce((a, [key, val]) => ((a[key] = val), a), {})

    // queryStringToObject('https://google.com?page=1&count=10');
    // {page: '1', count: '10'}
    export const queryStringToObject = (url: string): any =>
        [...new URLSearchParams(url.split('?')[1])[Symbol.iterator]].reduce(
            (a, [k, v]) => ((a[k] = v), a),
            {},
        )

    // const obj = { name: 'Bobo', job: 'Front-End Master', shoeSize: 100 };
    // renameKeys({ name: 'firstName', job: 'passion' }, obj);
    // { firstName: 'Bobo', passion: 'Front-End Master', shoeSize: 100 }
    export const renameKeys = (keysMap: any[], obj: any): any =>
        Object.keys(obj).reduce(
            (acc, key) => ({
                ...acc,
                ...{ [keysMap[key] || key]: obj[key] },
            }),
            {},
        )

    // pickBy({ a: 1, b: '2', c: 3 }, x => typeof x === 'number');
    // { 'a': 1, 'c': 3 }
    export const pickBy = (obj: any, fn: any): any =>
        Object.keys(obj)
            .filter(k => fn(obj[k], k))
            .reduce((acc, key) => ((acc[key] = obj[key]), acc), {})

    // const object = {
    //     a: [{ x: 2 }, { y: 4 }],
    //     b: 1
    // };
    // const other = {
    //     a: { z: 3 },
    //     b: [2, 3],
    //     c: 'foo'
    // };
    // mergeOf(object, other);
    // { a: [ { x: 2 }, { y: 4 }, { z: 3 } ], b: [ 1, 2, 3 ], c: 'foo' }
    export const mergeOf = (...objs: any[]): any =>
        [...objs].reduce(
            (acc, obj) =>
                Object.keys(obj).reduce((_, k) => {
                    acc[k] = acc.hasOwnProperty(k) ? [].concat(acc[k]).concat(obj[k]) : obj[k]
                    return acc
                }, {}),
            {},
        )

    // mapObject([1, 2, 3], a => a * a); // { 1: 1, 2: 4, 3: 9 }
    export const mapObject = (arr: any, fn: any): any =>
        arr.reduce((acc, el, i) => {
            acc[el] = fn(el, i, arr)
            return acc
        }, {})

    // mapKeys({ a: 1, b: 2 }, (val, key) => key + val); // { a1: 1, b2: 2 }
    export const mapKeys = (obj: any, fn: any): any =>
        Object.keys(obj).reduce((acc, k) => {
            acc[fn(obj[k], k, obj)] = obj[k]
            return acc
        }, {})

    // const myObj = { Name: 'Adam', sUrnAME: 'Smith' };
    // const myObjLower = lowercaseKeys(myObj); // {name: 'Adam', surname: 'Smith'};
    export const lowercaseKeys = (obj: any): any =>
        Object.keys(obj).reduce((acc, key) => {
            acc[key.toLowerCase()] = obj[key]
            return acc
        }, {})

    // let obj = {
    //     a: 1,
    //     b: { c: 4 },
    //     'b.d': 5
    // };
    // hasKey(obj, ['a']); // true
    // hasKey(obj, ['b']); // true
    // hasKey(obj, ['b', 'c']); // true
    // hasKey(obj, ['b.d']); // true
    // hasKey(obj, ['d']); // false
    // hasKey(obj, ['c']); // false
    // hasKey(obj, ['b', 'f']); // false
    export const hasKey = (obj: any, keys: string[]): boolean => {
        return (
            keys.length > 0 &&
            keys.every(key => {
                if (typeof obj !== 'object' || !obj.hasOwnProperty(key)) return false
                obj = obj[key]
                return true
            })
        )
    }

    // deepMerge(
    //     { a: true, b: { c: [1, 2, 3] } },
    //     { a: false, b: { d: [1, 2, 3] } },
    //     (key, a, b) => (key === 'a' ? a && b : Object.assign({}, a, b))
    // );
    export const deepMerge = (a: any, b: any, fn: any): any =>
        [...new Set([...Object.keys(a), ...Object.keys(b)])].reduce(
            (acc, key) => ({ ...acc, [key]: fn(key, a[key], b[key]) }),
            {},
        )

    // defaults({ a: 1 }, { b: 2 }, { b: 6 }, { a: 3 }); // { a: 1, b: 2 }
    export const defaults = (obj: any, ...defs: any[]): any => Object.assign({}, obj, ...defs.reverse(), obj)

    // const obj = {
    //     foo: '1',
    //     nested: {
    //         child: {
    //             withArray: [
    //                 {
    //                     grandChild: ['hello']
    //                 }
    //             ]
    //         }
    //     }
    // };
    // const upperKeysObj = deepMapKeys(obj, key => key.toUpperCase());
    export const deepMapKeys = (obj: any, fn: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(val => deepMapKeys(val, fn))
        }

        if (typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, current) => {
                const key = fn(current)
                const val = obj[current]
                acc[key] = val !== null && typeof val === 'object' ? deepMapKeys(val, fn) : val
                return acc
            }, {})
        }

        return obj
    }

    export const deepFreeze4 = (obj: any): any => {
        for (const prop of Object.keys(obj)) {
            if (typeof obj[prop] === 'object') deepFreeze4(obj[prop])
        }

        return Object.freeze(obj)
    }

    // const x = new Set([1, 2, 1, 3, 4, 1, 2, 5]);
    // [...chunkify(x, 2)]; // [[1, 2], [3, 4], [5]]
    export function* chunkify(itr, size): any {
        let chunk: any[] = []
        for (const v of itr) {
            chunk.push(v)
            if (chunk.length === size) {
                yield chunk
                chunk = []
            }
        }
        if (chunk.length) yield chunk
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
