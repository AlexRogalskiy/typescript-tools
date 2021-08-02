import { HttpError } from './HttpError'

/**
 * Exception for 403 HTTP error.
 */
export class ForbiddenError extends HttpError {
    constructor(message?: string, httpName = 'ForbiddenError') {
        super(403, httpName, message)

        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
}
