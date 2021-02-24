import _ from 'lodash'
import { Callback, Executor, Supplier } from '../typings/function-types'
import { Checkers } from './checkers'
import { Exceptions } from './exceptions'

export namespace Functions {
    import isFunction = Checkers.isFunction;
    import typeException = Exceptions.typeException;

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
     var clicky = {
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

    //var testDebounce = debounce(() => console.log(new Date().toString()), 1000);
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
}
