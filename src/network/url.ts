import path from 'path'

export interface Location {
    pathname: string
    hash: string
    search: string
}

export const normalizePathname = (pathname: string): string => {
    const normalizedPathname = path.normalize(pathname)
    const normalizedLength = normalizedPathname.length

    if (normalizedPathname[normalizedLength - 1] === '/') {
        return normalizedPathname.slice(0, normalizedLength - 1)
    }

    return normalizedPathname
}

export const URLJoin = (...args: string[]): string =>
    args
        .join('/')
        .replace(/[/]+/g, '/')
        .replace(/^(.+):\//, '$1://')
        .replace(/^file:/, 'file:/')
        .replace(/\/(\?|&|#[^!])/g, '$1')
        .replace(/\?/g, '&')
        .replace('&', '?')

export const normalizeLocation = ({ pathname, ...otherProps }: Location): Location => {
    return {
        pathname: normalizePathname(pathname),
        ...otherProps,
    }
}

// getURLParameters('google.com'); // {}
// getURLParameters('http://url.com/page?name=Adam&surname=Smith');
// {name: 'Adam', surname: 'Smith'}
export const getURLParameters = (url: string): any =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
        {},
    )

export const getProtocol = (): string => window.location.protocol

// getBaseURL('http://url.com/page?name=Adam&surname=Smith');
export const getBaseURL = (url: string): string => url.replace(/[?#].*$/, '')

export const parseUrl = (urlStr: string): Location => {
    const url = new URL(urlStr)

    return {
        pathname: url.pathname || '',
        hash: url.hash || '',
        search: url.search || '',
    }
}
