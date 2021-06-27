export type Executor<T> = (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
) => void

/**
 * Creates promise that can be resolved or rejected externally by calling resolve and reject methods
 */
export class PromiseExecutor<T> {
    protected resolve!: (value: T | PromiseLike<T>) => void
    protected reject!: (reason: any) => void
    protected promise: Promise<T>

    constructor() {
        const executor: Executor<T> = (resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        }
        this.promise = new Promise<T>(executor)
    }
}
