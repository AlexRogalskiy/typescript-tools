import { Checkers } from './checkers'

export namespace Commons {
    import isFunction = Checkers.isFunction
    const WINDOW_USER_SCRIPT_VARIABLE = '__USER__'

    export const getUserScript = (value: string): string => {
        return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(value)};`
    }

    const discardSingle = <A>(a: A, toDiscard: string): A => {
        const result = {}
        const keys = Object.keys(a)
        for (const key of keys) {
            if (key !== toDiscard && Object.prototype.hasOwnProperty.call(a, key)) {
                result[key] = a[key]
            }
        }

        return result as A
    }

    const discardMany = <A>(a: A, toDiscard: string[]): A => {
        const result = {}
        const keys = Object.keys(a)
        for (const key of keys) {
            if (-1 === toDiscard.indexOf(key) && Object.prototype.hasOwnProperty.call(a, key)) {
                result[key] = a[key]
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

    export const hasPrototypeProperty = (obj: any, name: string): boolean => {
        return !obj.hasOwnProperty(name) && name in obj
    }

    export const inheritPrototype = (subType: any, superType: any): void => {
        const prototype = new Object(superType.prototype)
        prototype.constructor = subType
        subType.prototype = prototype
    }

    export const isHostMethod = (obj: any, prop: string): boolean => {
        return typeof obj[prop] === 'function' || isHostObject(obj, prop)
    }

    export const isHostObject = (obj: any, prop: string): boolean => {
        return !!(typeof obj[prop] === 'object' && obj[prop])
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

    export const defineAccessorProperty = (obj: any, prop: string, value: any): any => {
        return Object.defineProperty(obj, prop, {
            get: () => value,
            set: newValue => (value = newValue),
            enumerable: true,
            configurable: true,
        })
    }

    export const defineProperty = (
        obj: any,
        prop: string,
        attrs: PropertyDescriptor = { writable: true, enumerable: true, configurable: true },
    ): any => {
        return Object.defineProperty(obj, prop, attrs)
    }

    export const defineStaticProperty = (
        obj: any,
        prop: string,
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
        Object['setProperty'] = (mask: number, obj: any, prop: string, getter: any, setter: any): any => {
            if (mask & 8) {
                // accessor descriptor
                if (isFunction(getter)) {
                    global.get = getter
                } else {
                    delete global.get
                }
                if (isFunction(setter)) {
                    global.set = setter
                } else {
                    delete global.set
                }
                delete global.value
                delete global.writable
            } else {
                // data descriptor
                if (isFunction(getter)) {
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
}
