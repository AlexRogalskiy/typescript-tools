// -------------------------------------------------------------------------------------------------
/**
 * Error type enumeration
 */
export enum ErrorType {
    general_error = 'GeneralError',
    parser_error = 'ParserError',
    validation_error = 'ValidationError',
    type_error = 'TypeError',
    value_error = 'ValueError',
}
// -------------------------------------------------------------------------------------------------
/**
 * Error data type
 * @desc Type representing error data
 */
export type ErrorData = {
    readonly type: ErrorType
    readonly message: string
}
// -------------------------------------------------------------------------------------------------
/**
 * Status code type
 * @desc Type representing error data
 */
export enum StatusCode {
    OK = 200,
    CREATED = 201,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}
// -------------------------------------------------------------------------------------------------
/**
 * Profile enumeration
 */
export enum Profile {
    dev = 'dev',
    prod = 'prod',
}
// -------------------------------------------------------------------------------------------------
