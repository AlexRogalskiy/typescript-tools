import path from 'path'

import { Optional } from '../../typings/standard-types'

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

/**
 * stripUrl
 *
 * Returns all of a URL after the last slash so that it does not
 * include the root of the URL that we don't need (e.g. when fetching from
 * an API).
 *
 * @param {String} url
 */
export const stripUrl = (url: string): Optional<string> => {
    const regex = new RegExp(/([^/]+$)/g)

    return url.match(regex)?.[0]
}

export const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
)

/**
 * getOffset
 *
 * Returns the offset from an API query so that it can be used
 * for things like next and prev controls in pagination.
 *
 * @param {String} url The URL you want to find `offset` in and
 * simply return the value for.
 */
export const getOffset = (url: string): Optional<string> => {
    const regex = new RegExp(/offset=(\w+)/)

    return url.match(regex)?.[0].replace('offset=', '')
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

export const httpsRedirect = (): void => {
    if (location.protocol !== 'https:') location.replace(`https://${location.href.split('//')[1]}`)
}

// isAbsoluteURL('https://google.com'); // true
// isAbsoluteURL('ftp://www.myserver.net'); // true
// isAbsoluteURL('/foo/bar'); // false
export const isAbsoluteURL = (str: string): boolean => /^[a-z][a-z0-9+.-]*:/.test(str)

// redirect('https://google.com');
export const redirect = (url: string, asLink = true): string | void =>
    asLink ? (window.location.href = url) : window.location.replace(url)

// slugify('Hello World!'); // 'hello-world'
export const slugify = (str: string): string =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

// serializeCookie('foo', 'bar'); // 'foo=bar'
export const serializeCookie = (name: string | number | boolean, val: string | number | boolean): string =>
    `${encodeURIComponent(name)}=${encodeURIComponent(val)}`

// objectToQueryString({ page: '1', size: '2kg', key: undefined });
// '?page=1&size=2kg'
export const objectToQueryString = (queryParameters: any): string => {
    if (queryParameters) {
        return Object.entries(queryParameters).reduce((queryString, [key, val], _) => {
            const symbol = queryString.length === 0 ? '?' : '&'
            if (typeof val === 'string') {
                queryString += `${symbol}${key}=${val}`
            }
            return queryString
        }, '')
    }

    return ''
}

// const data = JSON.stringify({
//     id: 1,
//     title: 'foo',
//     body: 'bar',
//     userId: 1
// });
// httpPut('https://jsonplaceholder.typicode.com/posts/1', data, request => {
//     console.log(request.responseText);
// });
export const httpPut = (url: string, data: any, callback = console.log, err = console.error): void => {
    const request = new XMLHttpRequest()
    request.open('PUT', url, true)
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    request.onload = () => callback(request)
    request.onerror = () => err(request)
    request.send(data)
}

// const newPost = {
//     userId: 1,
//     id: 1337,
//     title: 'Foo',
//     body: 'bar bar bar'
// };
// httpPost(
//     'https://jsonplaceholder.typicode.com/posts',
//     JSON.stringify(newPost)
// );
// httpPost(
//     'https://jsonplaceholder.typicode.com/posts',
//     null, // does not send a body
// );
export const httpPost = (url: string, data: any, callback = console.log, err = console.error): void => {
    const request = new XMLHttpRequest()
    request.open('POST', url, true)
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    request.onload = () => callback(request.responseText)
    request.onerror = () => err(request)
    request.send(data)
}

// httpGet(
//     'https://jsonplaceholder.typicode.com/posts/1'
// ); /*
export const httpGet = (url: string, callback = console.log, err = console.error): void => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = () => callback(request.responseText)
    request.onerror = () => err(request)
    request.send()
}

// httpDelete('https://jsonplaceholder.typicode.com/posts/1', request => {
//     console.log(request.responseText);
// }); // Logs: {}
export const httpDelete = (url: string, callback = console.log, err = console.error): void => {
    const request = new XMLHttpRequest()
    request.open('DELETE', url, true)
    request.onload = () => callback(request)
    request.onerror = () => err(request)
    request.send()
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
