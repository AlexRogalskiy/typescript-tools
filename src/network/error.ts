export class BacklogError extends global.Error {
    private readonly _name: BacklogErrorNameType
    private readonly _url: string
    private readonly _status: number
    private readonly _body?: { errors: BacklogErrorMessage[] }
    private readonly _response: Response

    constructor(name: BacklogErrorNameType, response: Response, body?: { errors: BacklogErrorMessage[] }) {
        super(response.statusText)
        this._name = name
        this._url = response.url
        this._status = response.status
        this._body = body
        this._response = response
    }

    get name(): BacklogErrorNameType {
        return this._name
    }

    get url(): string {
        return this._url
    }

    get status(): number {
        return this._status
    }

    get body(): { errors: BacklogErrorMessage[] } | undefined {
        return this._body
    }

    get response(): Response {
        return this._response
    }
}

export class BacklogApiError extends BacklogError {
    constructor(response: Response, body?: { errors: BacklogErrorMessage[] }) {
        super('BacklogApiError', response, body)
    }
}

export class BacklogAuthError extends BacklogError {
    constructor(response: Response, body?: { errors: BacklogErrorMessage[] }) {
        super('BacklogAuthError', response, body)
    }
}

export class UnexpectedError extends BacklogError {
    constructor(response: Response) {
        super('UnexpectedError', response)
    }
}

export interface BacklogErrorMessage {
    message: string
    code: number
    errorInfo: string
    moreInfo: string
}

export type BacklogErrorNameType = 'BacklogApiError' | 'BacklogAuthError' | 'UnexpectedError'

export declare namespace global {}
