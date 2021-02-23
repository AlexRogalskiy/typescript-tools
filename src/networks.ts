import { LOCALHOST_REGEX } from './regex'

export namespace Networks {
    const ProtocolsExcept = ['127.0.0.1', '0.0.0.0', 'localhost', '::1']

    export const isLocalhost = (str: string): boolean => {
        return (
            str === 'localhost' ||
            // [::1] is the IPv6 localhost address.
            str === '[::1]' ||
            // 127.0.0.1/8 is considered localhost for IPv4.
            LOCALHOST_REGEX.test(str)
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
    export const normalizePort = (val: string): number | undefined => {
        const port = parseInt(val, 10)
        return !isNaN(port) && port >= 0 ? port : undefined
    }

    /**
     *    changes type of protocol of the current url
     */
    export const redirect = (protocol = 'https', except = ProtocolsExcept): void => {
        const proto = `${protocol}:`
        if (document.location.protocol !== proto && !except.includes(document.location.hostname)) {
            document.location.protocol = proto
        }
    }
}
