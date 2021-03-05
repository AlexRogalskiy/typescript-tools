import slugify from 'slugify'

import { Errors } from './errors'
import { Checkers } from './checkers'
import { NumberOrUndef, StringOrUndef } from '../typings/standard-types'
import { BiProcessor, Processor, StringProcessor, Supplier } from '../typings/function-types'
import { Maths } from './maths'
import { Numbers } from './numbers'
import { Comparators } from './comparators'
import { Utils } from './utils'

export namespace Strings {
    import isString = Checkers.isString
    import isIntNumber = Checkers.isIntNumber
    import isArray = Checkers.isArray
    import valueError = Errors.valueError
    import typeError = Errors.typeError
    import isNull = Checkers.isNull
    import isNumber = Checkers.isNumber
    import Helpers = Maths.Helpers
    import random = Numbers.random
    import Comparator = Comparators.Comparator
    import randomBy = Numbers.randomBy
    import isFunction = Checkers.isFunction
    import Commons = Utils.Commons

    export const props = (() => {
        const props = {
            proto: {
                replaceByRegex: 'replaceByRegex',
                replaceWith: 'replaceWith',
            },
        }

        const replaceWith_ = (self: any, regex: string | RegExp, replacement: string): string =>
            self.replace(regex, replacement)

        const replaceByRegex_ = (
            self: any,
            regex: string | RegExp,
            replacer: (substring: string, ...args: any[]) => string,
        ): string => self.replace(regex, replacer)

        if (!isFunction(String.prototype[props.proto.replaceWith])) {
            Commons.defineProperty(String.prototype, props.proto.replaceWith, {
                value(regex: string | RegExp, replacement: string) {
                    return replaceWith_(this, regex, replacement)
                },
            })
        }

        if (!isFunction(String.prototype[props.proto.replaceByRegex])) {
            Commons.defineProperty(String.prototype, props.proto.replaceByRegex, {
                value(regex: string | RegExp, replacer: (substring: string, ...args: any[]) => string) {
                    return replaceByRegex_(this, regex, replacer)
                },
            })
        }
    })()

    export const combinations = (value: string): string[] => {
        let str = ''
        const res: string[] = []

        const combine_ = (start: number): void => {
            for (let i = start; i < value.length - 1; i++) {
                str += value.charAt(i)
                res.push(str)
                combine_(i + 1)
                str = str.substring(0, str.length - 1) // res = res.slice(0, -1);
            }
            str += value.charAt(value.length - 1)
            res.push(str)
            str = str.substring(0, str.length - 1) // str = str.slice(0, -1);
        }

        combine_(0)

        return res
    }

    export const permutations = (value: string): string[] => {
        let str = ''
        const used = new Array(value.length)
        const res: string[] = []

        const permute_ = (): void => {
            if (str.length === value.length) {
                res.push(str)
            }
            for (let i = 0; i < value.length; i++) {
                if (used[i]) {
                    continue
                }
                str += value.charAt(i)
                used[i] = true
                permute_()
                used[i] = false
                str = str.substring(0, str.length - 1)
            }
        }

        permute_()

        return res
    }

    export const strToInt = (str: string): number => {
        let i = 0,
            num = 0,
            isNeg = false
        const len = str.length

        if (str.startsWith('-')) {
            isNeg = true
            i = 1
        }
        while (i < len) {
            num *= 10
            num += str.codePointAt(i++) || 0 - ('0'.codePointAt(0) || 0)
        }
        if (isNeg) {
            num = -num
        }

        return num
    }

    export const removeChars = (str: string, remove: string): string => {
        const s = str.split('')
        const r = remove.split('')
        let dst = 0
        const flags: boolean[] = []

        for (const item of r) {
            flags[item.charCodeAt(0)] = true
        }

        for (const item of s) {
            if (!flags[item.charCodeAt(0)]) {
                s[dst++] = item
            }
        }

        return s.join()
    }

