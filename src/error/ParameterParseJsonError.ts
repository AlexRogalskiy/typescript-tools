/**
 * Caused when user parameter is invalid json string and cannot be parsed.
 */
import { BadRequestError } from './BadRequestError'

export class ParameterParseJsonError extends BadRequestError {
    constructor(parameterName: string, value: any) {
        super(
            `Given parameter ${parameterName} is invalid. Value (${JSON.stringify(
                value,
            )}) cannot be parsed into JSON.`,
            'ParameterParseJsonError',
        )

        Object.setPrototypeOf(this, ParameterParseJsonError.prototype)
    }
}
