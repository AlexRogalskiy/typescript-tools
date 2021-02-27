// -------------------------------------------------------------------------------------------------
/**
 * Error type enumeration
 */
export enum ErrorType {
    general_error = 'GeneralError',
    validation_error = 'ValidationError',
    type_error = 'TypeError',
    value_error = 'ValueError',
}

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
 * Profile enumeration
 */
export enum Profile {
    dev = 'dev',
    prod = 'prod',
}

// -------------------------------------------------------------------------------------------------
export type ProfileOptions = {
    [K in Profile]: string
}

// -------------------------------------------------------------------------------------------------
/**
 * Configuration options type
 */
export interface ConfigOptions {
    /**
     * Configuration options.
     */
    readonly options: ProfileOptions
}

// -------------------------------------------------------------------------------------------------
