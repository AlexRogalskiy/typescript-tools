import { CancellablePromise } from './CancellablePromise'

type PromiseExecutor<T> = (resolve: (value: T) => void, reject: (reason?: any) => void) => void

/**
 * wait timeout milliseconds then start to execute promise.
 * During the timeout the execution of promise can be cancelled.
 *
 * @param executor
 * @param timeout
 */
export async function deferPromise<T>(
    executor: PromiseExecutor<T>,
    timeout: number,
): Promise<CancellablePromise<T>> {
    return new CancellablePromise<T>((resolve, reject) => {
        const token = setTimeout(() => executor(resolve, reject), timeout)
        return () => {
            clearTimeout(token)
        }
    })
}

export async function cancellableTimeout(timeout: number): Promise<CancellablePromise<void>> {
    return new CancellablePromise<void>(resolve => {
        const token = setTimeout(() => resolve(), timeout)
        return () => {
            clearTimeout(token)
        }
    })
}
