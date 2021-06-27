export class PromiseCancelledError extends Error {
    constructor(public reason?: Error) {
        super(reason?.message)
    }
}

export function isPromiseCancelledError(error: any): error is PromiseCancelledError {
    return error instanceof PromiseCancelledError
}
