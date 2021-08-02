/**
 * Thrown when authorizationChecker function is not defined in routing-controllers options.
 */
import { InternalServerError } from './InternalServerError'

export class AuthorizationCheckerNotDefinedError extends InternalServerError {
    constructor() {
        super(
            'Cannot use @Authorized decorator. Please define authorizationChecker function in routing-controllers action before using it.',
            'AuthorizationCheckerNotDefinedError',
        )
        Object.setPrototypeOf(this, AuthorizationCheckerNotDefinedError.prototype)
    }
}
