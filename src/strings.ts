import slugify from 'slugify'

import { Exceptions } from './exceptions'
import { Checkers } from './checkers'
import { NumberOrUndef, StringOrUndef } from '../typings/standard-types'
import { Supplier } from '../typings/function-types'
import { Maths } from './maths'

export namespace Strings {
    import isString = Checkers.isString
    import isIntNumber = Checkers.isIntNumber
    import isArray = Checkers.isArray
    import valueException = Exceptions.valueException
    import typeException = Exceptions.typeException
    import isNull = Checkers.isNull
    import isNumber = Checkers.isNumber
    import Helpers = Maths.Helpers

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

    export const capFirstLetter = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)

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
            throw valueException(`incorrect input string: < ${value} >`)
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
                throw valueException(`incorrect input string: < ${value} >`)
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
            throw valueException(`incorrect input string: < ${value} >`)
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
            throw valueException(`incorrect input string: < ${value} >`)
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
            throw valueException(`incorrect string length: < ${length} >`)
        }

        for (let i = 0; i < length; i++) {
            const rnum = Math.floor(Math.random() * chars.length)
            result += chars.substring(rnum, rnum + 1)
        }

        return result
    }

    export const prefixAverages = (array: number[]): number[] => {
        if (!isArray(array)) {
            throw typeException(`incorrect input argument: not array < ${array} >`)
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
            throw typeException(`incorrect parameter argument: not a string < ${value} >`)
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
            throw typeException(`incorrect parameter argument: not a string < ${value} >`)
        }

        const lines = value.split('\n')
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace('/\\s*/', tabExpand_)
            const chunks = chunkString(line, tab)

            if (chunks === null) {
                throw valueException(`Invalid chunk string ${chunks}`)
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

    // let seqer = serialMaker();
    // let unique = seqer.gensym();
    // document.writeln(unique);
    export const serialMaker = (prefix: StringOrUndef, seq: NumberOrUndef): { gensym: Supplier<string> } => {
        const prefixValue = prefix == null ? '' : isString(prefix) ? prefix : null
        if (isNull(prefixValue)) {
            throw valueException(`incorrect prefix value: < ${prefixValue} >`)
        }

        let seqValue = seq == null ? 0 : isNumber(seq) ? seq : null
        if (isNull(seqValue)) {
            throw valueException(`incorrect sequence value: < ${seqValue} >`)
        }

        return {
            gensym: () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return prefixValue + seqValue++
            },
        }
    }
}
