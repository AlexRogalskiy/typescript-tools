import _ from 'lodash'

import { Grid, Point } from '../../typings/domain-types'
import { Iterator, IteratorStep, Processor } from '../../typings/function-types'

import { Checkers, Errors } from '..'

export namespace CommonUtils {
    export type Fn<T> = (key: string) => T
    export type Color = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) & { _tag: '__Color__' }
    export type Empty = 0 & { _tag: '__Empty__' }

    export const nodeMajor = Number(process.versions.node.split('.')[0])

    export const getRandomId = (): string => {
        return Math.random().toString().slice(2)
    }

    /**
     * Cached fs operation wrapper.
     */
    export const cachedLookup = <T>(fn: (arg: string) => T): ((arg: string) => T) => {
        const cache = new Map<string, T>()

        return (arg: string): T => {
            if (!cache.has(arg)) {
                cache.set(arg, fn(arg))
            }

            return cache.get(arg) as T
        }
    }

    export const lerp = (k: number, a: number, b: number): number => (1 - k) * a + k * b

    export const clamp = (x: number, a: number, b: number): number => Math.max(a, Math.min(b, x))

    export const normalizeBy = (name: string): string => {
        if (!Checkers.isString(name)) {
            name = String(name)
        }

        if (/[^a-z0-9\-#$%&'*+.\\^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name')
        }

        return name.toLowerCase()
    }

    export const isInsideCircle = (x: number, y: number, r: number): boolean => {
        const l = 6
        let k = 0

        for (let dx = 0; dx < l; dx++)
            for (let dy = 0; dy < l; dy++) {
                const ux = x + (dx + 0.5) / l
                const uy = y + (dy + 0.5) / l

                if (ux * ux + uy * uy < r * r) k++
            }

        return k > l * l * 0.6
    }

    export const getCellPath = (n: number): Point[] => {
        const l = Math.ceil(Math.sqrt(n))

        const cells: any = []

        for (let x = -l; x <= l; x++)
            for (let y = -l; y <= l; y++) {
                const a = (Math.atan2(y, x) + (5 * Math.PI) / 2) % (Math.PI * 2)

                let r = 0

                while (!isInsideCircle(x, y, r + 0.5)) r++

                cells.push({ x, y, f: r * 100 + a })
            }

        return cells.sort((a, b) => a.f - b.f).slice(0, n)
    }

    export const silent = (handler: () => void | Promise<void>) => async (): Promise<any> => {
        const originalConsoleLog = console.log
        console.log = () => undefined

        try {
            return await handler()
        } finally {
            console.log = originalConsoleLog
        }
    }

    export const memoize = <V>(fn: Processor<string, V>): Processor<string, V> => {
        const cache = {}

        return (arg: string): V => {
            if (cache[arg] === undefined) {
                cache[arg] = fn(arg)
            }
            return cache[arg]
        }
    }

    export const getCircleSize = (c: Point[]): { max: Point; min: Point } => {
        const xs = c.map(p => p.x)
        const ys = c.map(p => p.y)

        return {
            max: { x: Math.max(0, ...xs), y: Math.max(0, ...ys) },
            min: { x: Math.min(0, ...xs), y: Math.min(0, ...ys) },
        }
    }

    export const getTopModuleName = (target: string): string => {
        const isScoped = target.startsWith('@')
        const numComponents = isScoped ? 2 : 1

        return target.split('/').slice(0, numComponents).join('/')
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

    export const isInside = (grid: Grid, point: Point): boolean =>
        point.x >= 0 && point.y >= 0 && point.x < grid.width && point.y < grid.height

    export const isInsideWithMargin = (grid: Grid, m: number, point: Point): boolean =>
        point.x >= -m && point.y >= -m && point.x < grid.width + m && point.y < grid.height + m

    export const qs = (obj: any): string =>
        Object.entries<any>(obj)
            .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
            .join('&')

    export const copyGrid = ({ width, height, data }: Grid): Grid => ({
        width,
        height,
        data: Uint8Array.from(data),
    })

    export const toAttribute = (o: any): string =>
        Object.entries(o)
            .filter(([, value]) => value !== null)
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ')

    export const removeInterpolatedPositions = <T extends Point>(arr: T[]): T[] =>
        arr.filter((u, i, arr) => {
            if (i - 1 < 0 || i + 1 >= arr.length) return true

            const a = arr[i - 1]
            const b = arr[i + 1]

            const ex = (a.x + b.x) / 2
            const ey = (a.y + b.y) / 2

            return !(Math.abs(ex - u.x) < 0.01 && Math.abs(ey - u.y) < 0.01)
        })

    export const isEmpty = (color: Color | Empty): color is Empty => color === 0

    export const gridEquals = (a: Grid, b: Grid): boolean => a.data.every((_, i) => a.data[i] === b.data[i])

    export const getCellsFromGrid = ({ width, height }: Grid): any =>
        Array.from({ length: width }, (_, x) =>
            Array.from({ length: height }, (_, y) => ({
                x,
                y,
            })),
        ).flat()

    export const createEmptyGrid = (width: number, height: number): Grid => ({
        width,
        height,
        data: new Uint8Array(width * height),
    })

    /**
     * return true if the grid is empty
     */
    export const isGridEmpty = (grid: Grid): boolean => grid.data.every(x => x === 0)

    // addMethod(this, "find", () => {})
    // addMethod(this, "find", (name) => {})
    // addMethod(this, "find", (first, last) => {})
    export const addMethod = (obj: any, name: string, fn: any, ...args: any[]): any => {
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
