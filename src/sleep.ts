import { Optional } from '../typings/standard-types'

type BackOff = (iter: number, previous: number) => Optional<number>
type DoneCheck<T> = (input: T) => boolean

export const sleep = async (milliseconds: number): Promise<void> =>
    new Promise(r => setTimeout(r, milliseconds))

export const sleepSeconds = async (seconds: number): Promise<void> => sleep(seconds * 1000)

export const retry = <T, A>(
    backOff: BackOff,
    isComplete: DoneCheck<T>,
    action: (...args: A[]) => Promise<T>,
): any => {
    let count = 0
    let wait = 0
    const func = async (..._args: A[]): Promise<T> => {
        const nextWait = backOff(count++, wait)
        if (nextWait === null || nextWait === undefined) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('timeout')
        }
        wait = nextWait
        await sleepSeconds(wait)
        const response = await action(..._args)

        if (isComplete(response)) {
            return response
        }

        return func(..._args)
    }
    return func
}
