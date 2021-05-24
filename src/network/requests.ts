import fetch from 'isomorphic-unfetch'
import { parse, stringify } from 'qs'
import { createReadStream } from 'fs'
import FormData from 'form-data'

import { Arrays, Checkers, Formats, Logging, Profiles, Strings, URI_REGEX } from '..'

import { Optional } from '../../typings/standard-types'
import { ConfigOptions } from '../../typings/domain-types'

export namespace Requests {
    import isBlankString = Strings.isBlankString
    import makeArray = Arrays.makeArray
    import errorLogs = Logging.errorLogs
    import isProd = Profiles.isProd
    import isUndefined = Checkers.isUndefined

    export const BASE_URL = (lang: string): string => `https://${lang}.wikiquote.org/`
    export const USER_URL = (lang: string): string => `${BASE_URL(lang)}wiki/`
    export const BASE_API_URL = (lang: string): string => `${BASE_URL(lang)}w/api.php?origin=*`
    export const SEARCH_URL = (lang: string): string =>
        `${BASE_API_URL(lang)}&format=json&action=opensearch&redirects=resolve&limit=max&search=`
    export const PAGE_URL = (lang: string): string =>
        `${BASE_API_URL(lang)}&format=json&action=parse&prop=text|categories&disabletoc&page=`

    export type InitHeaders = Headers | Record<string, string> | string[][]

    export const fetchApi = async (url: string, opts: any = {}): Promise<any> => {
        const apiHost = process.env.API_HOST || 'api.vercel.com'
        const urlWithHost = `https://${apiHost}${url}`
        const { method = 'GET', body } = opts

        if (process.env.VERBOSE) {
            console.log('fetch', method, url)
            if (body) console.log(encodeURIComponent(body).slice(0, 80))
        }

        if (!opts.headers) opts.headers = {}

        if (!opts.headers.Accept) {
            opts.headers.Accept = 'application/json'
        }

        opts.headers['x-now-trace-priority'] = '1'

        return await fetch(urlWithHost, opts)
    }

    export type AttachmentData = {
        readonly type: 'blob' | 'src'
        readonly blob: BlobPart
        readonly src: string
    }

    export const getQueryString = (params: Record<string, any>): string => {
        const usp = new URLSearchParams()
        for (const [k, v] of Object.entries(params)) {
            if (Array.isArray(v)) {
                for (const item of v) {
                    usp.append(k, item.toString())
                }
            } else {
                usp.append(k, v.toString())
            }
        }

        return usp.toString()
    }

    export const validateUrl = (url?: string, httpOnly = true): boolean => {
        if (!url) {
            return false
        }
        try {
            const { protocol } = new URL(url)
            return httpOnly ? protocol.startsWith('http') : !!protocol
        } catch (err) {
            return false
        }
    }

    export const isTemporalError = (err: { code: string; statusCode: number }): boolean => {
        return (
            err.code === 'ECONNRESET' ||
            err.statusCode === 429 ||
            (err.statusCode >= 500 && err.statusCode < 600)
        )
    }

    export const getHost = (x: string): string => new URL(x).host

    export const parseUrl = (url: string): Optional<URL> => {
        try {
            return new URL(url)
        } catch (err) {
            return null
        }
    }

    export const ensureTrailingSlash = (url: string): string => {
        return url.replace(/\/?$/, '/')
    }

    export const trimTrailingSlash = (url: string): string => {
        return url.replace(/\/+$/, '')
    }

    export const getApiRootURL = async <T>(setup: ConfigOptions<T>, key: PropertyKey): Promise<string> => {
        const options = isProd ? setup.options.prod : setup.options.dev

        if (!options[key]) {
            throw new Error(`No API end point defined for ${key.toString()}`)
        }

        return options[key]
    }

