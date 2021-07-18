import _ from 'lodash'
import minimatch from 'minimatch'

import { Callback, Executor, GenericValueCallback, Processor, Supplier } from '../../typings/function-types'

import { Checkers, Errors, CommonUtils } from '..'

export namespace Functions {
    import normalize = CommonUtils.normalize
    import defineProperty = CommonUtils.defineProperty

    export interface EnumObject {
        [enumValue: number]: string
    }

    export const getEnumValues = (e: EnumObject): string[] => {
        return Object.keys(e).map(i => e[i])
    }

    export const promisify = async (func: any, owner = null): Promise<Callback> => {
        return async (...args) =>
            new Promise((resolve, reject) => {
                const cb = (err, result): void => (err ? reject(err) : resolve(result))
                func.call(owner, ...args, cb)
            })
    }

    export const DEFAULT_COERSIONS = {
        boolean: (val: string): boolean => val === 'true',
        array: (val: string): string[] => val.split(',').map(el => el.trim()),
        string: (val: string): string => val.replace(/\\n/g, '\n'),
        object: (val: string): any => JSON.parse(val),
        integer: parseInt,
    }

    // Example A:
    // defer(console.log, 'a'), console.log('b'); // logs 'b' then 'a'
    // Example B:
    //     document.querySelector('#someElement').innerHTML = 'Hello';
    //     longRunningFunction();
    // Browser will not update the HTML until this has finished
    //     defer(longRunningFunction);
    // Browser will update the HTML then run the function
    export const defer = (fn: any, ...args: any[]): NodeJS.Timeout => delay(fn, 1, ...args)

    export const delay = (fn: any, ms: number, ...args: any[]): NodeJS.Timeout => setTimeout(fn, ms, ...args)

    // const isEven = num => num % 2 === 0;
    // const isPositive = num => num > 0;
    // const isPositiveOrEven = either(isPositive, isEven);
    // isPositiveOrEven(4); // true
    // isPositiveOrEven(3); // true
    export const either = (f: any, g: any): any => {
        return (...args) => f(...args) || g(...args)
    }

    // const fn = arg => new Promise(resolve => {
    //     setTimeout(resolve, 1000, ['resolved', arg]);
    // });
    // const debounced = debouncePromise(fn, 200);
    // debounced('foo').then(console.log);
    // debounced('bar').then(console.log);
    // Will log ['resolved', 'bar'] both times
    export const debouncePromise = (fn: any, ms = 0): any => {
        let timeoutId
        const pending: any[] = []

        return async (...args) =>
            new Promise((res, rej) => {
                clearTimeout(timeoutId)
                timeoutId = setTimeout(() => {
                    const currentPending = [...pending]
                    pending.length = 0

                    // eslint-disable-next-line github/no-then
                    Promise.resolve(fn.apply(fn, args)).then(
                        data => {
                            for (const { resolve } of currentPending) {
                                resolve(data)
                            }
                        },
                        error => {
                            for (const { reject } of currentPending) {
                                reject(error)
                            }
                        },
                    )
                }, ms)

                pending.push({ resolve: res, reject: rej })
            })
    }

