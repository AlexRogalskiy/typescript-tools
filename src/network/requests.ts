import fetch from 'isomorphic-unfetch'
import { parse, stringify } from 'qs'

import { Formats, Strings, Arrays, Logging } from '..'

import { Optional } from '../../typings/standard-types'
import { ConfigOptions } from '../../typings/domain-types'

import { Profiles } from '../config/profiles'

export namespace Requests {
    import isBlankString = Strings.isBlankString
    import makeArray = Arrays.makeArray
    import isDev = Profiles.isDev
    import errorLogs = Logging.errorLogs

    export const BASE_URL = (lang: string): string => `https://${lang}.wikiquote.org/`
    export const USER_URL = (lang: string): string => `${BASE_URL(lang)}wiki/`
    export const BASE_API_URL = (lang: string): string => `${BASE_URL(lang)}w/api.php?origin=*`
    export const SEARCH_URL = (lang: string): string =>
        `${BASE_API_URL(lang)}&format=json&action=opensearch&redirects=resolve&limit=max&search=`
    export const PAGE_URL = (lang: string): string =>
        `${BASE_API_URL(lang)}&format=json&action=parse&prop=text|categories&disabletoc&page=`

    export type InitHeaders = Headers | Record<string, string> | string[][]

    export type AttachmentData = {
        type: 'blob' | 'src'
        blob: BlobPart
        src: string
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
        const options = isDev ? setup.options.dev : setup.options.prod

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

    export const fetchJson = async (url: string, options: RequestInit = {}): Promise<any> => {
        try {
            const response = await fetch(url, options)

            return await response.json()
        } catch (e) {
            console.error(`Cannot fetch request by url: ${url}, message: ${e.message}`)
            throw e
        }
    }

    export const fetchAsJson = async (url: string, options: RequestInit = {}): Promise<any> => {
        try {
            const response = await fetch(url, options)
            const data = await checkStatus(response)

            return await data.json()
        } catch (e) {
            errorLogs(`Cannot fetch request by url: ${url}, message: ${e.message}`)
            throw e
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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        const parameters = parse(value, { ignoreQueryPrefix: true })

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

    export const stateToQueryString = ({ query, selectedTags, sort, page }): any => {
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

    export const replacePageNumber = (param: string, pageNum: number): string => {
        return window.location.href.replace(new RegExp(`${param}=(\\d)`), `${param}=${pageNum}`)
    }
}
