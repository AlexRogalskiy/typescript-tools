import * as _ from 'lodash'
import { isBoolean, isInteger, isNull, isNumber, isString, mergeWith, union } from 'lodash'
import * as crypto from 'crypto'
import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

import { CellPosition, Grid, IMousePosition, Point } from '../../typings/domain-types'
import { IServiceInjector, Iterator, IteratorStep, Processor } from '../../typings/function-types'

import { Checkers, Errors, Objects } from '..'
import { Optional } from '../../typings/standard-types'
import { createValueToken } from '../../tools/InjectionToken'

export namespace CommonUtils {
    export type Fn<T> = (key: string) => T
    export type Color = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) & { _tag: '__Color__' }
    export type Empty = 0 & { _tag: '__Empty__' }

    const RANDOMNESS_PLACEHOLDER_STRING = 'RANDOMNESS_PLACEHOLDER'

    const isWindowsOS = process.platform.startsWith('win')
    const npm = isWindowsOS ? 'npm.cmd' : 'npm'

    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    export const glob = require('util').promisify(require('glob'))

    export const joinPath = (p1: string, p2: string): string => {
        p1 = p1.replace(/\/$/, '')
        p2 = p2.replace(/^\//, '')
        return `${p1}/${p2}`
    }

    export const splitArgs = (args: any[]): any => {
        const obj = {}

        for (const arg of args) {
            const split = arg.split('=')
            obj[split[0].trim()] = split.length > 1 ? split[1].trim() : null
        }

        return obj
    }

    export const findPosition = (position: CellPosition): ((position: CellPosition) => boolean) => {
        return p => p.idx === position.idx && p.rowIdx === position.rowIdx
    }

    const enum OperationMode {
        REPLACE = 'replace',
        CONCAT = 'concat',
        MERGE = 'merge',
        OR = 'or',
        AND = 'and',
        UNION = 'union',
    }

    export const getDelta = (
        startPosition: Optional<IMousePosition>,
        currentPosition: Optional<IMousePosition>,
    ): Optional<number> => {
        if (!startPosition || !currentPosition) {
            return null
        }

        const xDelta = Math.abs(startPosition.x - currentPosition.x)
        const yDelta = Math.abs(startPosition.y - currentPosition.y)

        return Math.max(xDelta, yDelta)
    }

    export const getValue = (value: string | { displayName: string }): string => {
        if (value === null || value === undefined) {
            return ''
        }
        return typeof value === 'string' ? value : value.displayName
    }

    export const isValuesEqual = <T extends string | boolean | number>(
        first: T | null | undefined,
        second: T | null | undefined,
        defaultValue?: T,
    ): boolean => {
        return (first ?? defaultValue) === (second ?? defaultValue)
    }

    export const isPropertiesEqual = <T>(first: T, second: T): boolean => {
        if (first === null || second === null || typeof first !== 'object' || typeof second !== 'object') {
            return false
        }

        const firstProperties = Object.entries(first)
        const secondProperties = Object.entries(second)

        if (firstProperties.length !== secondProperties.length) {
            return false
        }

        for (const [key, value] of firstProperties) {
            if (second[key as keyof T] !== value) {
                return false
            }
        }

        return true
    }

    export const getMIME = (binary: string): Optional<string> => {
        if (binary.length === 0) {
            return null
        }

        if (binary.startsWith('/')) {
            return 'image/jpeg'
        } else if (binary.startsWith('i')) {
            return 'image/png'
        } else if (binary.startsWith('R')) {
            return 'image/gif'
        } else if (binary.startsWith('U')) {
            return 'image/webp'
        }

        return null
    }

    /**
     * Help to create unique name for connection
     * @param  {string} baseName
     * @param  {string[]} connectionNames
     * @returns string
     */
    export const getUniqueConnectionName = (baseName: string, connectionNames: string[]): string => {
        let index = 1
        let name = baseName

        while (true) {
            if (!connectionNames.includes(name)) {
                break
            }
            name = `${baseName} (${index})`
            index++
        }

        return name
    }

    export const withTimestamp = (version: any): string => {
        return `${version}.${new Date()
            .toISOString()
            .substr(0, 19)
            .replace('T', '')
            .split(/[-:]+/)
            .join('')
            .slice(0, -2)}`
    }

    export const isEven = (nr: number): boolean => nr % 2 === 0

    export const asString = (val: any, defval: any): string => (val == null ? defval : `${val}`)

    export const pipe = (...fns): any => {
        return (val: any): any => {
            // eslint-disable-next-line github/no-then
            fns.reduce((p, fn) => p.then(fn), Promise.resolve(val))
        }
    }

    export const toDate = (ms: number): Date => new Date(ms)

    export const toCronTab = (date: Date): string => `${date.getMinutes()} ${date.getHours()} * * *`

    export const msToCronTab = pipe(toDate, toCronTab)

    export const _shift = (nr: number, precision: number, reverse: boolean): number => {
        const numArray = asString(nr, null).split('e')
        precision = reverse ? -precision : precision
        // return +(numArray[0] + 'e' + (numArray[1] ? +numArray[1] + precision : precision));
        return +`${numArray[0]}e${numArray[1] ? +numArray[1] + precision : precision}`
    }

    export const createObj = (keys: PropertyKey[], values: any): any => {
        const obj = {}

        for (const key of keys) {
            const index = keys.indexOf(key)
            if (key != null) {
                obj[key] = values[index]
            }
        }

        return obj
    }

    export async function callAsyncFunction<T>(args: any, source: string): Promise<T> {
        const fn = new AsyncFunction(...Object.keys(args), source)
        return fn(...Object.values(args))
    }

    export const AsyncFunction = Object.getPrototypeOf(async () => null).constructor

    export const operators = {
        '+': nr => {
            return (value = 0) => value + nr
        },
        '-': nr => {
            return (value = 0) => value - nr
        },
        '=': (val: number) => {
            return (oldval: number) => (oldval == null ? val : oldval)
        },
    }

    export const DEF_HASHES = ['sha256', 'sha512', 'sha384', 'md5']

    export const HASH_ALGOS = crypto.getHashes().map(algo => algo.toLowerCase())

    export const DEFAULT_HASH = DEF_HASHES.find(hash => HASH_ALGOS.includes(hash)) || HASH_ALGOS[0]

    export const promisify = (fn: any): any => {
        return async (...args: any): Promise<any> => {
            return new Promise((resolve, reject) => {
                fn.call(fn, ...args, (err, res) => {
                    if (err) reject(err)
                    else resolve(res)
                })
            })
        }
    }

    export const createObjects = (keys: PropertyKey[], values: any[]): any[] =>
        values.map(vals => createObj(keys, vals))

    export const getParent = (node: any, level: number): any => {
        const parent = node.parent
        return parent.level >= level ? getParent(node.parent, level) : parent
    }

    export const roundNumber = (nr: number, precision: number): number =>
        _shift(Math.round(_shift(nr, precision, false)), precision, true)

    export const bindFunctions = <T>(object: T, keys: (keyof T)[]): void => {
        for (const key of keys) {
            const value = object[key]

            if (typeof value === 'function') {
                object[key] = value.bind(object)
            }
        }
    }

    export const getFilteredRoles = <T>(roles: T[], filter: string): T[] => {
        return roles
            .filter(
                role =>
                    role['roleName']?.toLowerCase().includes(filter.toLowerCase()) &&
                    role['roleId'] !== 'admin',
            )
            .sort((a, b) => (a['roleName'] ?? '').localeCompare(b['roleName'] ?? ''))
    }

    export const ServiceInjectorToken = createValueToken<IServiceInjector>('IServiceInjector')

    export const getFuncByBehaviour = (behaviour: string): any => {
        if (behaviour === OperationMode.REPLACE) {
            return (_, y) => y
        } else if (behaviour === OperationMode.CONCAT) {
            return function (x, y) {
                x = _.isArray(x) || _.isString(x) ? x : _.isUndefined(x) ? [] : [x]
                y = _.isArray(y) || _.isString(y) ? y : _.isUndefined(y) ? [] : [y]
                return x.concat(y)
            }
        } else if (behaviour === OperationMode.UNION) {
            return function (x, y) {
                if (!_.isArray(x) && !_.isArray(y)) {
                    return undefined
                }
                x = _.isArray(x) || _.isString(x) ? x : _.isUndefined(x) ? [] : [x]
                y = _.isArray(y) || _.isString(y) ? y : _.isUndefined(y) ? [] : [y]
                return _.union(x, y)
            }
        } else if (behaviour === OperationMode.MERGE) {
            return undefined
        } else if (behaviour === OperationMode.OR) {
            return function (x, y) {
                return x || y
            }
        } else if (behaviour === OperationMode.AND) {
            return function (x, y) {
                return x && y
            }
        }
    }

    export const loadJsonObject = (filename: string): any => {
        return JSON.parse(fs.readFileSync(filename, 'utf8'))
    }

    export const stripQuotes = (value: string): string => {
        if (value) {
            value = value.replace(/(^")|("$)/g, '')
            value = value.replace(/(^')|('$)/g, '')
        }

        return value
    }

    export const noConsoleLog = async <T>(callback: () => Promise<T>): Promise<T> => {
        const oldConsoleLog = console.log

        console.log = () => undefined

        try {
            return await callback()
        } finally {
            console.log = oldConsoleLog
        }
    }

    export const distinctByProperty = <T>(arr: T[], propertySelector: (item: T) => any): T[] => {
        const result: T[] = []
        const set = new Set()

        for (const item of arr.filter(i => i)) {
            const selector = propertySelector(item)

            if (set.has(selector)) {
                continue
            }

            set.add(selector)
            result.push(item)
        }

        return result
    }

    export async function getPackageJson(sourceFolder = process.cwd()): Promise<string> {
        return JSON.parse(await fs.readFile(path.join(sourceFolder, 'package.json'), { encoding: 'utf-8' }))
    }

    export async function setPackageJson(value: any, destFolder = process.cwd()): Promise<string> {
        return await fs.writeFile(path.join(destFolder, 'package.json'), JSON.stringify(value, null, 4))
    }

    export const esc = (s: any): string => JSON.stringify(s).slice(1, -1)

    export const nodeMajor = Number(process.versions.node.split('.')[0])

    export const getType = (value: any): string => {
        if (isNumber(value) && !isInteger(value)) {
            return isBoolean(value) ? 'boolean' : 'number'
        }
        if (isInteger(value)) {
            return isBoolean(value) ? 'boolean' : 'integer'
        }

        return isBoolean(value) ? 'boolean' : isString(value) ? 'string' : 'null'
    }

    export const add = (a: any, b: any): any => {
        if (Array.isArray(a) || Array.isArray(b)) {
            return [...new Set([].concat(a, b))]
        }

        return a + b
    }

    export const sub = (a: any, b: any): any => {
        if (Array.isArray(a)) {
            const result = new Set(a)

            // filter b items from a
            if (Array.isArray(b)) {
                for (const item of b) {
                    result.delete(item)
                }
            } else {
                result.delete(b)
            }

            return [...result]
        }

        return a - b
    }

    export const stringify = (value: any): string => {
        if (typeof value === 'string') {
            return JSON.stringify(value)
        } else if (typeof value === 'undefined' || typeof value === 'boolean' || typeof value === 'number') {
            return String(value)
        } else if (typeof value === 'object') {
            if (value === null) {
                return String(value)
            }

            if (value instanceof RegExp) {
                return String(value)
            }

            if (Array.isArray(value)) {
                return `[${value.map(stringify)}]`
            }

            return `{${Objects.keys(value)
                .map(k => `${k}:${stringify(value[k])}`)
                .join(',')}}`
        }

        return ''
    }

    /**
     * @param {string} value
     * @param {number} length
     * @return {number}
     */
    export const hash = (value: string, length: number): number => {
        return (
            (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) <<
                2) ^
            charat(value, 3)
        )
    }

    /**
     * @param {string} value
     * @param {number} index
     * @return {number}
     */
    export const charat = (value: string, index: number): number => {
        return value.charCodeAt(index) | 0
    }

    export const spawnAsync = async (command: string, options?: SpawnOptionsWithoutStdio): Promise<any> => {
        return await new Promise((resolve, reject) => {
            const child: any = spawn(command, options)

            //child.stdout.on('data', d => console.log(d.toString()));
            //child.stderr.on('data', d => console.log(d.toString()));

            let result
            if (child.stdout) {
                result = ''
                child.stdout.on('data', chunk => {
                    result += chunk.toString()
                })
            }

            child.on('error', reject)
            child.on('close', (code, signal) => {
                if (code !== 0) {
                    if (result) console.log(result)
                    reject(new Error(`Exited with ${code || signal}`))
                    return
                }
                resolve(result)
            })
        })
    }

    export const npmCommand = async (options: SpawnOptionsWithoutStdio): Promise<any> => {
        // await spawnAsync(npm, ['--loglevel', 'warn', 'pack'], {
        //     stdio: 'inherit',
        //     cwd: builderPath,
        // });
        return await spawnAsync(npm, options)
    }

    export const getRandomId = (): string => {
        return Math.random().toString().slice(2)
    }

    export const dirtyWalk = (node, fn): void => {
        if (!node || !node.type) {
            return
        }

        fn(node)

        for (const value of Object.values(node)) {
            if (Array.isArray(value)) {
                for (const elem of value) {
                    dirtyWalk(elem, fn)
                }
            } else {
                dirtyWalk(value, fn)
            }
        }
    }

    export const randomness = (repeat = 6): string =>
        Math.floor(Math.random() * 0x7fffffff)
            .toString(16)
            .repeat(repeat)
            .slice(0, RANDOMNESS_PLACEHOLDER_STRING.length)

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

    export const valuesToSuggestions = (context, values, related): any => {
        const suggestions = new Set()
        const addValue = (value: any): any => {
            if (typeof value === 'string') {
                suggestions.add(JSON.stringify(value))
            } else if (typeof value === 'number') {
                suggestions.add(String(value))
            }
        }

        if (context === '' || context === 'path') {
            for (const value of values) {
                if (Array.isArray(value)) {
                    for (const item of value) {
                        if (Checkers.isPlainObject(item)) {
                            addToSet(suggestions, Object.keys(item))
                        }
                    }
                } else if (Checkers.isPlainObject(value)) {
                    addToSet(suggestions, Object.keys(value))
                }
            }
        } else if (context === 'key') {
            for (const value of values) {
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    // eslint-disable-next-line github/array-foreach
                    Object.keys(value).forEach(addValue)
                }
            }
        } else if (context === 'value') {
            for (const value of values) {
                if (Array.isArray(value)) {
                    for (const item of value) {
                        addValue(item)
                    }
                } else {
                    addValue(value)
                }
            }
        } else if (context === 'in-value') {
            for (const value of values) {
                if (Array.isArray(value)) {
                    for (const item of value) {
                        addValue(item)
                    }
                } else if (Checkers.isPlainObject(value)) {
                    // eslint-disable-next-line github/array-foreach
                    Object.keys(value).forEach(addValue)
                } else {
                    addValue(value)
                }
            }
        } else if (context === 'var') {
            for (const value of values) {
                suggestions.add(`$${value}`)
            }
        } else if (context === 'value-subset') {
            for (const value of values) {
                if (Array.isArray(value)) {
                    for (const item of value) {
                        addValue(item)
                    }
                } else {
                    addValue(value)
                }
            }

            // delete used
            for (const arr of related) {
                for (const value of arr) {
                    if (typeof value === 'string' || typeof value === 'number') {
                        suggestions.delete(JSON.stringify(value))
                    }
                }
            }
        }

        return [...suggestions]
    }

    export const addToSet = <T>(set: Set<T>, value: any): Set<T> => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    set.add(item)
                }
            } else {
                set.add(value)
            }
        }

        return set
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
        mergeWith({}, ...obj, (o, s) => {
            return Array.isArray(s) && Array.isArray(o) ? union(o, s) : isNull(s) ? o : s
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
            const _pattern =
                /^\s*\(?\s*(([a-z_$][a-z0-9_$]*)+([, ]+[a-z_$][a-z0-9_$]*)*)*\s*\)?\s*=>\s*(.*)$/i
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
