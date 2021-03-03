import { sha1 } from 'object-hash'

import { Objects } from './objects'
import { Utils } from './utils'
import { Checkers } from './checkers'

export namespace Commons {
    import defineProperty = Utils.Commons.defineProperty
    import defineStaticProperty = Utils.Commons.defineStaticProperty
    import hasProperty = Checkers.hasProperty
    import isFunction = Checkers.isFunction

    const WINDOW_USER_SCRIPT_VARIABLE = '__USER__'

    export const init = (() => {
        const _equalsStaticSymbol = '__equals__'
        const _compareStaticSymbol = '__compare__'

        const _equalsSymbol = 'eq'
        const _compareSymbol = 'cmp'

        // Compares Primitive objects
        const computePrimitiveEquals = (objA: any, objB: any): boolean => {
            return objA === objB
        }

        // Compares Date objects by their time
        const computeDateEquals = (objA: any, objB: any): boolean => {
            return objA instanceof Date && objB instanceof Date && objA.getTime() === objB.getTime()
        }

        // Compares Object types by their Hash code and Properties
        const computeObjectEquals = (objA: any, objB: any): boolean => {
            if (typeof objA === 'object' && typeof objB === 'object') {
                if (sha1(objA, true) !== sha1(objB, true)) {
                    return false
                }

                /// Process equality for object literals:
                /// object literals may have equal hash code, we process equality by each property.
                /// regular "class" instances have different hash code, hence do not fall into following code.
                /// object objA is direct descendant of Object hence no need to check "hasOwnProperty"

                let _val

                for (const _prop in objA) {
                    if (hasProperty(objA, _prop)) {
                        _val = objA[_prop]

                        /// Object methods are not considered for equality
                        if (typeof _val === 'function') {
                            continue
                        }

                        if (hasProperty(objB, _prop)) {
                            if (!computeEquals(_val, objB[_prop], true)) {
                                return false
                            }
                        }
                    }

                    /// no need to browse objB properties, all properties of objA is checked against objB
                    /// it is very unlikely for object literals with the same hash code to have different properties
                    /// even in such a rare case, objects are considered equal

                    return true
                }
            }

            // Objects are equal (with auto type conversion)
            // Objects from the same type are considered equal (eg. new Number(1) and 1)
            return objA === objB
        }

        /**
         * Determines whether the specified object instances are considered equal.
         * @param {Object} objA The first object to compare.
         * @param {Object} objB The second object to compare.
         * @param {Boolean} override When true, uses the overridden __equals__ function if it is defined.
         * @returns {Boolean}
         */
        const computeEquals = (objA, objB, override): boolean => {
            // Objects are identical (including null)
            if (objA === objB) {
                return true
            } else if (objA == null || objB == null) {
                return false
            }

            // Objects check for equality for primitive types
            if (typeof objA === 'number' || typeof objA === 'string' || typeof objA === 'boolean') {
                return objA === objB
            } else if (typeof objA === 'object') {
                // Objects are from "Date" type
                if (objA instanceof Date) {
                    return computeDateEquals(objA, objB)
                } else if (override && typeof objA.__equals__ === 'function') {
                    return objA.__equals__(objB)
                }

                return computeObjectEquals(objA, objB)
            }

            // Objects are already not equal
            return false
        }

        /**
         * Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
         */
        const computeCompare = (objA: any, objB: any): number => {
            if (objA === objB) {
                // Identical objects
                return 0
            } else if (objA == null) {
                // null or undefined is less than everything
                return -1
            } else if (objB == null) {
                // Everything is greater than null or undefined
                return 1
            }
            if (
                typeof objA === 'number' || // numbers compare using "gt" operator
                typeof objA === 'boolean'
            ) {
                // booleans compare using "gt" operator
                return objA > objB ? 1 : -1 // values are already checked to equality
            } else if (typeof objA === 'string') {
                return objA.localeCompare(objB) // Strings are compared using String.prototype.localeCompare method
            }

            if (
                objA instanceof Date && // Dates are compared using 'getTime' method
                objB instanceof Date
            ) {
                const _t1 = objA.getTime(),
                    _t2 = objB.getTime()

                return _t1 > _t2 ? 1 : _t2 > _t1 ? -1 : 0
            }
            // Objects are compared using 'valueOf' method
            const _v1 = objA.valueOf(),
                _v2 = objB.valueOf()

            return _v1 > _v2 ? 1 : _v2 > _v1 ? -1 : 0
        }

        if (!isFunction(Date.prototype[_equalsSymbol])) {
            defineProperty(Date.prototype, _equalsSymbol, {
                value(obj) {
                    return computeDateEquals(this, obj)
                },
            })
        }

        if (!isFunction(Date.prototype[_compareSymbol])) {
            defineProperty(Date.prototype, _compareSymbol, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Number.prototype[_equalsSymbol])) {
            defineProperty(Number.prototype, _equalsSymbol, {
                value(obj) {
                    return computePrimitiveEquals(this, obj)
                },
            })
        }

        if (!isFunction(Number.prototype[_compareSymbol])) {
            defineProperty(Number.prototype, _compareSymbol, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(String.prototype[_equalsSymbol])) {
            defineProperty(String.prototype, _equalsSymbol, {
                value(obj) {
                    return computePrimitiveEquals(this, obj)
                },
            })
        }

        if (!isFunction(String.prototype[_compareSymbol])) {
            defineProperty(String.prototype, _compareSymbol, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Boolean.prototype[_equalsSymbol])) {
            defineProperty(Boolean.prototype, _equalsSymbol, {
                value(obj) {
                    return computePrimitiveEquals(this, obj)
                },
            })
        }

        if (!isFunction(Boolean.prototype[_compareSymbol])) {
            defineProperty(Boolean.prototype, _compareSymbol, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Object.prototype[_equalsSymbol])) {
            defineProperty(Object.prototype, _equalsSymbol, {
                value(obj) {
                    return computeObjectEquals(this, obj)
                },
            })
        }

        if (!isFunction(Object.prototype[_compareSymbol])) {
            defineProperty(Object.prototype, _compareSymbol, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Date[_equalsStaticSymbol])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(Date, _equalsStaticSymbol, {
                value: (obj1, obj2) => computeDateEquals(obj1, obj2),
            })
        }

        if (!isFunction(Date[_compareStaticSymbol])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(Date, _compareStaticSymbol, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Number[_equalsStaticSymbol])) {
            defineStaticProperty(Number, _equalsStaticSymbol, {
                value: (obj1, obj2) => computePrimitiveEquals(obj1, obj2),
            })
        }

        if (!isFunction(Number[_compareStaticSymbol])) {
            defineStaticProperty(Number, _compareStaticSymbol, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(String[_equalsStaticSymbol])) {
            defineStaticProperty(String, _equalsStaticSymbol, {
                value: (obj1, obj2) => computePrimitiveEquals(obj1, obj2),
            })
        }

        if (!isFunction(String[_compareStaticSymbol])) {
            defineStaticProperty(String, _compareStaticSymbol, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Boolean[_equalsStaticSymbol])) {
            defineStaticProperty(Boolean, _equalsStaticSymbol, {
                value: (obj1, obj2) => computePrimitiveEquals(obj1, obj2),
            })
        }

        if (!isFunction(Boolean[_compareStaticSymbol])) {
            defineStaticProperty(Boolean, _compareStaticSymbol, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Object[_equalsStaticSymbol])) {
            defineStaticProperty(Object, _equalsStaticSymbol, {
                value: (obj1, obj2) => computeObjectEquals(obj1, obj2),
            })
        }

        if (!isFunction(Object[_compareStaticSymbol])) {
            defineStaticProperty(Object, _compareStaticSymbol, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Function[_equalsStaticSymbol])) {
            defineStaticProperty(Function, _equalsStaticSymbol, {
                value: (obj1, obj2, override) => computeEquals(obj1, obj2, override),
            })
        }

        if (!isFunction(Function[_compareStaticSymbol])) {
            defineStaticProperty(Function, _compareStaticSymbol, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }
    })()

    export const getUserScript = (value: string): string => {
        return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(value)};`
    }

    const discardSingle = <A>(obj: A, toDiscard: string): A => {
        const result = {}
        const keys = Object.keys(obj)
        for (const key of keys) {
            if (key !== toDiscard && Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = obj[key]
            }
        }

        return result as A
    }

    const discardMany = <A>(obj: A, toDiscard: string[]): A => {
        const result = {}
        const keys = Object.keys(obj)
        for (const key of keys) {
            if (-1 === toDiscard.indexOf(key) && Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = obj[key]
            }
        }

        return result as A
    }

    export const toBoolean = (value: unknown): boolean => {
        return (
            (typeof value === 'string' && /true/i.test(value)) ||
            value === true ||
            value === 'true' ||
            value === 1 ||
            value === '1' ||
            value === 'on' ||
            value === 'yes'
        )
    }

    export const getTagsByCode = (tags): unknown => {
        return tags.reduce((acc, tag) => {
            return { ...acc, [tag.code]: { ...tag, id: tag.code } }
        }, {})
    }

    export const toPrimitive = <T>(obj: T): any => {
        let funct, val, _i, _len
        let functions = ['valueOf', 'toString']

        if (typeof obj === 'object') {
            if (obj instanceof Date) {
                functions = ['toString', 'valueOf']
            }

            for (_i = 0, _len = functions.length; _i < _len; _i++) {
                funct = functions[_i]
                if (typeof obj[funct] === 'function') {
                    val = obj[funct]()
                    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                        return val
                    }
                }
            }

            throw new Error('Default value is ambiguous.')
        }
        return obj
    }

    export const getUniqueId = (() => {
        let id = 0
        return element => {
            if (!element.id) {
                element.id = `generated-uid-${id++}`
            }
            return element.id
        }
    })()

    export const directions = (...args): void => {
        const [start, ...remaining] = args
        const [finish, ...stops] = remaining.reverse()

        console.log(`drive through ${args.length} towns`)
        console.log(`start in ${start}`)
        console.log(`the destination is ${finish}`)
        console.log(`stopping ${stops.length} times in between`)
    }

    export const dispatcher = {
        join(before: any, after: any) {
            return `${before}:${after}`
        },
        sum(...rest: any[]) {
            return rest.reduce((prevValue: any, curValue: any): any => {
                return prevValue + curValue
            })
        },
    }

    export const hash = (...args: any[]): string => {
        return sha1(...args)
    }

    // console.log(mediator.relay('join', 'bar', 'baz'));
    export const mediator = {
        relay(method: string, ...args: any[]) {
            return dispatcher[method](...args)
        },
    }

    // const iterator = getCurrency();
    // console.log(iterator.next());
    export function* getCurrency(): Generator<string> {
        console.log('the generator function has started')
        const currencies = ['NGN', 'USD', 'EUR', 'GBP', 'CAD']
        for (const currency of currencies) {
            yield currency
        }
        console.log('the generator function has ended')
    }

    export const isEmpty = (value: any): boolean => {
        return (
            value === void 0 ||
            value === '' ||
            String(value).toLocaleLowerCase() === 'null' ||
            value === 'undefined' ||
            (typeof value === 'object' && Object.keys(value).length === 0)
        )
    }

    export function discard<A>(a: A, toDiscard: string | string[]): A {
        return typeof toDiscard === 'string' ? discardSingle(a, toDiscard) : discardMany(a, toDiscard)
    }

    /**
     * Determines whether the specified object instances are considered equal. calls the overridden "equals" method when available.
     * @param {Object} objA The first object to compare.
     * @param {Object} objB The second object to compare.
     * @returns {Boolean} true if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
     */
    export const equals = (objA: any, objB: any): boolean => {
        if (objA === objB) {
            return true // Objects are identical (including null)
        } else if (objA == null || objB == null) {
            return false
        }

        return sha1(objA) === sha1(objB) && Objects.shallowEquals(objA, objB)
    }
}
