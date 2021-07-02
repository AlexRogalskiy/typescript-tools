const noop = (): void => {}

export const sleep = async (ms: number, fn = noop): Promise<void> =>
    new Promise(resolve => {
        setTimeout(() => resolve(fn()), ms)
    })
