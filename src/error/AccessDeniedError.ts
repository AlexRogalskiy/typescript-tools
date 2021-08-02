/**
 * Thrown when route is guarded by @Authorized decorator.
 */
import { ForbiddenError } from './ForbiddenError'
import { Action } from '../../typings/domain-types'

export class AccessDeniedError extends ForbiddenError {
    constructor(action: Action) {
        super('AccessDeniedError')

        Object.setPrototypeOf(this, AccessDeniedError.prototype)

        const uri = `${action.request.method} ${action.request.url}`
        this.message = `Access is denied for request on ${uri}`
    }
}
