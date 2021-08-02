import { HttpError } from './HttpError'

/**
 * Exception for 404 HTTP error.
 */
export class NotFoundError extends HttpError {
    constructor(message?: string) {
        super(404, 'NotFoundError', message)

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}
