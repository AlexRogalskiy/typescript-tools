import {
    ALPHA_REGEX,
    CommonUtils,
    Comparators,
    DATE_REGEX,
    domElementPattern,
    EitherType,
    EMAIL_REGEX,
    Errors,
    Left,
    MOBILE_NAVIGATOR_CODE_REGEX,
    MOBILE_NAVIGATOR_TYPE_REGEX,
    Numbers,
    PHONE_REGEX,
    Right,
    TOKEN_COMMENT,
    URL_REGEX2,
} from '..'

import { OptionType } from '../configuration/Option'

import { Bools } from '../types/Bools'
import { Optional } from '../../typings/standard-types'
import { BiPredicate, ITypedConstructor, Predicate } from '../../typings/function-types'
import { WithId, WithName } from '../../typings/domain-types'

export namespace Checkers {
    const { hasOwnProperty: hasOwnProp } = Object.prototype

    /**
     * Taken from jquery 1.6.1
     * [[Class]] -> type pairs
     * @private
     */
    const class2type = {
        '[object boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object',
    }

    type Validation<A> = (a: A, onError: Error) => EitherType<Error, A>

    export const isEmpty3: Validation<string> = (str: string, onError: Error): EitherType<Error, string> =>
        str !== '' ? Right(str) : Left(onError)

    export const safeCharCodeAt = (source: string, offset: number): number =>
        offset < source.length ? source.charCodeAt(offset) : 0

    export const isSign = (code: number): boolean => code === 0x002b || code === 0x002d

    export const isDigit2 = (code: number): boolean => code >= 0x0030 && code <= 0x0039

    export const isWS = (code: number): boolean =>
        code === 0x0009 || // \t
        code === 0x000a || // \n
        code === 0x000c || // \f
        code === 0x000d || // \r
        code === 0x0020

    export const isDelim = (code: number): boolean =>
        (code > 0x0020 &&
            code < 0x0100 && // ascii char
            (code < 0x0041 || code > 0x005a) && // not A..Z
            (code < 0x0061 || code > 0x007a) && // not a..z
            (code < 0x0030 || code > 0x0039) && // not 0..9
            code !== 0x002b && // not +
            code !== 0x002d) || // not -
        code === 0x2116

    export const eq = (a: any, b: any): boolean => {
        return Object.is(a, b)
    }

    export const isConstructor = <T>(obj: T | ITypedConstructor<T>): obj is ITypedConstructor<T> => {
        return isFunction(obj)
    }

    export const in_ = (a: any, b: any): boolean => {
        if (isPlainObject(b)) {
            return Object.prototype.hasOwnProperty.call(b, a)
        }

        return b && typeof b.indexOf === 'function' ? b.indexOf(a) !== -1 : false
    }

    export const match = (value, pattern): boolean => {
        if (typeof pattern === 'function') {
            return some(value, pattern)
        }

        if (isRegExp(pattern)) {
            return some(value, pattern.test.bind(pattern))
        }

        return pattern === null || pattern === undefined
    }

    // const lengthIs4 = checkProp(l => l === 4, 'length');
    // lengthIs4([]); // false
    // lengthIs4([1, 2, 3, 4]); // true
    // lengthIs4(new Set([1, 2, 3, 4])); // false (Set uses Size, not length)
    //
    // const session = { user: {} };
    // const validUserSession = checkProp(u => u.active && !u.disabled, 'user');
    //
    // validUserSession(session); // false
    //
    // session.user.active = true;
    // validUserSession(session); // true
    //
    // const noLength = checkProp(l => l === undefined, 'length');
    // noLength([]); // false
    // noLength({}); // true
    // noLength(new Set()); // true
    export const checkProp = (predicate: any, prop: PropertyKey): any => {
        return obj => !!predicate(obj[prop])
    }

    // assertValidKeys({ id: 10, name: 'apple' }, ['id', 'name']); // true
    // assertValidKeys({ id: 10, name: 'apple' }, ['id', 'type']); // false
    export const assertValidKeys = (obj: any, keys: PropertyKey[]): boolean =>
        Object.keys(obj).every(key => keys.includes(key))

