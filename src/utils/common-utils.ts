import _ from 'lodash'

import { Iterator, IteratorStep } from '../../typings/function-types'

import { Checkers, Errors } from '..'

export namespace CommonUtils {
    export const normalizeBy = (name: string): string => {
        if (!Checkers.isString(name)) {
            name = String(name)
        }

        if (/[^a-z0-9\-#$%&'*+.\\^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name')
        }

        return name.toLowerCase()
    }

    export const mergeProps = <T>(...obj: any[]): T =>
        _.mergeWith({}, ...obj, (o, s) => {
            return _.isArray(s) && _.isArray(o) ? _.union(o, s) : _.isNull(s) ? o : s
        })

    export async function time<T>(work: () => Promise<T>): Promise<[T, number]> {
        const start = +new Date()
        const result = await work()
        const end = +new Date()

        return [result, end - start]
    }

    export const normalize = (value: any): string => {
        if (!Checkers.isString(value)) {
            value = String(value)
        }

        return value
    }

    /**
     *
     * @param {string[]} argv
     * @param {string} flag
     * @returns {boolean}
     */
    export const popFlag = (argv, flag): boolean => {
        const flagIndex = argv.indexOf(flag)

        if (flagIndex !== -1) {
            argv.splice(flagIndex, 1)
            return true
        }

        return false
    }

    /**
     * Converts old-style value to new-style value.
     *
     * @param {any} x - The value to convert.
     * @returns {({include: string[], exclude: string[], replace: string[]})[]} Normalized value.
     */
    export const normalizeValue = (x: any): any => {
        if (Array.isArray(x)) {
            return x
        }

        return Object.keys(x).map(pattern => ({
            include: [pattern],
            exclude: [],
            replace: x[pattern],
        }))
    }

    // Build a destructive iterator for the value list
    export const iteratorFor = <T>(items: T[]): Iterator<T> => {
        const iterator = {
            next: (): IteratorStep<T> => {
                const value = items.shift()
                return { value, done: value === undefined }
            },
        }

        iterator[Symbol.iterator] = () => iterator

        return iterator
    }

    export const defineAccessorProperty = (obj: any, prop: PropertyKey, value: any): any => {
        return Object.defineProperty(obj, prop, {
            get: () => value,
            set: newValue => (value = newValue),
            enumerable: true,
            configurable: true,
        })
    }

    export const convertError = (error: any): any => {
        return Object.getOwnPropertyNames(error).reduce((product, name): any => {
            defineProperty(product, name, {
                value: error[name],
                enumerable: true,
            })
        }, {})
    }

    export const registerProperty = (obj: any, key: PropertyKey, fn): any => {
        return Object.defineProperty(obj, key, {
            get: fn,
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
        attrs: { __proto__?: null; value: any },
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
}
