import { ALPHA_REGEX, MOBILE_NAVIGATOR_CODE_REGEX, MOBILE_NAVIGATOR_TYPE_REGEX } from './regex'
import { Numbers } from './numbers'

export namespace Checkers {
    import toUint32 = Numbers.toUint32
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

    export const isBuffer = (value): boolean => {
        return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined
    }

    export const isObject = (b, p): boolean => {
        return null !== b[p] && typeof b[p] === 'object' && !Array.isArray(b[p])
    }

    export const isInRange = (num, lowval, hival): boolean => {
        if (!isNumber(num) || !isNumber(lowval) || !isNumber(hival)) {
            throw typeException(
                'TypeError',
                `incorrect type of arguments: number < ${num} >, lower border < ${lowval} >, upper border < ${hival} >`,
            ) //new TypeError('');
        }
        if (lowval > hival) {
            throw argumentException(
                'ArgumentError',
                `incorrect arguments: lower border < ${lowval} >, upper border < ${hival} >`,
            ) //new TypeError('');
        }

        return num < hival && num > lowval
    }

    export const isArrayIndex = (key: string): boolean => {
        const numericKey = toUint32(key)
        return String(numericKey) === key && numericKey < Math.pow(2, 32) - 1
    }

    export const isIterable = (value: any): boolean => {
        return value !== null && typeof value[Symbol.iterator] === 'function'
    }

    // console.log(areTheNumbersAlmostEqual(0.1 + 0.2, 0.3));
    export const areEqualNumbers = (num1: number, num2: number): boolean => {
        return Math.abs(num1 - num2) < Number.EPSILON
    }

    export const isNumber = (value: any): boolean => {
        return (
            value !== null &&
            (typeof value === 'number' || Object.toType(value) === 'number') &&
            isFinite(value)
        )
    }

    // let isInteger = function(x) { return (x ^ 0) === x; };
    // let isInteger = function(x) { return Math.round(x) === x; };
    // let isInteger = function(x) { return (typeof x === 'number') && (x % 1 === 0); };
    export const isIntNumber = (value: any): boolean => {
        return isNumber(value) && value % 1 === 0 && Number.isSafeInteger(value)
        // Math.round(x) === x;
        // return (/^-?\d+$/.test(str));
    }

    export const isFloat = (value: any): boolean => {
        return Number.isFinite(value) && !Number.isSafeInteger(value)
    }

    // positive only, integer or decimal point
    export const isPositiveDecimal = (value: any): boolean => {
        return isNumber(value) && (!/\D/.test(value) || /^\d+\.\d+$/.test(value))
        // Math.round(x) === x;
    }

    // [a-z],[A-Z],[0-9] only
    export const isAlphaNumeric = (value: any): boolean => {
        return (isNumber(value) || isString(value)) && !/^\s*$/.test(value) && !/\W/.test(value)
    }

    export const isRealNumber = (value): boolean => {
        return isNumber(value) && value % 1 !== 0
        // Math.round(x) === x;
    }

    export const isString = (value: any): boolean => {
        return value !== null && (typeof value === 'string' || Object.toType(value) === 'string')
    }

    // return myArray.constructor.toString().indexOf("Array") > -1;
    export const isArray = (value: any): boolean => {
        return value !== null && Object.prototype.toString.apply(value) === '[object Array]'
    }

    export const isJSON = (value: any): boolean => {
        return value !== null && Object.prototype.toString.apply(value) === '[object JSON]'
    }

    export const isObject2 = (value: any): boolean => {
        return value !== null && Object.prototype.toString.apply(value) === '[object Object]'
    }

    export const isDate = (value: any): boolean => {
        return value !== null && Object.prototype.toString.apply(value) === '[object Date]' && isFinite(value)
    }

    export const isFunction = (value: any): boolean => {
        return value !== null && typeof value === 'function' && value.constructor && value.cal && value.apply
    }

    export const isBoolean = (value: any): boolean => {
        return value !== null && (typeof value === 'boolean' || Object.toType(value) === 'boolean')
    }

    export const isNull = (value: any): boolean => {
        return value == null
    }

    export const isDomElement = (value: any): boolean => {
        return (
            value !== null &&
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
        return value !== null && Object.toType(value) === 'regexp'
    }
}