    export const pick = (current: any, ref: BiPredicate<any, any>): any => {
        if (!current) {
            return undefined
        }

        if (typeof ref === 'function') {
            if (Array.isArray(current) || typeof current === 'string') {
                for (let i = 0; i < current.length; i++) {
                    if (ref(current[i], i)) {
                        return current[i]
                    }
                }
            }

            for (const key in current) {
                if (Object.prototype.hasOwnProperty.call(current, key)) {
                    if (ref(current[key], key)) {
                        return current[key]
                    }
                }
            }

            return undefined
        }

        if (Array.isArray(current) || typeof current === 'string') {
            return isFinite(ref)
                ? current[ref < 0 ? current.length + Number(ref) : Number(ref) || 0]
                : undefined
        }

        return Object.prototype.hasOwnProperty.call(current, ref) ? current[ref] : undefined
    }

    export const map = (value, getter): any => {
        const fn = typeof getter === 'function' ? getter : current => getPropertyValue(current, getter)

        if (Array.isArray(value)) {
            return [...value.reduce((set, item) => CommonUtils.addToSet(set, fn(item)), new Set())]
        }

        return value !== undefined ? fn(value) : value
    }

    export const mapRecursive = (value, getter): any => {
        const result = new Set()

        CommonUtils.addToSet(result, map(value, getter))

        for (const current of result) {
            CommonUtils.addToSet(result, map(current, getter))
        }

        return [...result]
    }

    export const some = (value: any, fn: any): boolean => {
        return Array.isArray(value) ? value.some(current => Bools.bool(fn(current))) : Bools.bool(fn(value))
    }

    export const filter = (value: any, fn: any): boolean[] => {
        if (Array.isArray(value)) {
            return value.filter(current => Bools.bool(fn(current)))
        }

        return Bools.bool(fn(value)) ? value : undefined
    }

    export const slice = (value, from = 0, to = value && value.length, step = 1): any => {
        if (!isArrayLike(value)) {
            return []
        }

        from = parseInt(String(from), 10) || 0
        to = parseInt(to, 10) || value.length
        step = parseInt(String(step), 10) || 1

        if (step !== 1) {
            const result: any[] = []

            from = from < 0 ? Math.max(0, value.length + from) : Math.min(value.length, from)
            to = to < 0 ? Math.max(0, value.length + to) : Math.min(value.length, to)

            for (let i = step > 0 ? from : to - 1; i >= from && i < to; i += step) {
                result.push(value[i])
            }

            return result
        }

        if (typeof value === 'string') {
            return value.slice(from, to)
        }

        return Array.prototype.slice.call(value, from, to)
    }

    export const isInRange2 = (start: number, end: number, num: number): boolean => {
        return num >= start && num <= end
    }

    export const checkRanges = (range: number[], num: number): boolean => {
        for (let i = 0; i < range.length; i += 2) {
            if (isInRange2(range[i], range[i + 1], num)) {
                return true
            }
        }
        return false
    }

