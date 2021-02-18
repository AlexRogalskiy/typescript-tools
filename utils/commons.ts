import fetch from 'isomorphic-unfetch'
import _ from 'lodash'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { ConfigOptions } from '../typings/types'

export const random = (max: number): number => {
    return Math.floor(Math.random() * max)
}

export const randomElement = <T>(arr: T[]): T => arr[random(arr.length)]

export const toBase64ImageUrl = async (imgUrl): Promise<string> => {
    const fetchImageUrl = await fetch(imgUrl)
    const responseArrBuffer = await fetchImageUrl.arrayBuffer()

    return `data:${fetchImageUrl.headers.get('Content-Type') || 'image/png'};base64,${Buffer.from(
        responseArrBuffer
    ).toString('base64')}`
}

export const isNonEmptyString = (str: string): boolean => {
    return str !== undefined && str !== null && str.length > 0
}

export const isBlankString = (str: string): boolean => {
    return !str || /^\s*$/.test(str)
}

export const notBlankOrElse = (str: string, defaultValue: string): string => {
    return isBlankString(str) ? defaultValue : str
}

export const toString = (str: string | string[]): string => {
    return Array.isArray(str) ? str[0] : str
}

export const toInt = (str: string, defaultValue?: number): number | undefined => {
    try {
        return parseInt(str) || defaultValue
    } catch (e) {
        return defaultValue
    }
}

export const randomEnum = <T>(anEnum: T): T[keyof T] => {
    const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][]
    const randomIndex = random(enumValues.length)

    return enumValues[randomIndex]
}

export const toFormatString = (obj): string => {
    return `(${objToString(obj)})`
}

const objToString = (obj): string => {
    let str = ''
    for (const p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p)) {
            str += `${p} => ${typeof obj[p] === 'object' ? `[${objToString(obj[p])}]` : `${obj[p]},`}`
        }
    }

    return str
}

export const pluck = <T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] => {
    return propertyNames.map(n => o[n])
}

export const mergeProps = <T>(...obj: unknown[]): T => {
    return _.mergeWith({}, ...obj, (o, s) => (_.isNull(s) ? o : s))
}

/**
 * Utility function to create a K:V from a list of strings
 * @param o initial input array to operate by
 * @param func
 */
export const strToEnum = <T extends string, V>(o: T[], func: (v: T) => V): { [K in T]: V } => {
    return o.reduce((res, key) => {
        res[key] = func(key)
        return res
    }, Object.create(null))
}

/**
 * Utility function to create a K:V from a list of strings
 * @param o initial input array to operate by
 * @param func
 */
export const strToFuncEnum = <T extends string, V>(o: T[], func: (v: T) => V): { [K in T]: V } => {
    return o.reduce((res, key) => {
        res[key] = func(key)
        return res
    }, Object.create(null))
}

export const wait = async (ms: number, ...args: unknown[]): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms, args))
}

export const composeAsync = async (...funcs) => async x =>
    // eslint-disable-next-line github/no-then
    await funcs.reduce((acc, val) => acc.then(val), Promise.resolve(x))

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

export const createFilePath = (locations): string => {
    const date = new Date()
    const timestamp = `${date.getFullYear()}_${
        date.getMonth() + 1
    }_${date.getDate()}_${date.getHours()}_${date.getMinutes()}`

    const { path, name, extension } = locations
    const fileName = `${name}-${timestamp}.${extension}`

    if (!existsSync(path)) {
        mkdirSync(path)
    }

    return join(path, fileName)
}

export const omitNull = <T>(obj: T): T => {
    // eslint-disable-next-line github/array-foreach
    Object.keys(obj)
        .filter(k => obj[k] === null || obj[k] === undefined)
        .forEach(k => delete obj[k])

    return obj
}

export const toBoolean = (value: unknown): boolean => {
    return (
        (typeof value === 'string' && /true/i.test(value)) ||
        value === true ||
        value === 'true' ||
        value === 1 ||
        value === '1' ||
        value === 'on' ||
        value === 'yes'
    )
}

export const separator = (num: number, delim = '='): string => {
    return Array(num).join(delim)
}

export const getApiRootURL = async (setup: ConfigOptions, key: string): Promise<string> => {
    const { NODE_ENV } = process.env
    const isLocalEnv = NODE_ENV === 'development'
    const options = isLocalEnv ? setup.options.dev : setup.options.prod
    if (!options[key]) throw new Error(`No API end point defined for ${key}`)

    return options[key]
}

export const getTagsByCode = (tags): unknown => {
    return tags.reduce((acc, tag) => {
        return { ...acc, [tag.code]: { ...tag, id: tag.code } }
    }, {})
}

//    decimal=Math.round(parseInt(valNum, 16));
//    percent=Math.round(parseInt(valNum, 16)/255*100);
export const fromHex = (valNum: number): string => {
    return valNum.toString(16).toUpperCase()
}

// percent=Math.round((valNum / 255) * 100)
export const fromDecimal = (valNum: number): string => {
    const decimalValue = Math.round(valNum)

    if (valNum < 16) {
        return `0${decimalValue.toString(16).toUpperCase()}`
    }

    return decimalValue.toString(16).toUpperCase()
}

// decimal=Math.round(valNum*255/100);
export const fromPercent = (valNum: number): string => {
    const decimalValue = Math.round((valNum * 255) / 100)

    if (valNum < 7) {
        return `0${decimalValue.toString(16).toUpperCase()}`
    }

    return decimalValue.toString(16).toUpperCase()
}