    // window.addEventListener(
    //     'resize',
    //     debounce(() => {
    //         console.log(window.innerWidth);
    //         console.log(window.innerHeight);
    //     }, 250)
    // ); // Will log the window dimensions at most every 250ms
    export const debounce2 = (fn: any, ms = 0): any => {
        let timeoutId

        return (...args): void => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => fn.apply(fn, args), ms)
        }
    }

    export const overrideThresholds = (key: string, ...args: any[]): any => {
        let thresholds = {}

        // First match wins
        Object.keys(args).some(pattern => {
            if (minimatch(normalize(key), pattern, { dot: true })) {
                thresholds = args[pattern]
                return true
            }
            return false
        })

        return thresholds
    }

    export const removeProps = (covObj: any, patterns: string[]): any => {
        const obj = {}

        for (const key of covObj) {
            const found = patterns.some(pattern => {
                return minimatch(normalize(key), pattern, { dot: true })
            })

            // if no patterns match, keep the key
            if (!found) {
                obj[key] = covObj[key]
            }
        }

        return obj
    }

    export const mixin = (destination: any, ...args: any[]): any => {
        for (let i = 1; i < args.length; i++) {
            const source = args[i]
            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    destination[key] = source[key]
                }
            }
        }

        return destination
    }

    export const coersions = (): Record<string, (arg: string) => unknown> => {
        return {
            boolean: (val: string): boolean => {
                if (val === 'true' || val === '') {
                    return true
                }
                if (val === 'false') {
                    return false
                }
                throw new Error(`Invalid boolean value: expected 'true' or 'false', but got '${val}'`)
            },
            array: (val: string): string[] => {
                if (val === '') {
                    return []
                }
                try {
                    return JSON.parse(val)
                } catch (err) {
                    return val.split(',').map(el => el.trim())
                }
            },
            object: (val: string): any => {
                if (val === '') {
                    return {}
                }
                try {
                    return JSON.parse(val)
                } catch (err) {
                    throw new Error(`Invalid JSON value: '${val}'`)
                }
            },
            string: (val: string): string => val,
            integer: parseInt,
        }
    }
    ;((): void => {
        const props = {
            proto: {
                bind: 'bind',
            },
        }

        /**
         * Creates binding context for function input parameters
         */
        if (!Function.prototype[props.proto.bind]) {
            defineProperty(Function.prototype, props.proto.bind, {
                value(obj, ...args) {
                    const slice = [].slice,
                        args_ = slice.call(args, 1),
                        // eslint-disable-next-line @typescript-eslint/no-this-alias
                        self = this,
                        nop = (): void => {
                            // empty
                        }

                    const bound = (...args): any => {
                        return self['apply'](
                            this instanceof nop ? this : obj || {},
                            args_.concat(slice.call(args)),
                        )
                    }

                    nop.prototype = self['prototype']
                    bound.prototype = new nop()
                    return bound
                },
            })
        }
    })()

    export const extend = (target: any, source: any): any => {
        for (const item of Object.getOwnPropertyNames(source)) {
            defineProperty(target, item, Object.getOwnPropertyDescriptor(source, item))
        }

        return target
    }

    export const inherits = (subType, superType): void => {
        const subProto = Object.create(superType.prototype)
        extend(subProto, subType.prototype)
        subType._super = superType.prototype
        subType.prototype = subProto
    }

    /**
     * @param {function} f - A function.
     * @param {function} g - A function.
     * @returns {function} A logical-and function of `f` and `g`.
     */
    export const and = (f, g): Processor<string, string> => {
        return filePath => f(filePath) && g(filePath)
    }

    /**
     * @param {function} f - A function.
     * @param {function} g - A function.
     * @param {function|null} h - A function.
     * @returns {function} A logical-or function of `f`, `g`, and `h`.
     */
    export const or = (f, g, h): Processor<string, string> => {
        return filePath => f(filePath) || g(filePath) || (h && h(filePath))
    }

    /**
     * @param {function} f - A function.
     * @returns {function} A logical-not function of `f`.
     */
    export const not = (f): Processor<string, boolean> => {
        return filePath => !f(filePath)
    }

    export const makeBackgroundable = <T extends (...args: any[]) => any>(
        pool: any,
        func: T,
    ): ((...funcArgs: Parameters<T>) => Promise<ReturnType<T>>) => {
        const funcName = func.name

        return (...args: Parameters<T>): ReturnType<T> => {
            return pool.exec(funcName, args)
        }
    }

    export const workerTs = (file: string, wkOpts: WorkerOptions): any => {
        wkOpts['eval'] = true
        if (!wkOpts['workerData']) {
            wkOpts['workerData'] = {}
        }
        wkOpts['workerData'].__filename = file
        return new Worker(
            `
            const wk = require('worker_threads');
            require('ts-node').register();
            let file = wk.workerData.__filename;
            delete wk.workerData.__filename;
            require(file);
        `,
            wkOpts,
        )
    }

    export const run = (fn, args): any => {
        const f = new Function(`return (${fn}).apply(null, arguments);`)
        return f.apply(f, args)
    }

    export const composeAsync = async (...funcArgs) => {
        return async value =>
            // eslint-disable-next-line github/no-then
            await funcArgs.reduce((acc, val) => acc.then(val), Promise.resolve(value))
    }

    export const mergeProps = <T>(...obj: unknown[]): T =>
        _.mergeWith({}, ...obj, (o, s) => {
            return _.isArray(s) && _.isArray(o) ? _.union(o, s) : _.isNull(s) ? o : s
        })

    export const wait = async (ms = 1000, ...args: any[]): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms, args))
    }

    export const wait2 = async (milliseconds: number): Promise<string> => {
        return new Promise(resolve => {
            if (isNaN(milliseconds)) {
                throw new Error('milliseconds not a number')
            }

            setTimeout(() => resolve('done!'), milliseconds)
        })
    }

    export const curry = (fn, ...args: any[]): any => {
        args = Array.prototype.slice.call(args, 0)
        return (...args2: any[]) => {
            return fn.apply(fn, args.concat(Array.prototype.slice.call(args2, 0)))
        }
    }

    /*
     let clicky = {
         wasClicked: function() {},
         addListeners: function() {
             var self = this;
             $('.clicky').click(proxy(this.wasClicked, this)); //this.click.bind(this);
         }
     };
    */
    export const proxy = <T>(callback: Callback, self: any, ...args: any[]): Supplier<T> => {
        if (!Checkers.isFunction(callback)) {
            throw Errors.typeError(`incorrect type value: function < ${callback} >`)
        }

        return () => callback.apply(self, args)
    }

    export const substitute = <T>(prevValue: any, newValue: any, property: string, array: T[]): any =>
        array.map(item => {
            if (item[property] === prevValue) {
                const result = { ...item }
                result[property] = newValue
                return result
            }
            return item
        })

    // let testDebounce = debounce(() => console.log(new Date().toString()), 1000);
    export const debounce = (func: any, timeout: number): Executor => {
        let timerId

        return () => {
            if (timerId) {
                clearTimeout(timerId)
                timerId = setTimeout(func, timeout)
            } else {
                timerId = setTimeout(func, timeout)
            }
        }
    }

    export const chainProvider = (() => {
        // store current callbacks
        const methods: any = []
        // keep a reference to current response
        let response = null
        // all queues start off unflushing
        let flushed = false

        const add = (fn: any): void => {
            // if the queue had been flushed, return immediately
            //otherwise push it on the queue
            if (!Checkers.isFunction(fn)) {
                throw Errors.valueError(`incorrect function value < ${fn} >`)
            }
            if (flushed) {
                fn(response)
            } else {
                methods.push(fn)
            }
        }

        const flush = (resp: any): void => {
            // note: flush only ever happens once
            if (flushed) return
            // store your response for subsequent calls after flush()
            response = resp
            // mark that it's been flushed
            flushed = true
            // shift 'em out and call 'em back
            while (methods[0]) {
                const fn = methods.shift()
                if (fn) {
                    fn(resp)
                }
            }
        }

        return {
            add,
            flush,
        }
    })()

    export const trace = (obj: any, method: string): void => {
        const original = obj[method]
        obj[method] = (...args: any[]) => {
            console.log(new Date(), '>>> Enteriпg method: ', method)
            const result = original.apply(obj, args)

            console.log(new Date(), '>>> Exitiпg method: ', method)
            return result
        }
    }

    export const addEventHandler = (that: any): void => {
        that.subscribe = function (event, callback) {
            const calls = this._callbacks || (this._callbacks = this._callbacks || {})
            calls[event] = calls[event] || []
            calls[event].push(callback)

            return this
        }

        that.unsubscribe = function (event) {
            const calls = this._callbacks || (this._callbacks = {})

            if (calls[event]) {
                delete calls[event]
            }

            return this
        }

        that.unsubscribe = function (event, callback) {
            const calls = this._callbacks || (this._callbacks = {})

            if (calls[event]) {
                if (Checkers.isArray(calls[event])) {
                    for (let i = 0; i < this._callbacks[event].length; i++) {
                        if (calls[event][i] === callback) {
                            calls[event].splice(i, 1)
                        }
                    }
                } else {
                    delete calls[event]
                }
            }

            return this
        }

        that.publish = function (...args: any[]) {
            const args_ = Array.prototype.slice.call(args, 0)
            const event = args_.shift()

            let list
            const calls = this._callbacks
            if (!calls) {
                return this
            }
            if (!(list = calls[event])) {
                return this
            }

            for (let i = 0, l = list.length; i < l; i++) {
                list[i].apply(this, args)
            }

            return this
        }
    }

    export const getFunctionArgs = (func): string[] => {
        // First match everything inside the function argument parenthesis
        const args = func.toString().match(/(function\s)?.*?\(([^)]*)\)/)[2]

        // Split the arguments string into an array comma delimited.
        return args
            .split(',')
            .map(arg => arg.replace(/\/\*.*\*\//, '').trim())
            .filter(arg => arg)
    }

    export const getFunctionArgTypes = (func): string[] => {
        // First match everything inside the function argument parenthesis
        const args = func.toString().match(/(function\s)?.*?\(([^)]*)\)/)[2]

        // Split the arguments string into an array comma delimited.
        return args
            .split(',')
            .map(arg => arg.replace(/\/\*.*\*\//, '').trim())
            .filter(arg => arg)
    }

    export const polymorph = (...args: any[]): any => {
        const len2func = {}

        const index = (item: any): string => {
            return item.length
        }

        for (const item of args) {
            if (Checkers.isFunction(item)) {
                len2func[index(item)] = item
            }
        }

        return (...args: any[]): any => {
            return len2func[index(args)](...args)
        }
    }

    export const callLater = (fn, context: any, ...args: any[]): void => {
        setTimeout(() => fn.apply(context, args), 2000)
    }

    export const createAdders = (): any[] => {
        const fns: any[] = []

        for (let i = 1; i < 4; i++) {
            ;(i => {
                fns[i] = n => {
                    return i + n
                }
            })(i)
        }

        return fns
    }

    export const pluck = <T>(name: string): any => {
        return (object: any): T => {
            return object[name]
        }
    }

    export const autoCurry = (() => {
        const toArray = (arr: any[], from = 0): any[] => {
            return Array.prototype.slice.call(arr, from)
        }

        const curry = (fn, ...args: any[]): any => {
            const args_ = toArray(args, 1)

            return (...args: any[]) => {
                return fn.apply(curry, args_.concat(toArray(args)))
            }
        }

        const autoCurry_ = (fn, numArgs: number): any => {
            numArgs = numArgs || fn.length

            const curry_ = (...args: any[]): any => {
                if (args.length < numArgs) {
                    const value = curry.apply(curry_, [fn].concat(toArray(args)))
                    return numArgs - args.length > 0 ? autoCurry_(value, numArgs - args.length) : value
                }

                return fn.apply(autoCurry_, args)
            }

            return curry_
        }

        return autoCurry_
    })()

    export const moduleProvider = (name: string, factory: any, root: any): void => {
        let prop

        if ((prop = root['define']) && prop['amd']) {
            prop([], function () {
                return factory
            })
        } else if ((prop = root['modules'])) {
            prop[name.toLowerCase()] = factory
        } else if (typeof exports === 'object') {
            /** @export */
            module.exports = factory
        } else {
            root[name] = factory
        }
    }

    export const tupleExists = <U, T>(val: [U, T | undefined]): val is [U, T] => {
        return exists(val[1])
    }

    export const exists = <T>(val: T | undefined): val is T => {
        return val != null
    }

    export const apply = <T, U>(...args: T[]): Processor<GenericValueCallback<T, U>, U> => {
        return (fn: (...args: T[]) => U) => fn(...args)
    }

    /**
     * Similar to OpenSeadragon.delegate, but it does not immediately call
     * the method on the object, returning a function which can be called
     * repeatedly to delegate the method. It also allows additional arguments
     * to be passed during construction which will be added during each
     * invocation, and each invocation can add additional arguments as well.
     *
     * @function
     * @param {Object} object
     * @param {Function} method
     * @param [args] any additional arguments are passed as arguments to the
     *  created callback
     * @returns {Function}
     */
    export const createCallback = (object, method, ...args: any[]): GenericValueCallback<any, any> => {
        const initialArgs: any[] = []

        for (const item of args) {
            initialArgs.push(item)
        }

        return (...args: any[]): any => {
            const args_ = initialArgs.concat([])

            for (const item of args) {
                args_.push(item)
            }

            return method.apply(object, args_)
        }
    }

    export const executeTask = async (task: any): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (task.length === 1) {
                task(err => {
                    if (err) {
                        return reject(err)
                    }
                    resolve()
                })
                return
            }

            const taskResult = task()
            if (typeof taskResult === 'undefined') {
                resolve()
                return
            }

            // eslint-disable-next-line github/no-then
            if (typeof taskResult.then === 'function') {
                // this is a promise returning task
                // eslint-disable-next-line github/no-then
                taskResult.then(resolve, reject)
                return
            }

            // this is a stream returning task
            taskResult.on('end', () => resolve())
            taskResult.on('error', err => reject(err))
        })
    }

    export const executeTasks = (...tasks: any[]): (() => Promise<void>) => {
        return async () => {
            for (const item of tasks) {
                await executeTask(item)
            }
        }
    }

    export const hasKey = <K extends string, T>(k: K, o: T): o is T & Record<K, unknown> => {
        return typeof o === 'object' && k in o
    }
}
