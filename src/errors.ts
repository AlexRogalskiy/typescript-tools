import { ErrorData, ErrorType } from '../typings/domain-types'
import { Logging } from './logging'
import { Commons } from './commons'

export namespace Errors {
    import errors = Logging.errors
    import defineProperty = Commons.defineProperty

    /**
     * ExtendableError
     * @desc Class representing extendable error
     */
    export class ExtendableError extends Error {
        /**
         * Extendable error constructor by input parameters
         * @param type initial input {@link ErrorType}
         * @param message initial input {@link string} message
         */
        constructor(readonly type: ErrorType, readonly message: string) {
            super(message)

            defineProperty(this, 'message', {
                configurable: true,
                enumerable: false,
                value: message,
                writable: true,
            })

            defineProperty(this, 'type', {
                configurable: true,
                enumerable: false,
                value: type,
                writable: true,
            })

            defineProperty(this, 'name', {
                configurable: true,
                enumerable: false,
                value: this.constructor.name,
                writable: true,
            })

            if (Error.hasOwnProperty('captureStackTrace')) {
                Error.captureStackTrace(this, this.constructor)
                return
            }

            defineProperty(this, 'stack', {
                configurable: true,
                enumerable: false,
                value: new Error(message).stack,
                writable: true,
            })
        }
    }

    /**
     * GeneralError
     * @desc Class representing general error
     */
    export class GeneralError extends ExtendableError {
        /**
         * Error arguments
         */
        readonly args: any[] = []

        /**
         * General error constructor by input parameters
         * @param type initial input {@link ErrorType}
         * @param message initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly type: ErrorType, readonly message: string, ...args: any[]) {
            super(type, message)
            this.args = args
        }

        /**
         * Updates current logging information
         * @protected
         */
        protected logMessage(): void {
            errors(this.message, this.args)
        }
    }

    /**
     * TypeError
     * @desc Class representing type error
     */
    export class TypeError extends GeneralError {
        /**
         * Type error constructor by input parameters
         * @param message initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly message: string, ...args: any[]) {
            super(ErrorType.type_error, message, args)
        }
    }

    /**
     * ValueError
     * @desc Class representing value error
     */
    export class ValueError extends GeneralError {
        /**
         * Value error constructor by input parameters
         * @param message initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly message: string, ...args: any[]) {
            super(ErrorType.value_error, message, args)
        }
    }

    /**
     * ValidationError
     * @desc Class representing validation error
     */
    export class ValidationError extends GeneralError {
        /**
         * Validation error constructor by input parameters
         * @param message initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly message: string, ...args: any[]) {
            super(ErrorType.validation_error, message, args)
        }
    }

    /**
     * UnsupportedLanguageError
     * @desc Class representing unsupported language error
     */
    export class UnsupportedLanguageError extends GeneralError {
        /**
         * Unsupported language error constructor by input parameters
         * @param lang: initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly lang: string, ...args: any[]) {
            super(ErrorType.general_error, `Unsupported language: ${lang}`, args)
        }
    }

    export const newError = (type: ErrorType, message: string): ErrorData => {
        return { type, message }
    }

    export const typeError = (message: string, ...args: any[]): TypeError => {
        return new TypeError(message, args)
    }

    export const valueError = (message: string, ...args: any[]): ValueError => {
        return new ValueError(message, args)
    }

    export const validationError = (message: string, ...args: any[]): ValidationError => {
        return new ValidationError(message, args)
    }
}
