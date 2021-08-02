import { HttpError } from './HttpError'

/**
 * Exception for 406 HTTP error.
 */
export class NotAcceptableError extends HttpError {
    constructor(message?: string) {
        super(406, 'NotAcceptableError', message)

        Object.setPrototypeOf(this, NotAcceptableError.prototype)
    }
}
