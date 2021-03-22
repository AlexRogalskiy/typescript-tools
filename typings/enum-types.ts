// -------------------------------------------------------------------------------------------------
/**
 * ErrorType
 * @desc Type representing errors
 */
export enum ErrorType {
    general_error = 'GeneralError',
    parser_error = 'ParserError',
    validation_error = 'ValidationError',
    parameter_error = 'ParameterError',
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
 * InteractiveState
 * @desc Type representing supported interactive states
 */
export enum InteractiveState {
    None = 0,
    ShowDetail = 1,
    Dragging = 1 << 1,
    Srolling = 1 << 2,
}

// -------------------------------------------------------------------------------------------------
/**
 * Profile
 * @desc Type representing supported profiles
 */
export enum Profile {
    dev = 'dev',
    prod = 'prod',
}

// -------------------------------------------------------------------------------------------------
