import fetch from 'isomorphic-unfetch'
import { parse, stringify } from 'qs'

import { Formats } from './formats'
import { Strings } from './strings'
import { Arrays } from './arrays'

export namespace Requests {
    import isBlankString = Strings.isBlankString
    import toInt = Formats.toInt
    import makeArray = Arrays.makeArray

    export async function fetchJSON(url: string, options?): Promise<unknown> {
        const data = await fetch(url, options)
        const response = await checkStatus(data)

        return await response.json()
    }

    export async function fetchHTML(url: string, options?): Promise<string> {
        const data = await fetch(url, options)

        return await data.text()
    }

    const checkStatus = async (response): Promise<Response> => {
        if (response.ok) {
            return response
        }
        const error = new Error(response.statusText)
        error.message = response

        return Promise.reject(error)
    }

    export const toBase64ImageUrl = async (imgUrl: string): Promise<string> => {
        const fetchImageUrl = await fetch(imgUrl)
        const responseArrBuffer = await fetchImageUrl.arrayBuffer()

        return `data:${fetchImageUrl.headers.get('Content-Type') || 'image/png'};base64,${Buffer.from(
            responseArrBuffer,
        ).toString('base64')}`
    }

    export const isValidUrl = (str: string): boolean => {
        try {
            new URL(str)

            return true
        } catch (e) {
            return false
        }
    }

    export const requireValidUrl = (str: string): string => {
        if (isValidUrl(str)) {
            return str
        }
        throw new Error(`Invalid URL: ${str}`)
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

    export const toJsonUrl = (str: string): string => {
        if (isBlankString(str)) throw Error('Source URL should not be blank or empty')
        str = withHttpUrl(str)
        str = withJsonUrl(str)

        return str
    }

    export const withHttpUrl = (url: string): string =>
        !!url && !/^https?:\/\//i.test(url) ? `http://${url}` : url

    export const withJsonUrl = (url: string): string =>
        !!url && !/\.json$/i.test(url) ? `${url.replace(/\/$/, '')}.json` : url

    export const parseQueryString = (queryString: string): any => {
        const parameters = parse(queryString, { ignoreQueryPrefix: true })

        return {
            ...parameters,
            page: toInt(parameters.page),
        }
    }

    export const queryStringToState = (queryString: string): unknown => {
        const parameters = parseQueryString(queryString)

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
}
