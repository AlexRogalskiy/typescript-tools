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
}
