import {
    ALPHA_REGEX,
    DATE_REGEX,
    EMAIL_REGEX,
    MOBILE_NAVIGATOR_CODE_REGEX,
    MOBILE_NAVIGATOR_TYPE_REGEX,
    PHONE_REGEX,
    URL_REGEX2,
} from './regexes'
import { Numbers } from './numbers'
import { Errors } from './errors'
import { Objects } from './objects'

export namespace Checkers {
    import typeError = Errors.typeError
    import valueError = Errors.valueError
    import validationError = Errors.validationError

    export const isNull = (value: any): boolean => {
        return value === null
    }

    export const isUndefined = (value: any): boolean => {
        return value === undefined
    }

    export const isNotNull = (value: any): boolean => {
        return !isNull(value)
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

    export const isObjectBy = (obj: any, prop: PropertyKey): boolean => {
        return isNotNull(obj[prop]) && typeof obj[prop] === 'object' && !Array.isArray(obj[prop])
    }

    export const isInRange = (num: number, min: number, max: number): boolean => {
        checkType(num, 'number')
        checkType(min, 'number')
        checkType(max, 'number')

        if (!isNumber(num) || !isNumber(min) || !isNumber(max)) {
            throw typeError(
                `incorrect type of arguments: number < ${num} >, lower border < ${min} >, upper border < ${max} >`,
            )
        }

        if (min > max) {
            throw valueError(`incorrect arguments: lower border < ${min} >, upper border < ${max} >`)
        }

        return num < max && num > min
    }

    export const isArrayIndex = (key: string): boolean => {
        const numericKey = Numbers.toUint32(key)

        return String(numericKey) === key && numericKey < Math.pow(2, 32) - 1
    }

    export const areEqualNumbers = (num1: number, num2: number): boolean => {
        return Math.abs(num1 - num2) < Number.EPSILON
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

    export const isIterable = (value: any): boolean => {
        return isNotNull(value) && typeof value[Symbol.iterator] === 'function'
    }

    export const isNumber = (value: any): boolean => {
        return (
            isNotNull(value) &&
            (typeof value === 'number' || Objects.getType(value) === 'number') &&
            isFinite(value)
        )
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
        return isNotNull(value) && (typeof value === 'string' || Objects.getType(value) === 'string')
    }

    export const isArray = (value: any): boolean => {
        // return myArray.constructor.toString().indexOf("Array") > -1;
        return isNotNull(value) && Object.prototype.toString.apply(value) === '[object Array]'
    }

    export const isArray2 =
        Array.isArray ||
        ((value: any): boolean => {
            const ts = Object.prototype.toString
            return typeof value === 'object' && ts.call(value) === '[object Array]'
        })

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

    export const isPropertyInRange = (obj: any, prop: PropertyKey, low: number, high: number): void => {
        if (obj[prop] < low || obj[prop] > high) {
            throw validationError(`incorrect property value=${obj[prop]}, is out of range: ${low}-${high}`)
        }
    }

    export const isPowerOfTwo = (value: number): boolean => {
        // return isIntNumber(value) && !(value && -value === value)
        return isIntNumber(value) && !(value & (value - 1))
    }

    /**
     * Set a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const setBit = (value: number, index: number): number => {
        return value | (1 << index)
    }

    /**
     * Clear a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const clearBit = (value: number, index: number): number => {
        return value & ~(1 << index)
    }

    /**
     * Toggle a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const toggleBit = (value: number, index: number): number => {
        return value ^ (1 << index)
    }

    /**
     * Check a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const checkBit = (value: number, index: number): number => {
        return value & (1 << index)
    }

    export const isNumeric = (num: any): boolean => {
        return !isNaN(parseFloat(num)) && isFinite(num)
    }

    export const isFunction = (value: any): boolean => {
        return isNotNull(value) && typeof value === 'function' && value.constructor && value.apply
    }

    export const isBoolean = (value: any): boolean => {
        return isNotNull(value) && (typeof value === 'boolean' || Objects.getType(value) === 'boolean')
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
        return isNotNull(value) && Objects.getType(value) === 'regexp'
    }

    export const isSet = (value: string): boolean => {
        return isNotNull(value) && typeof value !== 'undefined'
    }

    export const isDigit = (chr: string): boolean => {
        const charCode = (c: string): number => {
            return c.charCodeAt(0)
        }

        const code = charCode(chr)

        return code >= charCode('0') && code <= charCode('9')
    }

    export const hasRegExp = (value: any): boolean => {
        try {
            new RegExp('.', value)
            return true
        } catch (ex) {
            return false
        }
    }

    export const checkEmail = (value: string): boolean => {
        return EMAIL_REGEX.test(value)
    }

    export const checkUrl = (value: string): boolean => {
        return URL_REGEX2.test(value)
    }

    export const checkPhone = (value: string): boolean => {
        return PHONE_REGEX.test(value)
    }

    export const checkDate = (value: string): boolean => {
        return DATE_REGEX.test(value)
    }

    export const CHECK_RULES = {
        // Checks for when a specified field is required
        required: {
            msg: 'This field is required.',
            test(obj, load) {
                // Make sure that there is no text was entered in the field and that
                // we aren't checking on page load (showing 'field required' messages
                // would be annoying on page load)
                return load || (obj && obj.value && obj.value !== obj.defaultValue)
            },
        },
        // Makes sure that the field s a valid email address
        email: {
            msg: 'Not a valid email address.',
            test(obj) {
                // Make sure that something was entered and that it looks like
                // an email address
                return obj && obj.value && /^[a-z0-9_+.-]+\\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i.test(obj.value)
            },
        },
        // Makes sure the field is a phone number and
        // auto-formats the number if it is one
        phone: {
            msg: 'Not a valid phone number.',
            test(obj) {
                // Check to see if we have something that looks like
                // a valid phone number
                const m = /(\d{3}).*(\d{3}).*(\d{4})/.exec(obj.value)
                // If it is, seemingly, valid - force it into the specific
                // format that we desire: (123) 456-7890
                if (m) obj.value = `(${m[1]}) ${m[2]}-${m[3]}`
                return obj && obj.value && m
            },
        },
        // Makes sure that the field is a valid MM/DD/YYYY date
        date: {
            msg: 'Not a valid date.',
            test(obj) {
                // Make sure that something is entered, and that it
                // looks like a valid MM/DD/YYYY date
                return obj && obj.value && /^\d{2}\/\d{2}\/\d{2,4}$/.test(obj.value)
            },
        },
        // Makes sure that the field is a valid URL
        url: {
            msg: 'Not a valid URL.',
            test(obj) {
                // Make sure that some text was entered, and that it's
                // not the default http:// text
                return (
                    obj &&
                    obj.value &&
                    // Make sure that it looks like a valid URL
                    /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test(obj.value)
                )
            },
        },
    }

    export const hasClass = (clazz: string, pattern: string): boolean => {
        return new RegExp(`(^|\\s)${pattern}(\\s|$)`).test(clazz)
    }

    /**
     * Checks for an object to be of the specified type; if not throws an Error.
     */
    export const checkType = (obj: any, type: any): void => {
        if (!is(obj, type)) {
            throw validationError(`Invalid parameter type. Expected type: ${type}`)
        }
    }

    export const isHostMethod = (obj: any, prop: PropertyKey): boolean => {
        return (obj && typeof obj[prop] === 'function') || isHostObject(obj, prop)
    }

    export const isHostObject = (obj: any, prop: PropertyKey): boolean => {
        return !!(obj && typeof obj[prop] === 'object' && obj[prop])
    }

    // Detects if an object is direct child of Object class (ie. object literal)
    export const isObjectLiteral = (() => {
        const _proto = Object.prototype,
            _prototype = Object.getPrototypeOf

        if (isFunction(_prototype)) {
            return obj => obj && _prototype(obj) === _proto
        }

        return obj => obj && obj.constructor.prototype === _proto
    })()

    /**
     * Determines whether an object is instance of a given type.
     * @param {Object} obj An object.
     * @param {Function} type The type to check.
     * @returns {Boolean}
     */
    export const is = (obj: any, type: any): boolean => {
        if (isNumber(obj)) {
            return type === 'number'
        } else if (isString(obj)) {
            return type === 'string'
        } else if (isFunction(obj)) {
            return type === 'function'
        } else if (isBoolean(obj)) {
            return type === 'boolean'
        } else if (isObject(obj)) {
            return type === 'object'
        } else if (isJSON(obj)) {
            return type === 'json'
        } else if (isDate(obj)) {
            return type === 'date'
        } else if (isNull(obj)) {
            return type === 'null'
        } else if (isUndefined(obj)) {
            return type === 'undefined'
        }

        return obj && obj instanceof type
    }
}
