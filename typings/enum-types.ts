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
 * OrderType
 * @desc Type representing order (asc|desc)
 */
export enum OrderType {
    'asc' = 'asc',
    'desc' = 'desc',
}

// -------------------------------------------------------------------------------------------------
/**
 * TokenType
 * @desc Type representing supported tokens
 */
export enum TokenType {
    Unknown,
    Word,
    Assignment,
    Operator,
    Comma,
    Dot,
    Colon,
    Semicolon,
    Space,
    Newline,
    MultiComment,
    LineComment,
    LeftParen,
    RightParen,
    LeftBracket,
    RightBracket,
    LeftBrace,
    RightBrace,
    SingleQuoted,
    DoubleQuoted,
    TripleSingleQuoted,
    TripleDoubleQuoted,
    Substitute,
    EscapedChar,
}

// -------------------------------------------------------------------------------------------------
/**
 * DbErrorType
 * @desc Type representing database errors
 */
export enum DatabaseErrorType {
    UnprocessableEntity = 'UnprocessableEntity',
    Conflict = 'Conflict',
    NotFound = 'NotFound',
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
    BAD_REQUEST = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
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
 * PullRequestState
 * @desc Type representing supported pull request states
 */
export enum PullRequestState {
    Merged = 'merged',
    Open = 'open',
    Closed = 'closed',
    All = 'all',
    NotOpen = '!open',
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
