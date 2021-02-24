import { ALPHA_REGEX, EMAIL_REGEX, MOBILE_NAVIGATOR_CODE_REGEX, MOBILE_NAVIGATOR_TYPE_REGEX } from './regexes'
import { Numbers } from './numbers'
import { Exceptions } from './exceptions'

export namespace Checkers {
    import toUint32 = Numbers.toUint32
    import typeException = Exceptions.typeException
    import valueException = Exceptions.valueException

    export const isNull = (value: any): boolean => {
        return value == null
    }

    export const isNotNull = (value: any): boolean => {
        return value !== null
    }

    export const isMobileBrowser = (navigator: string): boolean => {
        return !(
            !MOBILE_NAVIGATOR_TYPE_REGEX.test(navigator) &&
            !MOBILE_NAVIGATOR_CODE_REGEX.test(navigator.substr(0, 4))
        )
    }

    /**
     * isValidSymbol checks to see if the symbol is of correct type and format
     * @param  {String} symbol the symbol being checked
     * @return {Boolean} returns true if symbol is a string and valid format
     */
    export const isValidSymbol = (symbol: any): boolean => {
        return typeof symbol === 'string' && ALPHA_REGEX.test(symbol)
    }

    export const isBuffer = (value: any): boolean => {
        return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined
    }

    export const isObjectBy = (obj: any, prop: string): boolean => {
        return isNotNull(obj[prop]) && typeof obj[prop] === 'object' && !Array.isArray(obj[prop])
    }

    export const isInRange = (num: number, min: number, max: number): boolean => {
        if (!isNumber(num) || !isNumber(min) || !isNumber(max)) {
            throw typeException(
                `incorrect type of arguments: number < ${num} >, lower border < ${min} >, upper border < ${max} >`,
            )
        }

        if (min > max) {
            throw valueException(`incorrect arguments: lower border < ${min} >, upper border < ${max} >`)
        }

        return num < max && num > min
    }

    export const isArrayIndex = (key: string): boolean => {
        const numericKey = toUint32(key)

        return String(numericKey) === key && numericKey < Math.pow(2, 32) - 1
    }

    export const isIterable = (value: any): boolean => {
        return isNotNull(value) && typeof value[Symbol.iterator] === 'function'
    }

    export const areEqualNumbers = (num1: number, num2: number): boolean => {
        return Math.abs(num1 - num2) < Number.EPSILON
    }

    export const isNumber = (value: any): boolean => {
        return (
            isNotNull(value) &&
            (typeof value === 'number' || Object.toType(value) === 'number') &&
            isFinite(value)
        )
    }

    // let isInteger = function(x) { return (x ^ 0) === x; };
    // let isInteger = function(x) { return Math.round(x) === x; };
    // let isInteger = function(x) { return (typeof x === 'number') && (x % 1 === 0); };
    export const isIntNumber = (value: any): boolean => {
        // Math.round(x) === x;
        // return (/^-?\d+$/.test(str));
        return isNumber(value) && value % 1 === 0 && Number.isSafeInteger(value)
    }

    export const isFloat = (value: any): boolean => {
        return Number.isFinite(value) && !Number.isSafeInteger(value)
    }

    // positive only, integer or decimal point
    export const isPositiveDecimal = (value: any): boolean => {
        // Math.round(x) === x;
        return isNumber(value) && (!/\D/.test(value) || /^\d+\.\d+$/.test(value))
    }

    export const isAlphaNumeric = (value: any): boolean => {
        return (isNumber(value) || isString(value)) && !/^\s*$/.test(value) && !/\W/.test(value)
    }

    export const isRealNumber = (value): boolean => {
        // Math.round(x) === x;
        return isNumber(value) && value % 1 !== 0
    }

    export const isString = (value: any): boolean => {
        return isNotNull(value) && (typeof value === 'string' || Object.toType(value) === 'string')
    }

    export const isArray = (value: any): boolean => {
        // return myArray.constructor.toString().indexOf("Array") > -1;
        return isNotNull(value) && Object.prototype.toString.apply(value) === '[object Array]'
    }

    export const isJSON = (value: any): boolean => {
        return isNotNull(value) && Object.prototype.toString.apply(value) === '[object JSON]'
    }

    export const isObject = (value: any): boolean => {
        return isNotNull(value) && Object.prototype.toString.apply(value) === '[object Object]'
    }

    export const isDate = (value: any): boolean => {
        return (
            isNotNull(value) && Object.prototype.toString.apply(value) === '[object Date]' && isFinite(value)
        )
    }

    export const isFunction = (value: any): boolean => {
        return (
            isNotNull(value) && typeof value === 'function' && value.constructor && value.cal && value.apply
        )
    }

    export const isBoolean = (value: any): boolean => {
        return isNotNull(value) && (typeof value === 'boolean' || Object.toType(value) === 'boolean')
    }

    export const isDomElement = (value: any): boolean => {
        return (
            isNotNull(value) &&
            value.nodeName &&
            value === document.documentElement &&
            (value instanceof Element || value instanceof Node)
        )
    }

    /**
     * returns true if value is null or undefined, false - otherwise
     */
    export const isNullOrUndefined = (value: any): boolean => {
        return isNull(value) || typeof value === 'undefined'
    }

    export const isRegExp = (value: any): boolean => {
        return isNotNull(value) && Object.toType(value) === 'regexp'
    }

    export const isSet = (value: string): boolean => {
        return isNotNull(value) && typeof value !== 'undefined'
    }

    export const isEmail = (value: string): boolean => {
        return EMAIL_REGEX.test(value)
    }

    export const isDigit = (chr: string): boolean => {
        const charCode = (c: string): number => {
            return c.charCodeAt(0)
        }

        const code = charCode(chr)

        return code >= charCode('0') && code <= charCode('9')
    }
}
