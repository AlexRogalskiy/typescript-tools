import { HttpError } from './HttpError'

/**
 * Exception for 500 HTTP error.
 */
export class InternalServerError extends HttpError {
    constructor(message: string, httpName = 'InternalServerError') {
        super(500, httpName, message)

        Object.setPrototypeOf(this, InternalServerError.prototype)
    }
}
