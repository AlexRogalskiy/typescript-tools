/**
 * AuthClientError.
 */
export class AuthClientError implements Error {
    /**
     * SplunkAuthClientError constructor.
     *
     * @param message Error message.
     * @param code Error code.
     * @param stack   Error stack trace.
     */
    constructor(message: string, code?: string, stack?: string) {
        this.name = 'SplunkAuthClientError'
        this.message = message
        this.code = code || 'internal_error'
        this.stack = stack
    }

    /**
     * Error name.
     */
    name: string

    /**
     * Error message.
     */
    message: string

    /**
     * Error code.
     */
    code: string

    /**
     * Error stack trace.
     */
    stack?: string | undefined

    /**
     * ToString method.
     */
    toString(): string {
        return `Error:
    $ {
      this.message
    },Code:
    $ {
      this.code
    }`
    }
}
