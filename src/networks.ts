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
}
