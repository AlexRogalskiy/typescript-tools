import _ from 'lodash'

import { Callback, Executor, Supplier } from '../typings/function-types'
import { Checkers } from './checkers'
import { Exceptions } from './exceptions'

export namespace Functions {
    import isFunction = Checkers.isFunction
    import typeException = Exceptions.typeException
    import valueException = Exceptions.valueException

    export const composeAsync = async (...funcs) => async x =>
        // eslint-disable-next-line github/no-then
        await funcs.reduce((acc, val) => acc.then(val), Promise.resolve(x))

    export const mergeProps = <T>(...obj: unknown[]): T => {
        return _.mergeWith({}, ...obj, (o, s) => (_.isNull(s) ? o : s))
    }

    export const wait = async (ms: number, ...args: unknown[]): Promise<void> => {
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

    export const substitute = <T>(prevValue, newValue, property: string, arr: T[]): any =>
        arr.map(item => {
            if (item[property] === prevValue) {
                const result = { ...item }
                result[property] = newValue
                return result
            }
            return item
        })

    // let testDebounce = debounce(() => console.log(new Date().toString()), 1000);
    export const debounce = (func, ms: number): Executor => {
        let timerId
        return () => {
            if (timerId) {
                clearTimeout(timerId)
                timerId = setTimeout(func, ms)
            } else {
                timerId = setTimeout(func, ms)
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
}
