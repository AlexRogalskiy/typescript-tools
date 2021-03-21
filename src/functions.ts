import _ from 'lodash'

import { Callback, Executor, Supplier } from '../typings/function-types'
import { Checkers } from './checkers'
import { Errors } from './errors'
import { Utils } from './utils'

export namespace Functions {
    import Commons = Utils.Commons
    import isArray = Checkers.isArray
    import isFunction = Checkers.isFunction
    import typeError = Errors.typeError
    import valueError = Errors.valueError
    import defineProperty = Utils.Commons.defineProperty

    export const props = (() => {
        const props = {
            proto: {
                bind: 'bind',
            },
        }

        /**
         * Creates binding context for function input parameters
         */
        if (!isFunction(Function.prototype[props.proto.bind])) {
            Commons.defineProperty(Function.prototype, props.proto.bind, {
                value(obj, ...args) {
                    const slice = [].slice,
                        args_ = slice.call(args, 1),
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

    export const composeAsync = async (...funcArgs) => async value =>
        // eslint-disable-next-line github/no-then
        await funcArgs.reduce((acc, val) => acc.then(val), Promise.resolve(value))

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
        if (!isFunction(callback)) {
            throw typeError(`incorrect type value: function < ${callback} >`)
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
            if (!isFunction(fn)) {
                throw valueError(`incorrect function value < ${fn} >`)
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
                if (isArray(calls[event])) {
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
            if (isFunction(item)) {
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
}