    export const sortBy = (
        comparator: Comparator<{ index: number; value: string }> | null,
        ...args: string[]
    ): string[] => {
        const map = args.map((e, i) => {
            return { index: i, value: e.toLowerCase() }
        })

        comparator =
            comparator ||
            ((a, b) => {
                return +(a.value > b.value) || +(a.value === b.value) - 1
            })

        map.sort(comparator)

        return map.map(e => {
            return args[e.index]
        })
    }

    export const shortenString = (str: string, func: Processor<string, string>): string => {
        if (!isString(str)) {
            throw valueError(`incorrect input string: < ${str} >`)
        }

        return func(str[0]) + str.substring(1, str.length - 1).length + func(str[str.length - 1])
    }

    export const getRomanNotation = (num: number): string => {
        if (!isIntNumber(num) || num < 0) {
            throw valueError(`incorrect input value: number < ${num} >`)
        }

        let str = ''
        const props = {
            M: 1000,
            IM: 999,
            VM: 995,
            XM: 990,
            LM: 950,
            CM: 900,
            D: 500,
            ID: 499,
            VD: 495,
            XD: 490,
            LD: 450,
            CD: 400,
            C: 100,
            IC: 99,
            VC: 95,
            XC: 90,
            L: 50,
            IL: 49,
            VL: 45,
            XL: 40,
            X: 10,
            IX: 9,
            V: 5,
            IV: 4,
            I: 1,
        }

        const propNames = Object.getOwnPropertyNames(props)
        for (const value of propNames) {
            while (num - props[value] >= 0) {
                num = num - props[value]
                str += value
            }
        }

        return str
    }

    export const shortest = (words: string[], word1: string, word2: string): number => {
        let min = Number.MAX_VALUE
        let lastPosWord1 = -1
        let lastPosWord2 = -1
        let currentWord, distance

        for (let i = 0; i < words.length; i++) {
            currentWord = words[i]
            if (!currentWord.localeCompare(word1)) {
                lastPosWord1 = i

                distance = lastPosWord1 - lastPosWord2
                if (lastPosWord2 >= 0 && min > distance) {
                    min = distance
                }
            } else if (!currentWord.localeCompare(word2)) {
                lastPosWord2 = i
                distance = lastPosWord2 - lastPosWord1
                if (lastPosWord2 > 0 && min > distance) {
                    min = distance
                }
            }
        }

        return min
    }

    export const format = (n: number): string => {
        return n.toString().replace(/\.(\d\d)\d+/, '.$1')
    }

    export const formatNumber = (num: number, precision: number): string => {
        // format number with metric prefix such as 1.2k
        // n is integer. The number to be converted
        // m is integer. The number of decimal places to show. Default to 1.
        // returns a string, with possibly one of k M G T ... suffix. Show 1 decimal digit

        const prefix = [
            '',
            ' k',
            ' M',
            ' G',
            ' T',
            ' P',
            ' E',
            ' Z',
            ' Y',
            ' * 10^27',
            ' * 10^30',
            ' * 10^33',
        ]
        let i = 0
        precision = precision === undefined ? 1 : precision
        while ((num = num / 1000) >= 1) {
            i++
        }

        return (num * 1000).toFixed(precision).toString() + prefix[i]
    }

    export const twoChar = (num: number): string => {
        return String(num).length === 1 ? `0${num}` : `${num}`
    }

    // UK Postcode validation - John Gardner - http://www.braemoor.co.uk/software/postcodes.shtml
    export const getPostCode = (value: string): string | null => {
        const alpha1 = '[abcdefghijklmnoprstuwyz]',
            alpha2 = '[abcdefghklmnopqrstuvwxy]',
            alpha3 = '[abcdefghjkpmnrstuvwxy]',
            alpha4 = '[abehmnprvwxy]',
            alpha5 = '[abdefghjlnpqrstuwxyz]',
            regexes: RegExp[] = []

        let postCode = value,
            valid = false

        regexes.push(new RegExp(`^(${alpha1}{1}${alpha2}?[0-9]{1,2})(\\s*)([0-9]{1}${alpha5}{2})$`, 'i'))
        regexes.push(new RegExp(`^(${alpha1}{1}[0-9]{1}${alpha3}{1})(\\s*)([0-9]{1}${alpha5}{2})$`, 'i'))
        regexes.push(
            new RegExp(`^(${alpha1}{1}${alpha2}{1}?[0-9]{1}${alpha4}{1})(\\s*)([0-9]{1}${alpha5}{2})$`, 'i'),
        )
        regexes.push(/^(GIR)(\s*)(0AA)$/i)
        regexes.push(/^(bfpo)(\s*)([0-9]{1,4})$/i)
        regexes.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i)
        regexes.push(/^([A-Z]{4})(\s*)(1ZZ)$/i)
        regexes.push(/^(ai-2640)$/i)

