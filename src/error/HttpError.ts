/**
 * Used to throw HTTP errors.
 * Just do throw new HttpError(code, message) in your controller action and
 * default error handler will catch it and give in your response given code and message .
 */
export class HttpError extends Error {
    protected readonly httpCode: number
    protected readonly httpName: string

    constructor(httpCode: number, httpName: string, message?: string) {
        super(message)

        Object.setPrototypeOf(this, HttpError.prototype)

        this.httpCode = httpCode
        this.httpName = httpName

        this.stack = new Error().stack
    }
}
