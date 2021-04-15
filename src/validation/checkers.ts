import {
    ALPHA_REGEX,
    DATE_REGEX,
    EMAIL_REGEX,
    MOBILE_NAVIGATOR_CODE_REGEX,
    MOBILE_NAVIGATOR_TYPE_REGEX,
    PHONE_REGEX,
    URL_REGEX2,
    Numbers,
    Errors,
} from '..'

import { Optional } from '../../typings/standard-types'

export namespace Checkers {
    import valueError = Errors.valueError
    import validationError = Errors.validationError

    const { hasOwnProperty: hasOwnProp } = Object.prototype

    /**
     * Taken from jquery 1.6.1
     * [[Class]] -> type pairs
     * @private
     */
    const class2type = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object',
    }

    export const isTrue = (value: any): boolean => {
        const lowercase = value.toLowerCase()
        return (
            lowercase === '1' ||
            lowercase === 'on' ||
            lowercase === 't' ||
            lowercase === 'true' ||
            lowercase === 'y' ||
            lowercase === 'yes'
        )
    }

    export const getClass = (obj: any): Optional<string> => {
        const str = Object.prototype.toString.call(obj)
        const value = /^\[object (.*)]$/.exec(str)

        return value ? value[1] : null
    }

    export const getType = (obj: any): string => {
        return (
            {}.toString
                .call(obj)
                //.match(/\s(\w+)/)[1]
                .match(/\s([a-z|A-Z]+)/)[1]
                .toLowerCase()
        )
    }

    export const checkTypes = (types: string[], ...args: any[]): void => {
        args = [].slice.call(args)
        for (let i = 0; i < types.length; ++i) {
            if (getType(args[i]) !== types[i]) {
                throw validationError(`param [${i}] must be of type [${types[i]}]`)
            }
        }
    }

    export const isNull = (value: any): boolean => {
        return value === null
    }

    export const isUndefined = (value: any): boolean => {
        return value === undefined
    }

    export const isNotNull = (value: any): boolean => {
        return !isNull(value)
    }

    export const isNotUndefined = (value: any): boolean => {
        return !isUndefined(value)
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

    /**
     * A crude way of determining if an object is a window.
     * Taken from jQuery 1.6.1
     * @function isWindow
     * @see {@link http://www.jquery.com/ jQuery}
     */
    export const isWindow = (obj: any): boolean => {
        return obj && typeof obj === 'object' && 'setInterval' in obj
    }

    /**
     * Taken from jQuery 1.6.1
     * @function type
     * @see {@link http://www.jquery.com/ jQuery}
     */
    export const type = (obj: any): string => {
        return obj === null || obj === undefined ? String(obj) : class2type[toString.call(obj)] || 'object'
    }

    /**
     * Taken from jQuery 1.6.1
     * @function isPlainObject
     * @see {@link http://www.jquery.com/ jQuery}
     */
    export const isPlainObject = (obj: any): boolean => {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
            return false
        }

        // Not own constructor property must be Object
        if (
            obj.constructor &&
            !hasOwnProp.call(obj, 'constructor') &&
            !hasOwnProp.call(obj.constructor.prototype, 'isPrototypeOf')
        ) {
            return false
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        let lastKey
        for (const key in obj) {
            lastKey = key
        }

        return lastKey === undefined || hasOwnProp.call(obj, lastKey)
    }

    export const isBuffer = (value: any): boolean => {
        return value && isArrayBuffer(value.buffer || value) && !isUndefined(value.byteLength)
    }

    export const isObjectWith = (obj: any, prop: PropertyKey): boolean => {
        return isNotNull(obj[prop]) && typeof obj[prop] === 'object' && !Array.isArray(obj[prop])
    }

    export const isInRange = (num: number, min: number, max: number, includeBounds = false): boolean => {
        checkNumber(num)
        checkNumber(min)
        checkNumber(max)

        if (min > max) {
            throw valueError(`incorrect arguments: lower border < ${min} >, upper border < ${max} >`)
        }

        return includeBounds ? num <= max && num >= min : num < max && num > min
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

    export const isSafeInt = (value: any): boolean => {
        return (
            typeof value === 'number' &&
            Math.round(value) === value &&
            Number.MIN_SAFE_INTEGER <= value &&
            value <= Number.MAX_SAFE_INTEGER
        )
    }

    export const isFloat = (value: any): boolean => {
        // return typeof n === 'number' && n % 1 !== 0
        return Number.isFinite(value) && !Number.isSafeInteger(value)
    }

    export const isIterable = (value: any): boolean => {
        return isNotNull(value) && typeof value[Symbol.iterator] === 'function'
    }

    export const isNumber = (value: any): boolean => {
        return (
            isNotNull(value) && (typeof value === 'number' || getType(value) === 'number') && isFinite(value)
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

    export const isRealNumber = (value: any): boolean => {
        // Math.round(x) === x;
        return isNumber(value) && value % 1 !== 0
    }

    export const isInteger = (value: any): boolean => {
        return value === (value | 0)
    }

    export const isString = (value: any): boolean => {
        return isNotNull(value) && (typeof value === 'string' || getType(value) === 'string')
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

    export const isValidJson = (value: string): boolean => {
        try {
            JSON.parse(value)
            return true
        } catch (err) {
            return false
        }
    }

    export const inRange = (value: number, { min, max, inclusive = true }): boolean => {
        if (min > max) {
            throw valueError('Max value must be bigger then min value')
        }

        return inclusive ? min <= value && value <= max : min < value && value < max
    }

    export const isHostname = (value: string): boolean => {
        const regExp = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*$/
        return matchPattern(value, regExp)
    }

    export const includesUppercase = (value: string): boolean => {
        return matchPattern(value, /[A-Z]/)
    }

    export const includesLowercase = (value: string): boolean => {
        return matchPattern(value, /[a-z]/)
    }

    export const includesDigit = (value: string): boolean => {
        return matchPattern(value, /[0-9]/)
    }

    export const matchPattern = (value, regExp): boolean => {
        return !value || regExp.test(value)
    }

    export const isEmail = (value: string): boolean => {
        // eslint-disable-next-line no-control-regex
        const regExp = /^((([a-z]|\d|[!#\\$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\\$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)(((([\x20\x09])*(\x0d\x0a))?([\x20\x09])+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*((([\x20\x09])*(\x0d\x0a))?([\x20\x09])+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

        return matchPattern(value, regExp)
    }

    export const isObject = (value: any): boolean => {
        return isNotNull(value) && Object.prototype.toString.apply(value) === '[object Object]'
    }

    export const isArrayBuffer = (value: any): boolean => {
        return (
            isNotNull(value) &&
            isNotUndefined(value) &&
            Object.prototype.toString.apply(value.buffer || value) === '[object ArrayBuffer]'
        )
    }

    export const isDate = (value: any): boolean => {
        return (
            isNotNull(value) && Object.prototype.toString.apply(value) === '[object Date]' && isFinite(value)
        )
    }

    export const isPropertyInRange = (
        obj: any,
        prop: PropertyKey,
        low: number,
        high: number,
        includeBounds = false,
    ): void => {
        checkProperty(obj, prop)

        const value = includeBounds
            ? obj[prop] < low || obj[prop] > high
            : obj[prop] <= low || obj[prop] >= high
        if (value) {
            throw validationError(`incorrect property value=${obj[prop]}, is out of range: ${low}-${high}`)
        }
    }

    export const isPowerOfTwo = (value: number): boolean => {
        // return isIntNumber(value) && !(value && -value === value)
        return isIntNumber(value) && !(value & (value - 1))
    }

    export const isNumeric = (num: any): boolean => {
        return !isNaN(parseFloat(num)) && isFinite(num)
    }

    export const isFunction = (value: any): boolean => {
        return isNotNull(value) && typeof value === 'function' && value.constructor && value.apply
    }

    export const isBoolean = (value: any): boolean => {
        return isNotNull(value) && (typeof value === 'boolean' || getType(value) === 'boolean')
    }

    export const isDomElement = (value: any): boolean => {
        return (
            isNotNull(value) &&
            isNotUndefined(value) &&
            value.nodeName &&
            value === document.documentElement &&
            (value instanceof Element || value instanceof Node)
        )
    }

    /**
     * returns true if value is null or undefined, false - otherwise
     */
    export const isNullOrUndefined = (value: any): boolean => {
        return isNull(value) || isUndefined(value) || typeof value === 'undefined'
    }

    export const isRegExp = (value: any): boolean => {
        return isNotNull(value) && getType(value) === 'regexp'
    }

    export const isSet = (value: any): boolean => {
        return isNotNull(value) && isNotUndefined(value)
    }

    export const isDigit = (chr: string): boolean => {
        const charCode = (c: string): number => {
            return c.charCodeAt(0)
        }

        const code = charCode(chr)

        return code >= charCode('0') && code <= charCode('9')
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

    export const checkDateBy = (value: string, regex: string | RegExp = DATE_REGEX): boolean => {
        return new RegExp(regex).test(value)
    }

    export const checkStringByPatterns = (str: string): boolean => {
        const fal = str.search(/(negati|never|refus|wrong|fal|off)|\b([fn0])\b/gi) < 0 ? 0 : 1
        const not = (str.match(/\b(nay|nah|no|dis|un|in)/gi) || []).length & 1
        return !(fal ^ not)
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

    export const sanitizeNumber = (value: string): number => {
        value = value.replace(/[()&A-Za-z,%]/g, '')
        return Number(value)
    }

    export const isEmptyWithoutZero = (v: number | string): boolean => {
        return !v && v !== 0
    }

    export const hasClass = (clazz: string, pattern: string): boolean => {
        return new RegExp(`(^|\\s)${pattern}(\\s|$)`).test(clazz)
    }

    export const checkProperty = (obj: any, prop: PropertyKey): void => {
        if (!hasProperty(obj, prop)) {
            throw validationError(`Invalid property=${String(prop)} on object=${obj}`)
        }
    }

    /**
     * Returns a boolean indicating whether the object has the specified property.
     * @param {Object} obj An object.
     * @param {String} prop A property name.
     * @returns {Boolean}
     */
    export const hasProperty = (obj: any, prop: PropertyKey): boolean => {
        if (isNullOrUndefined(obj)) return false

        return isFunction(hasOwnProp) ? hasOwnProp.call(obj, prop) : prop in obj
    }

    /**
     * @private
     * @module comparators
     * @param obj initial input object to verify
     * @param prop initial input {@link PropertyKey} to validate by
     * @return {@link boolean} true - if property exists, false - otherwise
     */
    export const hasProperty2 = (obj: any, prop: PropertyKey): boolean => {
        const proto = obj.__proto__ || obj.constructor.prototype

        //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
        return hasOwnProp.call(obj, prop) || hasOwnProp.call(proto, prop) || proto[prop] === obj[prop]
    }

    /**
     * Checks for an object to be of the specified type; if not throws an Error.
     */
    export const checkType = (obj: any, type: any): void => {
        if (!is(obj, type)) {
            throw validationError(`Invalid parameter type: ${obj}. Expected type: ${type}`)
        }
    }

    /**
     * Checks for an object to be of the integer number type; if not throws an Error.
     */
    export const checkIntNumber = (obj: any): void => {
        checkType(obj, 'number')

        if (!isIntNumber(obj)) {
            throw validationError(`invalid integer number: ${obj}`)
        }
    }

    /**
     * Checks for an object to be of the float number type; if not throws an Error.
     */
    export const checkFloatNumber = (obj: any): void => {
        checkType(obj, 'number')

        if (!isFloat(obj)) {
            throw validationError(`invalid float number: ${obj}`)
        }
    }

    /**
     * Checks for an object to be of the number type; if not throws an Error.
     */
    export const checkNumber = (obj: any): void => {
        checkType(obj, 'number')
    }

    export const isIPv6 = (value: string): boolean => {
        return /(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))/.test(
            value,
        )
    }

    export const isIPv4 = (value: string): boolean => {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            value,
        )
    }

    /**
     * Checks for an object to be of the date type; if not throws an Error.
     */
    export const checkDate = (obj: any): void => {
        checkType(obj, 'date')
    }

    /**
     * Checks for an object to be of the object type; if not throws an Error.
     */
    export const checkObject = (obj: any): void => {
        checkType(obj, 'object')
    }

    /**
     * Checks for an object to be of the string type; if not throws an Error.
     */
    export const checkString = (obj: any): void => {
        checkType(obj, 'string')
    }

    /**
     * Checks for an object to be of the boolean type; if not throws an Error.
     */
    export const checkBoolean = (obj: any): void => {
        checkType(obj, 'boolean')
    }

    /**
     * Checks for an object to be of the function type; if not throws an Error.
     */
    export const checkFunction = (obj: any): void => {
        checkType(obj, 'function')
    }

    /**
     * Checks for an object to be of the null type; if not throws an Error.
     */
    export const checkNull = (obj: any): void => {
        checkType(obj, 'null')
    }

    /**
     * Checks for an object to be of the undefined type; if not throws an Error.
     */
    export const checkUndefined = (obj: any): void => {
        checkType(obj, 'undefined')
    }

    /**
     * Checks for an object to be of the json type; if not throws an Error.
     */
    export const checkJson = (obj: any): void => {
        checkType(obj, 'json')
    }

    /**
     * Checks for an object to be of the array type; if not throws an Error.
     */
    export const checkArray = (obj: any): void => {
        checkType(obj, 'array')
    }

    export const checkRange = (index: number, array: any[]): void => {
        checkNumber(index)

        if (index < 0 || index >= array.length) {
            throw validationError(`Invalid index: ${index}. not in range: ${array}`)
        }
    }

    export const isValidChartName = (name: string): boolean => !/[!@#$%^&*(),.?":{}/|<>A-Z]/.test(name)

    export const isSpace = (c: string): boolean => {
        return /\s/.test(c)
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
        } else if (isArray(obj)) {
            return type === 'array'
        }

        return obj && obj instanceof type
    }

    export const isBlankString = (value: string): boolean => {
        return !value || /^\s*$/.test(value)
    }

    export const isEmptyObject = (obj: any): boolean => {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }
}
