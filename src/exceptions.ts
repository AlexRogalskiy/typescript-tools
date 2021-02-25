import { ErrorType } from '../typings/domain-types'
import { Logging } from './logging'

export namespace Exceptions {
    import errors = Logging.errors

    export type ErrorMessage = {
        name: ErrorType
        message: string
    }

    export class GeneralException {
        constructor(private readonly message: string, private readonly args: any[]) {
            this.message = message
            this.args = args
        }

        protected logMessage(): void {
            errors(this.message, this.args)
        }
    }

    export class UnsupportedLanguageException extends GeneralException {
        constructor(lang: string, ...args: any[]) {
            super(`Unsupported language: ${lang}`, args)
        }
    }

    export const exception = (name: ErrorType, message: string): ErrorMessage => {
        return { name, message }
    }

    export const typeException = (message: string): ErrorMessage => {
        return { name: ErrorType.type_error, message }
    }

    export const valueException = (message: string): ErrorMessage => {
        return { name: ErrorType.value_error, message }
    }
}
