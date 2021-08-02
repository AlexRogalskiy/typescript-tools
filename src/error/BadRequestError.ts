import { HttpError } from './HttpError'

/**
 * Exception for 400 HTTP error.
 */
export class BadRequestError extends HttpError {
    constructor(message?: string, httpName = 'BadRequestError') {
        super(400, httpName, message)

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
}
