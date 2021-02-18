/*
Code from https://github.com/sindresorhus/pretty-bytes/blob/master/index.js
We can't use `pretty-bytes` with `create-react-app` v1.x, a compile error occurs at build time.
because node_modules are not compiled with Babel
*/
const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (number: number, locale: string | boolean): string => {
    let result = ''
    if (typeof locale === 'string') {
        result = number.toLocaleString(locale)
    } else if (locale) {
        result = number.toLocaleString()
    }

    return result
}

export function prettyBytes(number: number, options?): string {
    if (!Number.isFinite(number)) {
        throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`)
    }

    options = Object.assign({}, options)

    if (options.signed && number === 0) {
        return ' 0 B'
    }

    const isNegative = number < 0
    const prefix = isNegative ? '-' : options.signed ? '+' : ''

    if (isNegative) {
        number = -number
    }

    if (number < 1) {
        const numberString = toLocaleString(number, options.locale)
        return `${prefix + numberString} B`
    }

    const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1)
    number = Number((number / Math.pow(1000, exponent)).toPrecision(3))
    const numberString = toLocaleString(number, options.locale)

    const unit = UNITS[exponent]

    return `${prefix + numberString} ${unit}`
}

// Format a URL to be displayed, removing `http://` and trailing `/`
export const formatUrl = (url: string): string => {
    const result = url.replace(/\/$/, '').toLowerCase()
    return result.replace(/^https?:\/\/(.*)$/, '$1')
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

export const toInt = (str: string, defaultValue?: number): number | undefined => {
    try {
        return parseInt(str) || defaultValue
    } catch (e) {
        return defaultValue
    }
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
