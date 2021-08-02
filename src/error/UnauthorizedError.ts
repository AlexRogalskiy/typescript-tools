/**
 * Exception for 401 HTTP error.
 */
import { HttpError } from './HttpError'

export class UnauthorizedError extends HttpError {
    constructor(message?: string) {
        super(401, 'UnauthorizedError', message)

        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
}
