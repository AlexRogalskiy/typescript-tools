import _ from 'lodash'

import { Callback, Executor, Supplier } from '../typings/function-types'
import { Checkers } from './checkers'
import { Exceptions } from './exceptions'

export namespace Functions {
    import isFunction = Checkers.isFunction
    import typeException = Exceptions.typeException
    import valueException = Exceptions.valueException

    export const composeAsync = async (...funcArgs) => async x =>
        // eslint-disable-next-line github/no-then
        await funcArgs.reduce((acc, val) => acc.then(val), Promise.resolve(x))

    export const mergeProps = <T>(...obj: any[]): T => {
        return _.mergeWith({}, ...obj, (o, s) => (_.isNull(s) ? o : s))
    }

    export const wait = async (ms: number, ...args: any[]): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms, args))
    }

    /*
     let clicky = {
         wasClicked: function() {},
         addListeners: function() {
             var self = this;
             $('.clicky').click(globals.toolset.proxy(this.wasClicked, this)); //this.click.bind(this);
         }
     };
    */
    export const proxy = <T>(callback: Callback, self: any, ...args: any[]): Supplier<T> => {
        if (!isFunction(callback)) {
            throw typeException(`incorrect type value: function < ${callback} >`)
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
                throw valueException(`incorrect function value < ${fn} >`)
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
}