    /**
     * Retrieves the protocol used by the url. The url can either be absolute
     * or relative.
     * @function
     * @private
     * @param {String} url The url to retrieve the protocol from.
     * @return {String} The protocol (http:, https:, file:, ftp: ...)
     */
    export const getUrlProtocol = (url: string): string => {
        const match = url.match(/^([a-z]+:)\/\//i)
        if (match === null) {
            return window.location.protocol
        }

        return match[1].toLowerCase()
    }

    export const loadFile = async (data: AttachmentData, name: string): Promise<Optional<File>> => {
        if (data.type === 'blob') {
            return new File([data.blob], name)
        } else if (data.type === 'src') {
            const response = await fetch(data.src)
            const blob = await response.blob()

            return new File([blob], name)
        }

        return null
    }

    // (err.response instanceof Response && !isRetryable(err.response))
    export const isRetryable = (response: Response): boolean => {
        return response.status === 408 || response.status < 400 || 499 < response.status
    }

    export const setHeader = <T extends InitHeaders>(key: string, value: string, headers: T): T => {
        if (Array.isArray(headers)) {
            headers.push([key, value])
        } else if (headers instanceof Headers) {
            headers.set(key, value)
        } else {
            headers[key] = value
        }

        return headers
    }

    export const normalizeUrl = (fragment: string): string => {
        const url = fragment.replace(/\/+/g, '/')
        if (url.length > 1) {
            return url.replace(/\/$/, '')
        }

        return url
    }

    export const parseQuery = (str: string): any => {
        return str
            .replace(/(^\?)/, '')
            .split('&')
            .filter(Boolean)
            .reduce((result, part) => {
                const [name, value] = part.split('=').map(decodeURIComponent)
                result[name] = value || true
                return result
            }, {})
    }

    export const isUri = (str, inforceHttp = true): boolean => {
        const hasProtocol = str.startsWith('http://') || str.startsWith('https://')
        const value = `${!inforceHttp && !hasProtocol ? 'http://' : ''}${
            //Strip whitespace
            str.replace(/^\s+|\s+$/, '')
        }`

        return URI_REGEX.test(value)
    }

    export const toFormData = (payload: any): FormData => {
        return Object.entries<string | Blob>(payload).reduce((formData, [key, value]) => {
            if (value.constructor === Blob) {
                formData.append(key, value, key)
            } else {
                formData.append(key, value)
            }
            return formData
        }, new FormData())
    }

    export const recognizeBrowser = (): Optional<string> => {
        const userAgentTokens = ['chrome', 'chromium', 'firefox', 'edge', 'msie', 'safari', 'opr']

        const userAgent = navigator.userAgent.toLowerCase()

        return userAgentTokens.find(token => userAgent.includes(token))
    }

    export const stringifyQueryString = (query: string): string => {
        return Object.keys(query)
            .reduce((list: string[], key) => {
                if (!isUndefined(query[key])) {
                    const encodedName = encodeURIComponent(key)
                    const value =
                        query[key] === true ? encodedName : `${encodedName}=${encodeURIComponent(query[key])}`

                    list.push(value)
                }

                return list
            }, [])
            .join('&')
    }

    export const getUrlName = (url: string): Optional<string> => {
        const value = url.split('/').pop()

        return value && value.split('#')[0].split('?')[0]
    }

    export const isResponseOk = (response: Response): boolean => {
        const statusCode = response.status
        const limitStatusCode = response.redirected ? 299 : 399

        return (statusCode >= 200 && statusCode <= limitStatusCode) || statusCode === 304
    }

    const checkStatus = async (response): Promise<Response> => {
        if (response.ok) {
            return response
        }
        const error = new Error(response.statusText)
        error.message = response

        return Promise.reject(error)
    }

    export const fetchAsJson = async (url: string, options: RequestInit = {}): Promise<any> => {
        try {
            const response = await fetch(url, options)
            const data = await checkStatus(response)

            return await data.json()
        } catch (error) {
            errorLogs(`Cannot fetch request by url: ${url}, message: ${error.message}`)
            throw error
        }
    }

    export const fetchJsonFromUrl = async (url: string, param: string): Promise<string> => {
        if (param) {
            url += encodeURIComponent(param)
        }

        const option = {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
        }

        // @ts-ignore
        const res = await fetch(url, option)
        return await res.json()
    }

    export const fetchHTML = async (url: string, options: RequestInit = {}): Promise<string> => {
        const data = await fetch(url, options)

        return await data.text()
    }

    export const toBase64ImageUrl = async (imgUrl: string, options: RequestInit = {}): Promise<string> => {
        const fetchImageUrl = await fetch(imgUrl, options)
        const responseArrBuffer = await fetchImageUrl.arrayBuffer()

        return `data:${fetchImageUrl.headers.get('Content-Type') || 'image/png'};base64,${Buffer.from(
            responseArrBuffer,
        ).toString('base64')}`
    }

    export const isValidUrl = (value: string): boolean => {
        try {
            new URL(value)

            return true
        } catch (e) {
            return false
        }
    }

    export const hasSameOrigin = (url: string): boolean => {
        return new URL(url).origin === window.location.origin
    }

    export const requireValidUrl = (value: string): string => {
        if (isValidUrl(value)) {
            return value
        }
        throw new Error(`Invalid URL: ${value}`)
    }

    export const fetchJsonUrl = async (url: RequestInfo): Promise<string> => {
        const data = await fetch(url)
        const json = await data.json()

        if ('layout' in json) {
            if ('height' in json.layout) {
                json.layout.height = null
            }
            if ('width' in json.layout) {
                json.layout.width = null
            }
        }

        return json
    }

    export const toJsonUrl = (value: string): string => {
        if (isBlankString(value)) throw Error('Source URL should not be blank or empty')
        value = withHttpUrl(value)
        value = withJsonUrl(value)

        return value
    }

    export const withHttpUrl = (url: string): string =>
        !!url && !/^https?:\/\//i.test(url) ? `http://${url}` : url

    export const withJsonUrl = (url: string): string =>
        !!url && !/\.json$/i.test(url) ? `${url.replace(/\/$/, '')}.json` : url

    export const parseQueryString = (value: string): any => {
        const parameters = parse(value, { ignoreQueryPrefix: true })``
        return {
            ...parameters,
            page: Formats.toInt(parameters.page),
        }
    }

    export const queryStringToState = (value: string): unknown => {
        const parameters = parseQueryString(value)

        const selectedTags = parameters.tags ? makeArray(parameters.tags) : []

        return {
            selectedTags,
            query: parameters.query || '',
            sort: parameters.sort || '',
            page: parameters.page,
        }
    }

    export interface AuthResponse {
        data: {
            token: string
        }
    }

    export const login = async (user: string, password: string): Promise<string> => {
        const basicAuth = Buffer.from(`${user}:${password}`, 'utf-8').toString('base64')

        const auth: AuthResponse = await req({
            method: 'GET',
            url: 'https://api.splunk.com/2.0/rest/login/splunk',
            headers: {
                Authorization: `Basic ${basicAuth}`,
            },
        })

        return auth.data.token
    }

    export interface StatusResponse {
        status: 'SUCCESS' | 'PROCESSING'
        info: {
            error: number
            failure: number
            skipped: number
            manual_check: number
            not_applicable: number
            warning: number
            success: number
        }
    }

    export const qs = (obj: Record<PropertyKey, any>): string =>
        Object.entries(obj)
            .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
            .join('&')

    export async function getStatus(data: { request_id: string; token: string }): Promise<StatusResponse> {
        return req({
            method: 'GET',
            url: `https://appinspect.splunk.com/v1/app/validate/status/${encodeURIComponent(
                data.request_id,
            )}`,
            headers: {
                Authorization: `Bearer ${data.token}`,
            },
        })
    }

    export interface SubmitResponse {
        request_id: string
        message: string
    }

    export async function submit({
        filePath,
        includedTags,
        excludedTags,
        token,
    }: {
        filePath: string
        token: string
        includedTags?: string[]
        excludedTags?: string[]
    }): Promise<SubmitResponse> {
        const form = new FormData()
        form.append('app_package', createReadStream(filePath))
        if (includedTags) {
            form.append('included_tags', includedTags.join(','))
        }
        if (excludedTags) {
            form.append('excluded_tags', excludedTags.join(','))
        }
        return await req({
            method: 'POST',
            url: 'https://appinspect.splunk.com/v1/app/validate',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form,
        })
    }

    export async function getReportInternal<T>({
        request_id,
        token,
        format = 'json',
    }: {
        request_id: string
        token: string
        format?: 'json' | 'html'
    }): Promise<T> {
        const contentType = format === 'html' ? 'text/html' : 'application/json'

        return req({
            method: 'GET',
            url: `https://appinspect.splunk.com/v1/app/report/${encodeURIComponent(request_id)}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType,
            },
            json: format === 'json',
        })
    }

    export async function req<T>({
        url,
        method,
        body,
        headers,
        json = true,
    }: {
        method: 'GET' | 'POST'
        url: string
        headers?: { [k: string]: string }
        body?: any
        json?: boolean
    }): Promise<T> {
        const res = await fetch(url, {
            method,
            body,
            headers,
        })

        if (!res.ok) {
            try {
                const data = await res.text()
                errorLogs(`HTTP status ${res.status} from ${url} with response ${data}`)
            } catch (e) {
                // ignore
            }
            throw new Error(`HTTP status ${res.status} from ${url}`)
        }

        return json ? res.json() : res.text()
    }

    export const isURLImport = (target: string): boolean => {
        try {
            const { origin } = new URL(target)

            return !!origin
        } catch (error) {
            return false
        }
    }

    export const stateToQueryString = ({ query, selectedTags, sort, page }: any): any => {
        return stringify(
            {
                query: query || null,
                tags: selectedTags.length === 0 ? null : selectedTags,
                sort: sort === '' ? null : sort,
                page: page === 1 ? null : page,
            },
            {
                encode: false,
                arrayFormat: 'repeat',
                skipNulls: true,
            },
        )
    }

    export const ipToNumber = (value: string): number => {
        return value
            .split('.')
            .map(Number)
            .map((part, i) => Math.pow(256, 4 - i) * part)
            .reduce((a, b) => a + b)
    }

    export const getHost2 = ({ hostName, domainName, endpoint, baseUrl }: any): Optional<string> => {
        let host = hostName || domainName

        if (!host) {
            try {
                host = endpoint || baseUrl
                host = new URL(host).host
            } catch (err) {
                host = null
            }
        }

        return host
    }

    export const replacePageNumber = (param: string, pageNum: number): string => {
        return window.location.href.replace(new RegExp(`${param}=(\\d)`), `${param}=${pageNum}`)
    }

    export const toDataUrl = (code: string, mime = 'image/svg+xml'): string => {
        const buffer = Buffer.from(code, 'utf-8')
        const encoded = buffer.toString('base64')

        return `'data:${mime};base64,${encoded}'`
    }
}
