interface IPromiseFunc<T> {
    (): Promise<T>
}

export async function promiseSerial<T>(promises: IPromiseFunc<T>[]): Promise<PromiseSettledResult<T>[]> {
    const defaultResults: PromiseSettledResult<T>[] = []
    return promises.reduce(async (promise, func) => {
        // eslint-disable-next-line github/no-then
        return promise.then(async result => {
            return (
                func()
                    // eslint-disable-next-line github/no-then
                    .then(funcResult => {
                        return result.concat({
                            status: 'fulfilled',
                            value: funcResult,
                        })
                    })
                    // eslint-disable-next-line github/no-then
                    .catch(e => {
                        return result.concat({
                            status: 'rejected',
                            reason: e,
                        })
                    })
            )
        })
    }, Promise.resolve(defaultResults))
}
