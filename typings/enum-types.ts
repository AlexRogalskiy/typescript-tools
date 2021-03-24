// -------------------------------------------------------------------------------------------------
/**
 * ErrorType
 * @desc Type representing errors
 */
export enum ErrorType {
    general_error = 'GeneralError',
    parser_error = 'ParserError',
    db_error = 'DatabaseError',
    validation_error = 'ValidationError',
    request_error = 'RequestError',
    response_error = 'ResponseError',
    parameter_error = 'ParameterError',
    type_error = 'TypeError',
    value_error = 'ValueError',
}

// -------------------------------------------------------------------------------------------------
/**
 * DbClientErrorType
 * @desc Type representing database client errors
 */
export enum DbClientErrorType {
    UnprocessableEntity = 'UnprocessableEntity',
    Conflict = 'Conflict',
    NotFound = 'NotFound',
}

// -------------------------------------------------------------------------------------------------
/**
 * ErrorData
 * @desc Type representing error data
 */
export type ErrorData = {
    readonly type: ErrorType
    readonly message: string
}

// -------------------------------------------------------------------------------------------------
/**
 * StatusCode
 * @desc Type representing supported status codes
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
    test = 'test',
}

// -------------------------------------------------------------------------------------------------
