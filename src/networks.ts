export namespace Networks {
    const LOCALHOST_REGEX = new RegExp(/^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)

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
