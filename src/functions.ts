import _ from 'lodash'

export namespace Functions {
    export const composeAsync = async (...funcs) => async x =>
        // eslint-disable-next-line github/no-then
        await funcs.reduce((acc, val) => acc.then(val), Promise.resolve(x))

    export const mergeProps = <T>(...obj: unknown[]): T => {
        return _.mergeWith({}, ...obj, (o, s) => (_.isNull(s) ? o : s))
    }

    export const wait = async (ms: number, ...args: unknown[]): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms, args))
    }

    // Use a closure to bind the outer scope's reference to this into the newly created inner scope.
    export const proxy = (callback, self, ...args) => {
        return () => {
            return callback.apply(self, args)
        }
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
}
