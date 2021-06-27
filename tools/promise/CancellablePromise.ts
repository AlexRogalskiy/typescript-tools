import { PromiseCancelledError } from './PromiseCancelledError'

export type CancellableExecutor<T> = (
    resolve: (value: T) => void,
    reject: (reason?: any) => void,
) => undefined | (() => void) // returns nothing or cancel function

/**
 * When cancelled the promise will be rejected with the reason PROMISE_CANCELLED
 *
 * 'then' method returns the ordinary promise
 */
export class CancellablePromise<T> extends Promise<T> {
    private readonly _resolve: (value: T | PromiseLike<T>) => void
    private readonly _reject: (reason?: any) => void
    private readonly _cancel?: () => void

    constructor(executor: CancellableExecutor<T>) {
        let _resolve!: (value: T | PromiseLike<T>) => void
        let _reject!: (reason?: any) => void
        super((resolve, reject) => {
            _resolve = resolve
            _reject = reject
        })
        this._resolve = _resolve
        this._reject = _reject
        try {
            this._cancel = executor(this._resolve, this._reject)
        } catch (e) {
            this._reject(e)
        }
    }

    cancel(): void {
        if (this._cancel) {
            this._cancel()
        }
        this._reject(new PromiseCancelledError())
    }
}
