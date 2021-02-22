import { LOCALHOST_REGEX } from './regex'

export namespace Networks {
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
}
