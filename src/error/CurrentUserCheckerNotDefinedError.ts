/**
 * Thrown when currentUserChecker function is not defined in routing-controllers options.
 */
import { InternalServerError } from './InternalServerError'

export class CurrentUserCheckerNotDefinedError extends InternalServerError {
    constructor() {
        super(
            'Cannot use @CurrentUser decorator. Please define currentUserChecker function in routing-controllers action before using it.',
            'CurrentUserCheckerNotDefinedError',
        )

        Object.setPrototypeOf(this, CurrentUserCheckerNotDefinedError.prototype)
    }
}
