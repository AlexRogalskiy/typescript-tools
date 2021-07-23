import * as qs from 'qs'
import { BacklogApiError, BacklogAuthError, UnexpectedError } from './error'

export default class Request {
    constructor(
        protected configure: {
            host: string
            apiKey?: string
            accessToken?: string
            timeout?: number
        },
    ) {}

    async get<T>(path: string, params?: any): Promise<T> {
        // eslint-disable-next-line github/no-then
        return this.request({ method: 'GET', path, params }).then<T>(this.parseJSON)
    }

    async post<T>(path: string, params?: any): Promise<T> {
        // eslint-disable-next-line github/no-then
        return this.request({ method: 'POST', path, params }).then<T>(this.parseJSON)
    }

    async put<T>(path: string, params: any): Promise<T> {
        // eslint-disable-next-line github/no-then
        return this.request({ method: 'PUT', path, params }).then<T>(this.parseJSON)
    }

    async patch<T>(path: string, params: any): Promise<T> {
        // eslint-disable-next-line github/no-then
        return this.request({ method: 'PATCH', path, params }).then<T>(this.parseJSON)
    }

    async delete<T>(path: string, params?: any): Promise<T> {
        // eslint-disable-next-line github/no-then
        return this.request({ method: 'DELETE', path, params }).then<T>(this.parseJSON)
    }

    async request(options: { method: string; path: string; params?: Params | FormData }): Promise<Response> {
        const { method, path, params = {} as Params } = options
        const { apiKey, accessToken, timeout } = this.configure
        const query: Params = apiKey ? { apiKey } : {}
        const init: RequestInit = { method, headers: {} }
        if (timeout) {
            init['timeout'] = timeout
        }
        if (!apiKey && accessToken) {
            init.headers!['Authorization'] = `Bearer ${accessToken}`
        }
        if (typeof window !== 'undefined') {
            init.mode = 'cors'
        }
        if (method !== 'GET') {
            if (params instanceof FormData) {
                init.body = params
            } else {
                init.headers!['Content-type'] = 'application/x-www-form-urlencoded'
                init.body = this.toQueryString(params)
            }
        } else {
            for (const key of Object.keys(params)) {
                query[key] = params[key]
            }
        }
        const queryStr = this.toQueryString(query)
        const url = `${this.restBaseURL}/${path}${queryStr.length > 0 ? `?${queryStr}` : ''}`
        // eslint-disable-next-line github/no-then
        return fetch(url, init).then(this.checkStatus)
    }

    async checkStatus(response: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            if (200 <= response.status && response.status < 300) {
                resolve(response)
            } else {
                response
                    .json()
                    // eslint-disable-next-line github/no-then
                    .then(data => {
                        if (response.status === 401) {
                            reject(new BacklogAuthError(response, data))
                        } else {
                            reject(new BacklogApiError(response, data))
                        }
                    })
                    // eslint-disable-next-line github/no-then
                    .catch(_ => reject(new UnexpectedError(response)))
            }
        })
    }

    async parseJSON<T>(response: Response): Promise<T> {
        return response.json()
    }

    private toQueryString(params: Params): string {
        return qs.stringify(params, { arrayFormat: 'brackets' })
    }

    get webAppBaseURL(): string {
        return `https://${this.configure.host}`
    }

    get restBaseURL(): string {
        return `${this.webAppBaseURL}/api/v2`
    }
}

export type Params = { [index: string]: number | string | number[] | string[] }
