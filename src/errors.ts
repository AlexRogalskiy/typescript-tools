import { DbErrorType, ErrorData, ErrorType } from '../typings/enum-types'

import { Utils } from './utils'
import { Checkers } from './checkers'
import { Logging } from './logging'

export namespace Errors {
    import Commons = Utils.Commons
    import errorLogs = Logging.errorLogs

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

            Commons.defineProperty(this, 'message', {
                configurable: true,
                enumerable: false,
                value: message,
                writable: true,
            })

            Commons.defineProperty(this, 'type', {
                configurable: true,
                enumerable: false,
                value: type,
                writable: true,
            })

            Commons.defineProperty(this, 'name', {
                configurable: true,
                enumerable: false,
                value: this.constructor.name,
                writable: true,
            })

            if (Checkers.hasProperty(Error, 'captureStackTrace')) {
                Error.captureStackTrace(this, this.constructor)
                return
            }

            Commons.defineProperty(this, 'stack', {
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
            errorLogs(this.message, this.args)
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

    /**
     * RequestError
     * @desc Class representing request error
     */
    export class RequestError extends GeneralError {
        /**
         * Request error constructor by input parameters
         * @param message initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly message: string, ...args: any[]) {
            super(ErrorType.request_error, message, args)
        }
    }

    /**
     * ResponseError
     * @desc Class representing request error
     */
    export class ResponseError extends GeneralError {
        /**
         * Response error constructor by input parameters
         * @param message initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly message: string, ...args: any[]) {
            super(ErrorType.response_error, message, args)
        }
    }

    /**
     * UnsupportedParameterError
     * @desc Class representing unsupported parameter error
     */
    export class UnsupportedParameterError extends GeneralError {
        /**
         * Unsupported parameter error constructor by input parameters
         * @param parameter: initial input {@link string} message
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly parameter: string, ...args: any[]) {
            super(ErrorType.parameter_error, `Unsupported parameter: ${parameter}`, args)
        }
    }

    /**
     * QueryParseError
     * @desc Class representing query parse error
     */
    export class QueryParseError extends GeneralError {
        /**
         * Unsupported language error constructor by input parameters
         * @param message initial input {@link string} message
         * @param start initial input {@link number} start position
         * @param end initial input {@link number} end position
         * @param args initial input {@link Array} of arguments
         */
        constructor(readonly message: string, readonly start: string, readonly end: string, ...args: any[]) {
            super(ErrorType.parser_error, message, args)
        }
    }

    /**
     * DbClientError
     * @desc Class representing database client errors
     */
    export class DbClientError extends GeneralError {
        readonly statusCode: number

        constructor(readonly message: string, readonly code: DbErrorType, ...args: any[]) {
            super(ErrorType.db_error, message, args)
            this.code = code
            this.statusCode = DbClientError.getStatusCodeFromCode(code)
        }

        static getStatusCodeFromCode(code: string): number {
            if (code === DbErrorType.NotFound) {
                return 404
            } else if (code === DbErrorType.Conflict) {
                return 409
            } else if (code === DbErrorType.UnprocessableEntity) {
                return 422
            }

            return 500
        }
    }

    export const unprocessableEntityDbError = (message: string): DbClientError => {
        return new DbClientError(message, DbErrorType.UnprocessableEntity)
    }

    export const notFoundDbError = (message: string): DbClientError => {
        return new DbClientError(message, DbErrorType.NotFound)
    }

    export const conflictDbError = (message: string): DbClientError => {
        return new DbClientError(message, DbErrorType.Conflict)
    }

    /**
     * Error constructor types
     * @desc Types representing error constructors
     */
    export type ExtendableErrorConstructor = typeof ExtendableError
    export type GeneralErrorConstructor = typeof GeneralError
    export type TypeErrorConstructor = typeof TypeError
    export type ValidationErrorConstructor = typeof ValidationError
    export type UnsupportedLanguageErrorConstructor = typeof UnsupportedLanguageError
    export type RequestErrorConstructor = typeof RequestError
    export type ResponseErrorConstructor = typeof ResponseError
    export type UnsupportedParameterErrorConstructor = typeof UnsupportedParameterError
    export type QueryParseErrorConstructor = typeof QueryParseError
    export type DbClientErrorConstructor = typeof DbClientError

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

    export const requestError = (param: string, ...args: any[]): RequestError => {
        return new RequestError(param, args)
    }

    export const responseError = (param: string, ...args: any[]): ResponseError => {
        return new ResponseError(param, args)
    }

    export const unsupportedParamError = (param: string, ...args: any[]): UnsupportedParameterError => {
        return new UnsupportedParameterError(param, args)
    }

    export const queryParseError = (
        message: string,
        start: string,
        end: string,
        ...args: any[]
    ): QueryParseError => {
        return new QueryParseError(message, start, end, args)
    }
}
