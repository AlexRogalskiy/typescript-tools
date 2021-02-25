import { LOCALHOST_REGEX } from './regexes'
import { Checkers } from './checkers'
import { Exceptions } from './exceptions'

export namespace Networks {
    import isNotNull = Checkers.isNotNull
    import valueException = Exceptions.valueException
    import isString = Checkers.isString

    const DEFAULT_PROTOCOLS = ['127.0.0.1', '0.0.0.0', 'localhost', '::1']

    export const isLocalhost = (value: string): boolean => {
        return (
            value === 'localhost' ||
            // [::1] is the IPv6 localhost address.
            value === '[::1]' ||
            // 127.0.0.1/8 is considered localhost for IPv4.
            LOCALHOST_REGEX.test(value)
        )
    }

    export const addParamToUrl = (url: string, param: string): string => {
        return url + (url.includes('?') ? '&' : '?') + param
    }

    export const getQueryParams = (object: { [index: string]: string }): string => {
        let parameters = ''

        // eslint-disable-next-line github/array-foreach
        Object.keys(object).forEach((key, i) => {
            const value: string = object[key]
            const prefix = i === 0 ? '?' : '&'
            parameters += `${prefix}${key}=${value}`
        })

        return parameters
    }

    /**
     * Normalize a port into a number, string, or false.
     */
    export const normalizePort = (value: string): number | undefined => {
        const port = parseInt(value, 10)

        return !isNaN(port) && port >= 0 ? port : undefined
    }

    /**
     *    changes type of protocol of the current url
     */
    export const redirect = (protocol = 'https', except = DEFAULT_PROTOCOLS): void => {
        const proto = `${protocol}:`
        if (document.location.protocol !== proto && !except.includes(document.location.hostname)) {
            document.location.protocol = proto
        }
    }

    export const getQueryParam = (value: string): string | null => {
        const reg = new RegExp(`(^|&)${value}=([^&*])(&|$)`)
        const query = window.location.search.substr(1).match(reg)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return isNotNull(query) ? unescape(query[2]) : null
    }

    export const getParameterByName = (value: string): string | null => {
        if (!isString(value)) {
            throw valueException(`incorrect parameter value: < ${value} >`)
        }
        const match = RegExp(`[?&]${value}=([^&]*)`).exec(window.location.search)

        return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
    }
}
