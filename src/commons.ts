import { sha1 } from 'object-hash'

import { Checkers } from './checkers'
import { Errors } from './errors'
import { Objects } from './objects'

export namespace Commons {
    const WINDOW_USER_SCRIPT_VARIABLE = '__USER__'

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

    export const defineAccessorProperty = (obj: any, prop: PropertyKey, value: any): any => {
        return Object.defineProperty(obj, prop, {
            get: () => value,
            set: newValue => (value = newValue),
            enumerable: true,
            configurable: true,
        })
    }

    export const defineProperty = (
        obj: any,
        prop: PropertyKey,
        attrs: PropertyDescriptor = { writable: true, enumerable: true, configurable: true },
    ): any => {
        return Object.defineProperty(obj, prop, attrs)
    }

    export const defineStaticProperty = (
        obj: any,
        prop: PropertyKey,
        attrs = { __proto__: null, value: 'static' },
    ): any => {
        // Object.defineProperty(obj, prop, withValue('static'));
        return Object.defineProperty(obj, prop, attrs)
    }

    export const freeze = (obj: any): void => {
        // if freeze is available, prevents adding or
        // removing the object prototype properties
        // (value, get, set, enumerable, writable, configurable)
        ;(Object.freeze || Object)(obj.prototype)
    }

    export const withValue = (value: any): any => {
        const d =
            withValue['d'] ||
            (withValue['d'] = {
                enumerable: false,
                writable: false,
                configurable: false,
                value: null,
            })
        d.value = value

        return d
    }

    // adding a writable data descriptor - not configurable, not enumerable
    // Object.setProperty(4, myObj, 'myNumber', 25);
    // adding a readonly data descriptor - not configurable, enumerable
    // Object.setProperty(1, myObj, 'myString', 'Hello world!');
    export const createProperty = (global: any): void => {
        Object['setProperty'] = (
            mask: number,
            obj: any,
            prop: PropertyKey,
            getter: any,
            setter: any,
        ): any => {
            if (mask & 8) {
                // accessor descriptor
                if (Checkers.isFunction(getter)) {
                    global.get = getter
                } else {
                    delete global.get
                }
                if (Checkers.isFunction(setter)) {
                    global.set = setter
                } else {
                    delete global.set
                }
                delete global.value
                delete global.writable
            } else {
                // data descriptor
                if (Checkers.isFunction(getter)) {
                    global.value = getter()
                } else {
                    delete global.value
                }
                global.writable = Boolean(mask & 4)
                delete global.get
                delete global.set
            }
            global.enumerable = Boolean(mask & 1)
            global.configurable = Boolean(mask & 2)
            Object.defineProperty(obj, prop, global)

            return obj
        }
    }

    // addMethod(this, "find", () => {})
    // addMethod(this, "find", (name) => {})
    // addMethod(this, "find", (first, last) => {})
    export const addMethod = (obj: any, name: string, fn, ...args: any[]): any => {
        const old = obj[name]
        obj[name] = () => {
            if (fn.length === args.length) {
                return fn.apply(obj, args)
            } else if (typeof old === 'function') {
                return old.apply(obj, args)
            }
        }
    }

    /**
     * Creates A function expression from the specified string lambda expression
     * @param {String} exp String lambda expression.
     * @returns {Function}
     */
    export const lambda = (exp: any): any => {
        if (typeof exp === 'function') {
            return exp
        } else if (typeof exp === 'string') {
            const _pattern = /^\s*\(?\s*(([a-z_$][a-z0-9_$]*)+([, ]+[a-z_$][a-z0-9_$]*)*)*\s*\)?\s*=>\s*(.*)$/i
            if (_pattern.test(exp)) {
                const _match = exp.match(_pattern)
                return new Function(
                    ((_match && _match[1]) || '').replace(/ /g, ''),
                    `return ${_match && _match[4]}`,
                )
            }

            throw Errors.valueError(`Cannot parse supplied expression: ${exp}`)
        }

        return null
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

    /**
     * Returns a boolean indicating whether the object has the specified property.
     * @param {Object} obj An object.
     * @param {String} prop A property name.
     * @returns {Boolean}
     */
    export const hasProperty = (obj: any, prop: PropertyKey): boolean => {
        return Checkers.isFunction(obj.hasOwnProperty) ? obj.hasOwnProperty(prop) : prop in obj
    }
}
