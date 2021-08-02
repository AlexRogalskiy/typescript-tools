import { HttpError } from './HttpError'

/**
 * Exception for todo HTTP error.
 */
export class MethodNotAllowedError extends HttpError {
    constructor(message?: string) {
        super(405, 'MethodNotAllowedError', message)

        Object.setPrototypeOf(this, MethodNotAllowedError.prototype)
    }
}