    export const isArrayLike = (value: any): boolean => {
        return value && Object.prototype.hasOwnProperty.call(value, 'length')
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

    // https://github.com/facebook/jest/blob/be4bec387d90ac8d6a7596be88bf8e4994bc3ed9/packages/expect/src/jasmine_utils.js#L234
    export const isA = (typeName: string, value: any): boolean => {
        return Object.prototype.toString.apply(value) === `[object ${typeName}]`
    }

    export const isPlainObject2 = (value: any): boolean => {
        return value !== null && typeof value === 'object' && value.constructor === Object
    }

    export const isSuggestProhibitedChar = (str: string, offset: number): boolean => {
        return offset >= 0 && offset < str.length && /[a-zA-Z_$0-9]/.test(str[offset])
    }

    export const isWhiteSpace = (str: string, offset: number): boolean => {
        const code = str.charCodeAt(offset)
        return code === 9 || code === 10 || code === 13 || code === 32
    }

    export const onlyWsInRange = (str: string, start: number, end: number): boolean => {
        for (; start < end; start++) {
            if (!isWhiteSpace(str, start)) {
                return false
            }
        }

        return true
    }

    export const getPropertyValue = (value: any, property: string): any => {
        return value && Object.prototype.hasOwnProperty.call(value, property) ? value[property] : undefined
    }

    export const isDOMElement = (val: any): boolean => {
        return (
            val.nodeType === 1 &&
            val.constructor &&
            val.constructor.name &&
            domElementPattern.test(val.constructor.name)
        )
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
                throw Errors.validationError(`param [${i}] must be of type [${types[i]}]`)
            }
        }
    }

    export const isNull = (value: any): boolean => {
        return value === null
    }

    export const not = (a: any): boolean => !a

    export const or = (a: any, b: any): boolean => a || b

    // palindrome('taco cat'); // true
    export const palindrome = (str: string): boolean => {
        const s = str.toLowerCase().replace(/[\W_]/g, '')

        return s === [...s].reverse().join('')
    }

    // xor(true, true); // false
    // xor(true, false); // true
    // xor(false, true); // true
    // xor(false, false); // false
    export const xor = (a: any, b: any): boolean => (a || b) && !(a && b)

    // nor(true, true); // false
    // nor(true, false); // false
    // nor(false, false); // true
    export const nor = (a: any, b: any): boolean => !(a || b)

    export const withId = (id: number): Predicate<WithId> => {
        return (item: WithId) => item.id === id
    }

    export const withName = (name: string): Predicate<WithName> => {
        return (item: WithName) => item.name === name
    }

    export const extractFromString = (str: string): OptionType<number> => {
        const match = str.match(/.*?attribute.id=(\d+?)"/)

        return OptionType(match).map(results => +results[1])
    }

    // validateNumber('10'); // true
    // validateNumber('a'); // false
    export const validateNumber = (n: string): boolean => {
        const num = parseFloat(n)

        return !Number.isNaN(num) && Number.isFinite(num) && Number(n).toString() === n
    }

    export const isUndefined = (value: any): boolean => {
        return value === undefined
    }

    export const isNotNull = (value: any): boolean => {
        return !isNull(value)
    }

    export const isNotNullOrUndefined = (value: any): boolean => {
        return isNotNull(value) && isNotUndefined(value)
    }

    // isOf(Array, [1]); // true
    // isOf(ArrayBuffer, new ArrayBuffer(1)); // true
    // isOf(Map, new Map()); // true
    // isOf(RegExp, /./g); // true
    // isOf(Set, new Set()); // true
    // isOf(WeakMap, new WeakMap()); // true
    // isOf(WeakSet, new WeakSet()); // true
    // isOf(String, ''); // true
    // isOf(String, String('')); // true
    // isOf(Number, 1); // true
    // isOf(Number, Number(1)); // true
    // isOf(Boolean, true); // true
    // isOf(Boolean, Boolean(true)); // true
    export const isOf = (type: any, val: any): boolean =>
        ![undefined, null].includes(val) && val.constructor === type

    // isAfterDate(new Date(2010, 10, 21), new Date(2010, 10, 20)); // true
    export const isAfterDate = (dateA: Date, dateB: Date): boolean => dateA > dateB

    // isAlpha('sampleInput'); // true
    // isAlpha('this Will fail'); // false
    // isAlpha('123'); // false
    export const isAlpha = (str: string): boolean => /^[a-zA-Z]*$/.test(str)

    // isAlphaNumeric('hello123'); // true
    // isAlphaNumeric('123'); // true
    // isAlphaNumeric('hello 123'); // false (space character is not alphanumeric)
    // isAlphaNumeric('#$hello'); // false
    export const isAlphaNumeric2 = (str: string): boolean => /^[a-z0-9]+$/gi.test(str)

    export const containsWhitespace = (str: string): boolean => /\s/.test(str)

    // isObjectLike({}); // true
    // isObjectLike([1, 2, 3]); // true
    // isObjectLike(x => x); // false
    // isObjectLike(null); // false
    export const isObjectLike = (val: any): boolean => val !== null && typeof val === 'object'

    // isPlainObject({ a: 1 }); // true
    // isPlainObject(new Map()); // false
    export const isPlainObject4 = (val: any): boolean =>
        !!val && typeof val === 'object' && val.constructor === Object

    // isPowerOfTen(1); // true
    // isPowerOfTen(10); // true
    // isPowerOfTen(20); // false
    export const isPowerOfTen = (n: number): boolean => Math.log10(n) % 1 === 0

    // const fs = require('fs');
    // isReadableStream(fs.createReadStream('test.txt')); // true
    export const isReadableStream = (val: any): boolean =>
        val !== null &&
        typeof val === 'object' &&
        typeof val.pipe === 'function' &&
        typeof val._read === 'function' &&
        typeof val._readableState === 'object'

    // const origin = new URL('https://www.30secondsofcode.org/about');
    // const destination = new URL('https://www.30secondsofcode.org/contact');
    // isSameOrigin(origin, destination); // true
    // const other = new URL('https://developer.mozilla.org);
    // isSameOrigin(origin, other); // false
    export const isSameOrigin = (origin: Location, destination: Location): boolean =>
        origin.protocol === destination.protocol && origin.host === destination.host

    // const fs = require('fs');
    // isStream(fs.createReadStream('test.txt')); // true
    export const isStream = (val: any): boolean =>
        val !== null && typeof val === 'object' && typeof val.pipe === 'function'

    export const isTravisCI = (): boolean => 'TRAVIS' in process.env && 'CI' in process.env

    // isUpperCase('ABC'); // true
    // isUpperCase('A3@$'); // true
    // isUpperCase('aB4'); // false
    export const isUpperCase = (str: string): boolean => str === str.toUpperCase()

    // matches({ age: 25, hair: 'long', beard: true }, { hair: 'long', beard: true });
    // true
    // matches({ hair: 'long', beard: true }, { age: 25, hair: 'long', beard: true });
    // false
    export const matches = (obj: any, source: any): boolean =>
        Object.keys(source).every(key => obj.hasOwnProperty(key) && obj[key] === source[key])

    // const isGreeting = val => /^h(?:i|ello)$/.test(val);
    // matchesWith(
    //     { greeting: 'hello' },
    //     { greeting: 'hi' },
    //     (oV, sV) => isGreeting(oV) && isGreeting(sV)
    // ); // true
    export const matchesWith = (obj: any, source: any, fn: any): boolean =>
        Object.keys(source).every(
            key =>
                obj.hasOwnProperty(key) &&
                (typeof fn === 'function'
                    ? fn(obj[key], source[key], key, obj, source)
                    : obj[key] == source[key]),
        )

    // const fs = require('fs');
    // isWritableStream(fs.createWriteStream('test.txt')); // true
    export const isWritableStream = (val: any): boolean =>
        val !== null &&
        typeof val === 'object' &&
        typeof val.pipe === 'function' &&
        typeof val._write === 'function' &&
        typeof val._writableState === 'object'

    export const isWeekday = (d = new Date()): boolean => d.getDay() % 6 !== 0

    export const isWeekend = (d = new Date()): boolean => d.getDay() % 6 === 0

    // isValidJSON('{"name":"Adam","age":20}'); // true
    // isValidJSON('{"name":"Adam",age:"20"}'); // false
    // isValidJSON(null); // true
    export const isValidJSON = (str: string): boolean => {
        try {
            JSON.parse(str)
            return true
        } catch (e) {
            return false
        }
    }

    // isSorted([0, 1, 2, 2]); // 1
    // isSorted([4, 3, 2]); // -1
    // isSorted([4, 3, 5]); // 0
    // isSorted([4]); // 0
    export const isSorted = (arr: number[]): number => {
        if (arr.length <= 1) return 0
        const direction = arr[1] - arr[0]
        for (let i = 2; i < arr.length; i++) {
            if ((arr[i] - arr[i - 1]) * direction < 0) return 0
        }

        return Math.sign(direction)
    }

    export const isSessionStorageEnabled = (): boolean => {
        try {
            const key = '__storage__test'
            window.sessionStorage.setItem(key, 'null')
            window.sessionStorage.removeItem(key)
            return true
        } catch (e) {
            return false
        }
    }

    // isSameDate(new Date(2010, 10, 20), new Date(2010, 10, 20)); // true
    export const isSameDate = (dateA: Date, dateB: Date): boolean =>
        dateA.toISOString() === dateB.toISOString()

    // isPromiseLike({
    //     then: function() {
    //         return '';
    //     }
    // }); // true
    // isPromiseLike(null); // false
    // isPromiseLike({}); // false
    export const isPromiseLike = (obj: any): boolean =>
        obj !== null &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        // eslint-disable-next-line github/no-then
        typeof obj.then === 'function'

    // isPrimitive(null); // true
    // isPrimitive(undefined); // true
    // isPrimitive(50); // true
    // isPrimitive('Hello!'); // true
    // isPrimitive(false); // true
    // isPrimitive(Symbol()); // true
    // isPrimitive([]); // false
    // isPrimitive({}); // false
    export const isPrimitive = (val: any): boolean => Object(val) !== val

    // isPrime(11); // true
    export const isPrime = (num: number): boolean => {
        const boundary = Math.floor(Math.sqrt(num))
        for (let i = 2; i <= boundary; i++) if (num % i === 0) return false

        return num >= 2
    }

    // isPowerOfTwo(0); // false
    // isPowerOfTwo(1); // true
    // isPowerOfTwo(8); // true
    export const isPowerOfTwo2 = (n: number): boolean => !!n && (n & (n - 1)) == 0

    // isAnagram('iceman', 'cinema'); // true
    export const isAnagram = (str1: string, str2: string): boolean => {
        const normalize = (str: string): string =>
            str
                .toLowerCase()
                .replace(/[^a-z0-9]/gi, '')
                .split('')
                .sort(Comparators.cmp)
                .join('')

        return normalize(str1) === normalize(str2)
    }

    // isArrayLike([1, 2, 3]); // true
    // isArrayLike(document.querySelectorAll('.className')); // true
    // isArrayLike('abc'); // true
    // isArrayLike(null); // false
    export const isArrayLike2 = (obj: any): boolean =>
        obj != null && typeof obj[Symbol.iterator] === 'function'

    export const isDNSName = (str: string): boolean => {
        const regExp = /^[A-Za-z0-9][A-Za-z0-9-.]*[A-Za-z0-9]$/
        return regExp.test(str)
    }

    // isBeforeDate(new Date(2010, 10, 20), new Date(2010, 10, 21)); // true
    export const isBeforeDate = (dateA: Date, dateB: Date): boolean => dateA < dateB

    // isBetweenDates(
    //     new Date(2010, 11, 20),
    //     new Date(2010, 11, 30),
    //     new Date(2010, 11, 19)
    // ); // false
    // isBetweenDates(
    //     new Date(2010, 11, 20),
    //     new Date(2010, 11, 30),
    //     new Date(2010, 11, 25)
    // ); // true
    export const isBetweenDates = (dateStart: Date, dateEnd: Date, date: Date): boolean =>
        date > dateStart && date < dateEnd

    export const isBrowser = (): boolean => ![typeof window, typeof document].includes('undefined')

    // isAsyncFunction(function() {}); // false
    // isAsyncFunction(async function() {}); // true
    export const isAsyncFunction = (val: any): boolean =>
        Object.prototype.toString.call(val) === '[object AsyncFunction]'

    export const hasDuplicates = (arr: any[]): boolean => new Set(arr).size !== arr.length

    // getType(new Set([1, 2, 3])); // 'Set'
    export const getType2 = (v: any): string =>
        v === undefined ? 'undefined' : v === null ? 'null' : v.constructor.name

    export const isPortNumber = (value: number): boolean => {
        return isNumber(value) && value >= 1 && value <= 65536
    }

    // isDisjoint(new Set([1, 2]), new Set([3, 4])); // true
    // isDisjoint(new Set([1, 2]), new Set([1, 3])); // false
    export const isDisjoint = (a: any, b: any): boolean => {
        const sA = new Set(a),
            sB = new Set(b)

        return [...sA].every(v => !sB.has(v))
    }

    export const isLocalStorageEnabled = (): boolean => {
        try {
            const key = '__storage__test'
            window.localStorage.setItem(key, 'null')
            window.localStorage.removeItem(key)
            return true
        } catch (e) {
            return false
        }
    }

    export const isLowerCase = (str: string): boolean => str === str.toLowerCase()

    // isLeapYear(2019); // false
    // isLeapYear(2020); // true
    export const isLeapYear = (year: number): boolean => new Date(year, 1, 29).getMonth() === 1

    // isISOString('2020-10-12T10:10:10.000Z'); // true
    // isISOString('2020-10-12'); // false
    export const isISOString = (val: string): boolean => {
        const d = new Date(val)

        return !Number.isNaN(d.valueOf()) && d.toISOString() === val
    }

    // isGeneratorFunction(function() {}); // false
    // isGeneratorFunction(function*() {}); // true
    export const isGeneratorFunction = (val: any): boolean =>
        Object.prototype.toString.call(val) === '[object GeneratorFunction]'

    export const isObject2 = (obj: any): boolean => obj === Object(obj)

    // isNumber(1); // true
    // isNumber('1'); // false
    // isNumber(NaN); // false
    export const isNumber2 = (val: any): boolean => typeof val === 'number' && val === val

    export const isNode = (): boolean =>
        typeof process !== 'undefined' && !!process.versions && !!process.versions.node

    // isEmpty([]); // true
    // isEmpty({}); // true
    // isEmpty(''); // true
    // isEmpty([1, 2]); // false
    // isEmpty({ a: 1, b: 2 }); // false
    // isEmpty('text'); // false
    // isEmpty(123); // true - type is not considered a collection
    // isEmpty(true); // true - type is not considered a collection
    export const isEmpty = (val: any): boolean => val == null || !(Object.keys(val) || val).length

    // const Stream = require('stream');
    // isDuplexStream(new Stream.Duplex()); // true
    export const isDuplexStream = (val: any): boolean =>
        val !== null &&
        typeof val === 'object' &&
        typeof val.pipe === 'function' &&
        typeof val._read === 'function' &&
        typeof val._readableState === 'object' &&
        typeof val._write === 'function' &&
        typeof val._writableState === 'object'

    export const isDivisible = (dividend: number, divisor: number): boolean => dividend % divisor === 0

    // const x = Object.freeze({ a: 1 });
    // const y = Object.freeze({ b: { c: 2 } });
    // isDeepFrozen(x); // true
    // isDeepFrozen(y); // false
    export const isDeepFrozen = (obj: any): boolean =>
        Object.isFrozen(obj) &&
        Object.keys(obj).every(prop => typeof obj[prop] !== 'object' || isDeepFrozen(obj[prop]))

    export const isIP = (str: string): boolean => {
        const regExp =
            /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        return regExp.test(str)
    }

    export const escapeRegExp = (str: string): string => {
        return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
    }

    export const pluralize = (word: string, amount = 2): string => {
        if (amount === 1) {
            return word
        }

        return word.endsWith('y') ? `${word.slice(0, -1)}ies` : `${word}s`
    }

    export const splice = (str: string, start: number, end: number, replacement = ''): string => {
        return `${str.substr(0, start)}${replacement}${str.substr(end)}`
    }

    export const isNotUndefined = (value: any): boolean => {
        return !isUndefined(value)
    }

    export const isFalsy = (value: any): boolean => {
        return !value
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
     * @return {boolean} returns true if symbol is a string and valid format
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
        return isNotNullOrUndefined(obj[prop]) && typeof obj[prop] === 'object' && !Array.isArray(obj[prop])
    }

    export const isInRange = (num: number, min: number, max: number, includeBounds = false): boolean => {
        checkNumber(num)
        checkNumber(min)
        checkNumber(max)

        if (min > max) {
            throw Errors.valueError(`incorrect arguments: lower border < ${min} >, upper border < ${max} >`)
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
        return isNotNullOrUndefined(value) && typeof value[Symbol.iterator] === 'function'
    }

    export const isNumber = (value: any): boolean => {
        return (
            isNotNullOrUndefined(value) &&
            (typeof value === 'number' || getType(value) === 'number') &&
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

    export const isRealNumber = (value: any): boolean => {
        // Math.round(x) === x;
        return isNumber(value) && value % 1 !== 0
    }

    export const isInteger = (value: any): boolean => {
        return value === (value | 0)
    }

    export const isString = (value: any): boolean => {
        return isNotNullOrUndefined(value) && (typeof value === 'string' || getType(value) === 'string')
    }

    export const isArray = (value: any): boolean => {
        // return myArray.constructor.toString().indexOf("Array") > -1;
        return isNotNullOrUndefined(value) && isA('Array', value)
    }

    export const isArray2 =
        Array.isArray ||
        ((value: any): boolean => {
            return typeof value === 'object' && isA('Array', value)
        })

    export const isJSON = (value: any): boolean => {
        return isNotNullOrUndefined(value) && isA('JSON', value)
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
            throw Errors.valueError('Max value must be bigger then min value')
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
        const regExp =
            // eslint-disable-next-line no-control-regex
            /^((([a-z]|\d|[!#\\$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\\$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)(((([\x20\x09])*(\x0d\x0a))?([\x20\x09])+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*((([\x20\x09])*(\x0d\x0a))?([\x20\x09])+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

        return matchPattern(value, regExp)
    }

    export const isSpace2 = (s: string): Optional<RegExpMatchArray> => {
        return s.match(/^\s$/)
    }

    export const isComment = (line: string): Optional<RegExpMatchArray> => {
        return line.match(TOKEN_COMMENT)
    }

    export const isObject = (value: any): boolean => {
        return isNotNullOrUndefined(value) && isA('Object', value)
    }

    export const isArrayBuffer = (value: any): boolean => {
        return (
            isNotNullOrUndefined(value) && isNotUndefined(value) && isA('ArrayBuffer', value.buffer || value)
        )
    }

    export const isDate = (value: any): boolean => {
        return isNotNullOrUndefined(value) && isA('Date', value) && isFinite(value)
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
            throw Errors.validationError(
                `incorrect property value=${obj[prop]}, is out of range: ${low}-${high}`,
            )
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
        return isNotNullOrUndefined(value) && typeof value === 'function' && value.constructor && value.apply
    }

    export const isBoolean = (value: any): boolean => {
        return isNotNullOrUndefined(value) && (typeof value === 'boolean' || getType(value) === 'boolean')
    }

    export const isDomElement = (value: any): boolean => {
        return (
            isNotNullOrUndefined(value) &&
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
        return isNotNullOrUndefined(value) && getType(value) === 'regexp'
    }

    export const isSet = (value: any): boolean => {
        return isNotNullOrUndefined(value) && isNotUndefined(value)
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
            throw Errors.validationError(`Invalid property=${String(prop)} on object=${obj}`)
        }
    }

    /**
     * Returns a boolean indicating whether the object has the specified property.
     * @param {Object} obj An object.
     * @param {String} prop A property name.
     * @returns {boolean}
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
            throw Errors.validationError(`Invalid parameter type: ${obj}. Expected type: ${type}`)
        }
    }

    /**
     * Checks for an object to be of the integer number type; if not throws an Error.
     */
    export const checkIntNumber = (obj: any): void => {
        checkType(obj, 'number')

        if (!isIntNumber(obj)) {
            throw Errors.validationError(`invalid integer number: ${obj}`)
        }
    }

    /**
     * Checks for an object to be of the float number type; if not throws an Error.
     */
    export const checkFloatNumber = (obj: any): void => {
        checkType(obj, 'number')

        if (!isFloat(obj)) {
            throw Errors.validationError(`invalid float number: ${obj}`)
        }
    }

    /**
     * Checks for an object to be of the number type; if not throws an Error.
     */
    export const checkNumber = (obj: any): void => {
        checkType(obj, 'number')
    }

    export const hasSameProps = (obj1: any, obj2: any): boolean => {
        return Object.keys(obj1).every(prop => obj2.hasOwnProperty(prop))
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
    export const checkboolean = (obj: any): void => {
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
            throw Errors.validationError(`Invalid index: ${index}. not in range: ${array}`)
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
     * @returns {boolean}
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

    export const valueOrDefault = (val: any, defval: any): any =>
        val == null && defval != null ? defval : val

    export const isInRange3 = (value: number, min: number, max: number): boolean => {
        return !Math.floor((value - min) / (max - min))
    }

    export const isNr = (val: number): boolean => val != null && !isNaN(val) && isFinite(val)

    export const isPlainObject3 = (value: any): boolean => {
        const proto = Object.getPrototypeOf(value)

        return proto == null || Object.getPrototypeOf(proto) == null
    }

    /**
     * Checks whether the given response is a valid HTTP response
     * @param response the response to be checked
     * @return {boolean} {@code true} if the given response is a valid HTTP response, {@code false} otherwise
     */
    export const isValidHTTPResponse = (response: any): boolean => {
        if (!response) {
            return false
        }
        return response.statusCode && typeof response.statusCode === 'number'
    }

    export const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp)

        const h = `${date.getHours()}`.padStart(2, '0')
        const m = `${date.getMinutes()}`.padStart(2, '0')
        const s = `${date.getSeconds()}`.padStart(2, '0')
        const ms = `${date.getMilliseconds()}`.padEnd(3, '0')

        return `${h}:${m}:${s}.${ms}`
    }

    export const runAndSetInterval = (fn: () => void, ms: number): NodeJS.Timeout => {
        fn()

        return setInterval(fn, ms)
    }

    // https://stackoverflow.com/a/6109105
    export const timeToText = (previousString: string): string => {
        const current = Date.now()
        const previous = Number(previousString) || new Date(previousString).getTime()

        const msPerMinute = 60 * 1000
        const msPerHour = msPerMinute * 60
        const msPerDay = msPerHour * 24
        const msPerMonth = msPerDay * 30
        const msPerYear = msPerDay * 365

        const elapsed = current - previous

        if (elapsed < msPerMinute) {
            const seconds = Math.floor(elapsed / 1000)
            return `${seconds}s ago`
        }
        if (elapsed < msPerHour) {
            const minutes = Math.floor(elapsed / msPerMinute)
            return `${minutes}m ago`
        }
        if (elapsed < msPerDay) {
            const hours = Math.floor(elapsed / msPerHour)
            return `${hours}h ago`
        }
        if (elapsed < msPerMonth) {
            const days = Math.floor(elapsed / msPerDay)
            return `${days}d ago`
        }
        if (elapsed < msPerYear) {
            const months = Math.floor(elapsed / msPerMonth)
            return `${months}mo ago`
        }
        const years = Math.floor(elapsed / msPerYear)

        return `${years}y ago`
    }

    export const isValidURL = (url: string): boolean => {
        try {
            const parsed = new URL(url)

            if (!['https:', 'http:'].includes(parsed.protocol)) {
                return false
            }
            // https://stackoverflow.com/a/49185442
            return /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(parsed.href)
        } catch (error) {
            return false
        }
    }

    export const isPromise = (promise: unknown): boolean => {
        // eslint-disable-next-line github/no-then
        return !!promise && typeof (promise as Promise<string>).then === 'function'
    }

    export const areEqualNr = (n1: number, n2: number): boolean => Math.abs(n2 - n1) < 0.00001

    export const isBlankString = (value: string): boolean => {
        return !value || /^\s*$/.test(value)
    }

    export const isEmptyObject = (obj: any): boolean => {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }
}