        for (const item of regexes) {
            if (item.test(postCode)) {
                item.exec(postCode)
                postCode = `${RegExp.$1.toUpperCase()} ${RegExp.$3.toUpperCase()}`
                postCode = postCode.replace(/C\/O\s*/, 'c/o ')
                if (value.toUpperCase() === 'AI-2640') {
                    postCode = 'AI-2640'
                }
                valid = true
                break
            }
        }

        return valid ? postCode : null
    }

    export const xor = (input: string, pass: string): string => {
        let output = ''
        let pos = 0
        for (let i = 0; i < input.length; i++) {
            pos = Math.floor(i % pass.length)
            output += String.fromCharCode(input.charCodeAt(i) ^ pass.charCodeAt(pos))
        }
        return output
    }

    export const isNonEmptyString = (value: string): boolean => {
        return value !== undefined && value !== null && value.length > 0
    }

    export const isBlankString = (value: string): boolean => {
        return !value || /^\s*$/.test(value)
    }

    export const notBlankOrElse = (value: string, defaultValue: string): string => {
        return isBlankString(value) ? defaultValue : value
    }

    export const toString = (value: string | string[]): string => {
        return Array.isArray(value) ? value[0] : value
    }

    export const getProjectId = (value: any): string => {
        return slugify(value.name, { lower: true, remove: /[.'/]/g })
    }

    export const padL = (value: string, length: number): string => {
        while (value.length < length) {
            value = ` ${value}`
        }

        return value
    }

    export const htmlEncode = (value: string): string => {
        value = value.replace(/</g, '&lt;')
        value = value.replace(/>/g, '&gt;')
        value = value.replace(/ /g, '&nbsp;')

        value = value.replace(/[\u2018\u2019\u201A\uFFFD]/g, "'")
        value = value.replace(/[\u201c\u201d\u201e]/g, '"')
        value = value.replace(/\u02C6/g, '^')
        value = value.replace(/\u2039/g, '<')
        value = value.replace(/\u203A/g, '>')
        value = value.replace(/\u2013/g, '-')
        value = value.replace(/\u2014/g, '--')
        value = value.replace(/\u2026/g, '...')
        value = value.replace(/\u00A9/g, '(c)')
        value = value.replace(/\u00AE/g, '(r)')
        value = value.replace(/\u2122/g, 'TM')
        value = value.replace(/\u00BC/g, '1/4')
        value = value.replace(/\u00BD/g, '1/2')
        value = value.replace(/\u00BE/g, '3/4')
        value = value.replace(/[\u02DC|\u00A0]/g, ' ')

        return value
    }

    export const substantiveLineCount = (value: string): number =>
        value ? value.trim().split(/[\r]?\n/).length : 0

    export const str2ab8 = (str: string): Int8Array => {
        const bufView = new Int8Array(str.length)
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i)
        }

        return bufView
    }

    export const str2ab16 = (value: string): Uint16Array => {
        const bufView = new Uint16Array(value.length)
        for (let i = 0, strLen = value.length; i < strLen; i++) {
            bufView[i] = value.charCodeAt(i)
        }

        return bufView
    }

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    export const escapeRegExp = (value: string): string => {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
    }

    export const separator = (num: number, delim = '='): string => {
        return Array(num).join(delim)
    }

    export const toInputName = (value: string, prefix = 'INPUT_'): string => {
        return prefix + value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).toUpperCase()
    }

    export const toParamName = (value: string): string => {
        return value.replace(/-\w/g, match => match[1].toUpperCase())
    }

    export const capitalFirstLetter = (value: string): string =>
        value.charAt(0).toUpperCase() + value.slice(1)

    export const parseJson = (value: string, defaultValue: any = undefined): string | undefined => {
        try {
            return JSON.parse(value)
        } catch (e) {
            return defaultValue
        }
    }

    export const escape = (value: string): string => {
        return (
            value
                .replace(/\\n/g, '\\n')
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, '\\&')
                .replace(/\\r/g, '\\r')
                .replace(/\\t/g, '\\t')
                .replace(/\\b/g, '\\b')
                .replace(/\\f/g, '\\f')
                // eslint-disable-next-line no-control-regex
                .replace(/[\u0000-\u0019]+/g, '')
        )
    }

    export const capitalize = (input: string): string => {
        const inputArray = input.split(' ')
        const output: string[] = []

        for (const inputArrayItem of inputArray) {
            output.push(inputArrayItem.charAt(0).toUpperCase() + inputArrayItem.slice(1))
        }

        return output.join(' ')
    }

    export const join = (symbols: string[] | string, delim = ','): string => {
        return Array.isArray(symbols) ? symbols.join(delim) : symbols
    }

    export const removeLines = (value: string): string => {
        return value.replace(/\r?\n|\r/g, '')
    }

    export const replaceBy = (regex: string | RegExp, value: string, replace = ''): string =>
        value.replace(regex, replace)

    export const pad = (num: number, size = 2, type = '0'): string => `${num}`.padStart(size, type)

    //let message = tag`${count} items cost $${count * price}.toFixed(2).`;
    export const tag = <T>(literals: T[], ...substitutions: any[]): string => {
        let result = ''
        for (let i = 0; i < substitutions.length; i++) {
            result += literals[i]
            result += substitutions[i]
        }
        result += literals[literals.length - 1]
        return result
    }

    export const parseStyleString = <T>(style: string, oStyle: T): void => {
        let attr, value
        // eslint-disable-next-line github/array-foreach
        style
            .replace(/;\s*$/, '')
            .split(';')
            .forEach(chunk => {
                const pair = chunk.split(':')
                attr = pair[0].trim().toLowerCase()
                value = pair[1].trim()
                oStyle[attr] = value
            })
    }

    export const parseStyleObject = <T>(style: any, oStyle: T): void => {
        let attr, value
        for (const prop in style) {
            if (Object.prototype.hasOwnProperty.call(style, prop)) {
                if (typeof style[prop] === 'undefined') {
                    continue
                }
                attr = prop.toLowerCase()
                value = style[prop]
                oStyle[attr] = value
            }
        }
    }

    export const parseNumber = (value: string): RegExpExecArray | null => {
        if (!isString(value)) {
            throw valueError(`incorrect input string: < ${value} >`)
        }
        const regExp = /^-?\d+(?:\.\d*)?(?:e[+\\-]?\d+)?$/i

        return regExp.exec(value)
    }

    export const escapeSymbols = (() => {
        // Инициализируем таблицу перевода
        const initTransitionTable = (): number[] => {
            const trans: number[] = []

            for (let i = 0x410; i <= 0x44f; i++) {
                trans[i] = i - 0x350 // А-Яа-я
            }
            trans[0x401] = 0xa8 // Ё
            trans[0x451] = 0xb8 // ё

            return trans
        }

        return (value: string): string => {
            if (!isString(value)) {
                throw valueError(`incorrect input string: < ${value} >`)
            }

            const ret: number[] = []
            const transTable = initTransitionTable()

            for (let i = 0; i < value.length; i++) {
                let n = value.charCodeAt(i)
                if (typeof transTable[n] !== 'undefined') {
                    n = transTable[n]
                }
                if (n <= 0xff) {
                    ret.push(n)
                }
            }

            return window.escape(String.fromCharCode.apply(null, ret))
        }
    })()

    export const koi2unicode = (value: string): string => {
        if (!isString(value)) {
            throw valueError(`incorrect input string: < ${value} >`)
        }

        const CHAR_TABLE = unescape(
            '%u2500%u2502%u250C%u2510%u2514%u2518%u251C%u2524%u252C%u2534%u253C%u2580%u2584%u2588%u258C%u2590%u2591%u2592%u2593%u2320%u25A0%u2219%u221A%u2248%u2264%u2265%u00A0%u2321%u00B0%u00B2%u00B7%u00F7%u2550%u2551%u2552%u0451%u2553%u2554%u2555%u2556%u2557%u2558%u2559%u255A%u255B%u255C%u255D%u255E%u255F%u2560%u2561%u0401%u2562%u2563%u2564%u2565%u2566%u2567%u2568%u2569%u256A%u256B%u256C%u00A9%u044E%u0430%u0431%u0446%u0434%u0435%u0444%u0433%u0445%u0438%u0439%u043A%u043B%u043C%u043D%u043E%u043F%u044F%u0440%u0441%u0442%u0443%u0436%u0432%u044C%u044B%u0437%u0448%u044D%u0449%u0447%u044A%u042E%u0410%u0411%u0426%u0414%u0415%u0424%u0413%u0425%u0418%u0419%u041A%u041B%u041C%u041D%u041E%u041F%u042F%u0420%u0421%u0422%u0423%u0416%u0412%u042C%u042B%u0417%u0428%u042D%u0429%u0427%u042A',
        )

        const code2char = (code: number): string => {
            if (code >= 0x80 && code <= 0xff) {
                return CHAR_TABLE.charAt(code - 0x80)
            }

            return String.fromCharCode(code)
        }

        let res = ''
        for (let i = 0; i < value.length; i++) {
            res += code2char(value.charCodeAt(i))
        }

        return res
    }

    export const win2unicode = (value: string): string => {
        if (!isString(value)) {
            throw valueError(`incorrect input string: < ${value} >`)
        }

        const CHAR_TABLE = unescape(
            '%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457',
        )

        const code2char = (code: number): string => {
            if (code >= 0xc0 && code <= 0xff) {
                return String.fromCharCode(code - 0xc0 + 0x0410)
            }
            if (code >= 0x80 && code <= 0xbf) {
                return CHAR_TABLE.charAt(code - 0x80)
            }

            return String.fromCharCode(code)
        }

        let res = ''
        for (let i = 0; i < value.length; i++) {
            res += code2char(value.charCodeAt(i))
        }

        return res
    }

    export const guidGenerator = (): string => {
        const S4 = (): string => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
    }

    export const revisedRandId = (): string => {
        return Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(2, 10)
    }

    export const guid = (): string => {
        return 'xxxxxxxx-xxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, c => {
                const r = (Math.random() * 16) | 0,
                    v = c === 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
            .toUpperCase()
    }

    export const wordWrap = (value: string, width: number, brk: string, cut: boolean): string | undefined => {
        brk = brk || 'n'
        width = width || 75
        cut = cut || false

        if (!value) {
            return value
        }
        const regex = `.{1,${width}}(\\s|$)${cut ? `|.{${width}}|.+` : '|S+?(s|$)'}`

        return value.match(RegExp(regex, 'g'))?.join(brk)
    }

    export const randomString = (len = 8): string => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let result = ''

        const length = isIntNumber(len) && len > 0 ? len : null
        if (length == null) {
            throw valueError(`incorrect string length: < ${length} >`)
        }

        for (let i = 0; i < length; i++) {
            const rnum = Math.floor(Math.random() * chars.length)
            result += chars.substring(rnum, rnum + 1)
        }

        return result
    }

    export const randomString2 = (func = () => Math.random() > 0.8): string => {
        return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(func).join('')
    }

    export const randomizer = (options: string, prop: string): string[] => {
        const randomNumeric = (length: number): string => {
            return generateRandomString(length, '0123456789'.split(''))
        }

        const randomAlpha = (length: number): string => {
            const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
            return generateRandomString(length, alpha)
        }

        const randomAlphaNumeric = (length: number): string => {
            const alphanumeric = '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
            return generateRandomString(length, alphanumeric)
        }

        const generateRandomString = (length: number, chars: string[]): string => {
            let string = ''

            for (let i = 0; i < length; i++) {
                string += chars[random(chars.length)]
            }

            return string
        }

        let length = 8,
            type = 'alphanumeric'

        const storedVars: string[] = []
        const values = options.split('|')

        for (let i = 0; i < 2; i++) {
            if (values[i] && values[i].match(/^\d+$/)) {
                length = parseInt(values[i])
            }

            if (values[i] && values[i].match(/^(?:alpha)?(?:numeric)?$/)) {
                type = values[i]
            }
        }

        if (type === 'alpha') {
            storedVars[prop] = randomAlpha(length)
        } else if (type === 'numeric') {
            storedVars[prop] = randomNumeric(length)
        } else if (type === 'alphanumeric') {
            storedVars[prop] = randomAlphaNumeric(length)
        } else {
            storedVars[prop] = randomAlphaNumeric(length)
        }

        return storedVars
    }

    export const prefixAverages = (array: number[]): number[] => {
        if (!isArray(array)) {
            throw typeError(`incorrect input argument: not array < ${array} >`)
        }

        const len = array.length - 1
        const res = Helpers.vector(len, 0)
        for (let i = 0, temp = 0; i < len; i++) {
            temp += array[i]
            res[i] = Math.floor(temp / (i + 1))
        }

        return res
    }

    export const tabExpand = (value: string): string => {
        const tab = 8

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tabExpand_ = (str, p1, p2): string => {
            return p1 + ' '.repeat(p2.length * tab - (p1.length % tab))
        }

        if (!isString(value)) {
            throw typeError(`incorrect parameter argument: not a string < ${value} >`)
        }

        while (value.includes('\t')) {
            value = value.replace('/^([^\t\n]*)(\t+)/m', tabExpand_)
        }

        return value
    }

    export const tabUnexpand = (value: string): string => {
        const tab = 8

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tabExpand_ = (value, p1, p2): string => {
            return p1 + ' '.repeat(p2.length * tab - (p1.length % tab))
        }

        const chunkString = (value: string, length: number): RegExpMatchArray | null => {
            // str.match(/.{1,n}/g);
            // str.match(/(.|[\r\n]){1,n}/g);
            return value.match(new RegExp(`.{1,${length}}`, 'g'))
        }

        if (!isString(value)) {
            throw typeError(`incorrect parameter argument: not a string < ${value} >`)
        }

        const lines = value.split('\n')
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace('/\\s*/', tabExpand_)
            const chunks = chunkString(line, tab)

            if (chunks === null) {
                throw valueError(`Invalid chunk string ${chunks}`)
            }

            for (let j = 0; j < chunks.length - 1; j++) {
                chunks[j] = value.replace('/ {2,}$/', '\t')
            }

            if (chunks[chunks.length - 1] === ' '.repeat(tab)) {
                chunks[chunks.length - 1] = '\t'
            }
            lines[i] = chunks.join('')
        }

        return lines.join('\n')
    }

    /**
     * Returns string representation of function body
     * @param {Function} func Function to get body of
     * @return {String} Function body
     */
    export const getFunctionBody = (func: any): string => {
        return (String(func).match(/function[^{]*{([\s\S]*)}/) || {})[1]
    }

    export const joinBy = (value: string, delim = ' '): string => {
        return Array.prototype.join.call(value, delim)
    }

    export const filterBy = (value: string, regex = /[-aeiou]/): string => {
        return Array.prototype.filter.call(value, x => x.match(regex)).join('')
    }

    // let seqer = serialMaker();
    // let unique = seqer.gensym();
    // document.writeln(unique);
    export const serialMaker = (prefix: StringOrUndef, seq: NumberOrUndef): { gensym: Supplier<string> } => {
        const prefixValue = prefix == null ? '' : isString(prefix) ? prefix : null
        if (isNull(prefixValue)) {
            throw valueError(`incorrect prefix value: < ${prefixValue} >`)
        }

        let seqValue = seq == null ? 0 : isNumber(seq) ? seq : null
        if (isNull(seqValue)) {
            throw valueError(`incorrect sequence value: < ${seqValue} >`)
        }

        return {
            gensym: () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return prefixValue + seqValue++
            },
        }
    }

    export const stripComments = (code: string): string => {
        return code.replace(/\/\/.*|\/\*[^]*\*\//g, '')
    }

    export const parseIni = (
        value: string,
    ): { name: string | null; fields: { name: string; value: string }[] }[] | null => {
        // Start with an object to hold the top-level fields
        const categories: { name: string | null; fields: { name: string; value: string }[] }[] = [
            { name: null, fields: [] },
        ]

        for (const line of value.split(/\r?\n/)) {
            let match
            if (/^\s*(;.*)?$/.test(line)) {
                return null
            } else if ((match = line.match(/^\[(.*)]$/))) {
                categories.push({ name: match[1], fields: [] })
            } else if ((match = line.match(/^(\w+)=(.*)$/))) {
                categories[0].fields.push({ name: match[1], value: match[2] })
            } else {
                throw new Error(`Line '${line} ' is invalid.`)
            }
        }

        return categories
    }

    export const relativePos = (event, element): { x: number; y: number } => {
        const rect = element.getBoundingClientRect()

        return { x: Math.floor(event.clientX - rect.left), y: Math.floor(event.clientY - rect.top) }
    }

    export const encode = (value: string, delta: number): string => {
        return value
            .split('')
            .map(ch => String.fromCharCode(ch.charCodeAt(0) + delta))
            .join('')
    }

    export const checkPostCode = (toCheck: string): string | null => {
        const alpha1 = '[abcdefghijklmnoprstuwyz]',
            alpha2 = '[abcdefghklmnopqrstuvwxy]',
            alpha3 = '[abcdefghjkpmnrstuvwxy]',
            alpha4 = '[abehmnprvwxy]',
            alpha5 = '[abdefghjlnpqrstuwxyz]'

        const pcexp: RegExp[] = []
        let postCode: string = toCheck,
            valid = false

        pcexp.push(new RegExp(`^(${alpha1}{1}${alpha2}?[0-9]{1,2})(\\s*)([0-9]{1}${alpha5}{2})$`, 'i'))
        pcexp.push(new RegExp(`^(${alpha1}{1}[0-9]{1}${alpha3}{1})(\\s*)([0-9]{1}${alpha5}{2})$`, 'i'))
        pcexp.push(
            new RegExp(`^(${alpha1}{1}${alpha2}{1}?[0-9]{1}${alpha4}{1})(\\s*)([0-9]{1}${alpha5}{2})$`, 'i'),
        )
        pcexp.push(/^(GIR)(\s*)(0AA)$/i)
        pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i)
        pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i)
        pcexp.push(/^([A-Z]{4})(\s*)(1ZZ)$/i)
        pcexp.push(/^(ai-2640)$/i)

        for (const item of pcexp) {
            if (item.test(postCode)) {
                item.exec(postCode)
                postCode = `${RegExp.$1.toUpperCase()} ${RegExp.$3.toUpperCase()}`
                postCode = postCode.replace(/C\/O\s*/, 'c/o ')
                if (toCheck.toUpperCase() === 'AI-2640') {
                    postCode = 'AI-2640'
                }
                valid = true
                break
            }
        }

        return valid ? postCode : null
    }

    export const packageName = (value: string): string => {
        return value.replace(/extra-/, '').replace(/\W+/, '_')
    }

    export const toSnakeCase = (value: string, sep = '-'): string => {
        value = value.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`)
        value = value.replace(/[^A-Za-z0-9\\.]+/g, sep)
        value = value.replace(/^[^A-Za-z0-9\\.]+/, '')
        value = value.replace(/[^A-Za-z0-9\\.]+$/, '')

        return value.toLowerCase()
    }

    export const htmlText = (value: string): string => {
        return unescape(value.replace(/<.*?>/g, '')).replace(/&amp;/, '&')
    }

    export const joinList = (list: any[]): string => {
        return `(?:${list.join('|')})`
    }

    export const quote = (str: any, allowVars = false): string => {
        if (Array.isArray(str)) {
            return str.map(str => quote(str, allowVars)).join(' ')
        } else if (typeof str !== 'string') {
            str = String(str)
        }

        if (str === '') {
            return "''"
        }

        // If we only have double quotes and spaces, and no
        // single quotes, then we can simply surround with
        // single quotes and add a layer of escaping
        // sada\"sd -> 'sada\\"sd'
        if (/["\s]/.test(str) && !str.includes("'") && !allowVars) {
            return `'${str.replace(/([\\])/g, '\\$1')}'`
        }

        if (/["'\s]/.test(str)) {
            return doubleQuote(str, allowVars)
        }

        // if we haven't surrounded the word with a double or single quote, then
        // we escape any character with a special meaning. No idea what the ([A-z]:)?
        // is for. But I'm keeping it just in case.
        str = str.replace(/([A-z]:)?([#!"&'()*,:;<=>?@\\[\]^`{|}])/g, '$1\\$2')

        // if we allow vars, then $ will not be escaped, otherwise, escape.
        if (!allowVars) {
            str = str.replace(/[$]/g, '\\$')
        }

        return str
    }

    export const doubleQuote = (str: string, allowVars = false): string => {
        const escapedChars = ['"', '\\', '`', '!']
        if (!allowVars) {
            escapedChars.push('$')
        }

        const regex = RegExp(`([${escapedChars.join('')}])`, 'g')

        return `"${str.replace(regex, '\\$1')}"`
    }

    export const generateSymbol = (): string => {
        const r = (): number => randomBy(65, 90)

        return String.fromCharCode(r(), r(), r())
    }

    export const escape2 = (text: string): string => {
        return text.replace(/(\\:`_\*)/gi, '\\$1')
    }

    export const delim = (value = '>', num = 80): string => value.repeat(num)

    export const stringify = (obj: any, space = 2): string => {
        return JSON.stringify(obj, null, space)
    }

    export const joiner = (join: string, ...args: any[]): string => {
        const n = args.length

        if (n === 1) {
            return args[0]
        }
        if (n === 2) {
            return args.join(` ${join} `)
        }

        return `${args.slice(0, n - 1).join(', ')} ${join} ${args[n - 1]}`
    }

    export const encoder = (value: string, encoder: BiProcessor<string, number, string> = encode): string => {
        return [].map.call(value, encoder).join('')
    }

    export const replacer = (
        value: string[],
        pattern: RegExp | string = /\b./g,
        encoder: StringProcessor<string> = (a: string): string => a.toUpperCase(),
    ): string[] => {
        return ''.replace.call(value, pattern, encoder).split(',')
    }

    export const matcher = (value: string[], pattern: RegExp | string = /[a-z][0-9]+/g): string[] => {
        return ''.match.call(value, pattern)
    }

    export const lowerCase = (...args: string[]): string[] => {
        return ''.toLowerCase.apply(args).split(',')
    }

    export const trimmer = (...args: string[]): string[] => {
        return [].map.call(args, v => ''.trim.apply(v))
    }

    export const longestSequence = (
        compareFunc,
        myEnum: string,
    ): { member: StringOrUndef; count: number } => {
        let result: { member: string | null; count: number } = { member: null, count: 0 }
        let thisCount = 1
        for (let i = 1; i < myEnum.length; ++i) {
            if (myEnum[i] !== ' ' && compareFunc(myEnum[i - 1], myEnum[i])) {
                if (++thisCount >= result.count) {
                    result = { member: myEnum[i], count: thisCount }
                }
            } else {
                thisCount = 1
            }
        }

        return { member: result.member, count: result.count }
    }
}
