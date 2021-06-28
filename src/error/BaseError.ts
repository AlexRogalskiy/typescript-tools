export interface IErrorInfo {
    code?: string
    message: string
    details?: string
}

export class BaseError extends Error {
    constructor(info: IErrorInfo) {
        super(info.message)
        this.name = 'BaseError'
    }
}
