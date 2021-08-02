/**
 * Caused when user query parameter is invalid (cannot be parsed into selected type).
 */
import { BadRequestError } from './BadRequestError'

export class InvalidParamError extends BadRequestError {
    constructor(value: any, parameterName: string, parameterType: string) {
        super(
            `Given parameter ${parameterName} is invalid. Value (${JSON.stringify(
                value,
            )}) cannot be parsed into ${parameterType}.`,
            'ParamNormalizationError',
        )

        Object.setPrototypeOf(this, InvalidParamError.prototype)
    }
}
