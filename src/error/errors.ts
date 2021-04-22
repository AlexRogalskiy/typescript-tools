import _ from 'lodash'

import { DatabaseErrorType, ErrorType, StatusCode } from '../../typings/enum-types'

import { Logging } from '..'
import { Optional } from '../../typings/standard-types'

export namespace Errors {
    import errorLogs = Logging.errorLogs

    /**
     * ErrorInfo
     * @desc Type representing error information
     */
    export type ErrorInfo = {
        /**
         * Error number
         */
        readonly line: number
        /**
         * Error column
         */
        readonly column: number
    }

    /**
     * ErrorData
     * @desc Type representing error data
     */
    export type ErrorData = {
        /**
         * Error code
         */
        readonly code: StatusCode
        /**
         * Error description
         */
        readonly description: string
    }

    /**
     * ErrorCode
     * @desc Type representing error codes
     */
    export const ErrorCode: Record<ErrorType, ErrorData> = {
        [ErrorType.general_error]: {
            code: StatusCode.INTERNAL_SERVER_ERROR,
            description: 'General Error',
        },
        [ErrorType.parser_error]: {
            code: StatusCode.UNPROCESSABLE_ENTITY,
            description: 'Parser Error',
        },
        [ErrorType.db_error]: {
            code: StatusCode.INTERNAL_SERVER_ERROR,
            description: 'DataBase Error',
        },
        [ErrorType.validation_error]: {
            code: StatusCode.BAD_REQUEST,
            description: 'Validation Error',
        },
        [ErrorType.request_error]: { code: StatusCode.BAD_REQUEST, description: 'Request Error' },
        [ErrorType.response_error]: {
            code: StatusCode.INTERNAL_SERVER_ERROR,
            description: 'Response Error',
        },
        [ErrorType.parameter_error]: {
            code: StatusCode.BAD_REQUEST,
            description: 'Parameter Error',
        },
        [ErrorType.type_error]: { code: StatusCode.BAD_REQUEST, description: 'Type Error' },
        [ErrorType.value_error]: { code: StatusCode.BAD_REQUEST, description: 'Value Error' },
    }

    /**
     * ExtendableError
     * @desc Class representing extendable error
     */
    export class ExtendableError extends Error {
        /**
         * Error data by provided {@link ErrorType}
         */
        readonly data: ErrorData = ErrorCode[this.type]
        /**
         * Error timestamp
         */
        readonly timestamp = new Date().getTime()

        /**
         * Extendable error constructor by input parameters
         * @param type initial input {@link ErrorType}
         * @param message initial input {@link string} message
         */
        constructor(readonly type: ErrorType, readonly message: string) {
            super(message)

            Object.defineProperty(this, 'message', {
                configurable: true,
                enumerable: false,
                value: message,
                writable: true,
            })

            Object.defineProperty(this, 'type', {
                configurable: true,
                enumerable: false,
                value: type,
                writable: true,
            })

            Object.defineProperty(this, 'data', {
                configurable: true,
                enumerable: false,
                value: ErrorCode[type],
                writable: true,
            })

            Object.defineProperty(this, 'name', {
                configurable: true,
                enumerable: false,
                value: this.constructor.name,
                writable: true,
            })

            if (Object.prototype.hasOwnProperty.call(Error, 'captureStackTrace')) {
                Error.captureStackTrace(this, this.constructor)
                return
            }

            Object.defineProperty(this, 'stack', {
                configurable: true,
                enumerable: false,
                value: new Error(message).stack,
                writable: true,
            })

            if (_.isString(this.stack)) {
                const indexOfMessage = this.stack.indexOf(this.message) + this.message.length
                const thisStackTrace = this.stack.slice(indexOfMessage).split('\n').reverse()

                this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join('\n')}`
            }
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
     * ExecError
     * @desc Class representing execution error
     */
    export class ExecError extends GeneralError {
        constructor(
            readonly message: string,
            readonly code: any,
            readonly stdout: any,
            readonly stderr: any,
            ...args: any[]
        ) {
            super(ErrorType.type_error, message, args)
            this.code = code
            this.stdout = stdout
            this.stderr = stderr
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
     * WrappedError
     * @desc Class representing wrapped error
     */
    export class WrappedError extends GeneralError {
        protected cause?: Error

        constructor(readonly message: string, cause?: Error, ...args: any[]) {
            super(ErrorType.general_error, message, args)
            this.cause = cause
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

        constructor(readonly message: string, readonly code: DatabaseErrorType, ...args: any[]) {
            super(ErrorType.db_error, message, args)

            this.code = code
            this.statusCode = DbClientError.getStatusCodeFromCode(code)
        }

        static getStatusCodeFromCode(code: string): number {
            if (code === DatabaseErrorType.NotFound) {
                return StatusCode.NOT_FOUND
            } else if (code === DatabaseErrorType.Conflict) {
                return StatusCode.CONFLICT
            } else if (code === DatabaseErrorType.UnprocessableEntity) {
                return StatusCode.UNPROCESSABLE_ENTITY
            }

            return StatusCode.INTERNAL_SERVER_ERROR
        }
    }

    export const unprocessableEntityDbError = (message: string): DbClientError => {
        return new DbClientError(message, DatabaseErrorType.UnprocessableEntity)
    }

    export const notFoundDbError = (message: string): DbClientError => {
        return new DbClientError(message, DatabaseErrorType.NotFound)
    }

    export const conflictDbError = (message: string): DbClientError => {
        return new DbClientError(message, DatabaseErrorType.Conflict)
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

    export const newError = (code: StatusCode, description: string): ErrorData => {
        return { code, description }
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

    export const errorData = (err: Error): Optional<ErrorInfo> => {
        const match = /:(\d+):(\d+)/.exec((err.stack || '').split('\n')[1])

        if (!match) return null

        return {
            line: parseInt(match[1], 10),
            column: parseInt(match[2], 10),
        }
    }

    export const errorSerializer = (err: Error): Error => {
        const redactedFields = ['message', 'stack', 'stdout', 'stderr']

        for (const field of redactedFields) {
            const val = err[field]
            if (_.isString(val)) {
                err[field] = val.replace(/https:\/\/[^@]*?@/g, 'https://**redacted**@')
            }
        }

        return err
    }
}
