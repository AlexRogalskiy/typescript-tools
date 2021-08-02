/**
 * Thrown when parameter is required, but was missing in a user request.
 */
import { BadRequestError } from './BadRequestError'
import { Action, ParamMetadata } from '../../typings/domain-types'

export class ParamRequiredError extends BadRequestError {
    constructor(action: Action, param: ParamMetadata) {
        super(undefined, 'ParamRequiredError')

        Object.setPrototypeOf(this, ParamRequiredError.prototype)

        let paramName: string
        if (param.type === 'param') {
            paramName = `Parameter "${param.name}" is`
        } else if (param.type === 'body') {
            paramName = 'Request body is'
        } else if (param.type === 'body-param') {
            paramName = `Body parameter "${param.name}" is`
        } else if (param.type === 'query') {
            paramName = `Query parameter "${param.name}" is`
        } else if (param.type === 'header') {
            paramName = `Header "${param.name}" is`
        } else if (param.type === 'file') {
            paramName = `Uploaded file "${param.name}" is`
        } else if (param.type === 'files') {
            paramName = `Uploaded files "${param.name}" are`
        } else if (param.type === 'session') {
            paramName = 'Session is'
        } else if (param.type === 'cookie') {
            paramName = 'Cookie is'
        } else {
            paramName = 'Parameter is'
        }

        const uri = `${action.request.method} ${action.request.url}` // todo: check it it works in koa
        this.message = `${paramName} required for request on ${uri}`
    }
}
