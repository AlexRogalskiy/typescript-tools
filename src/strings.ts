import slugify from 'slugify'
import { Exceptions } from './exceptions'
import { Checkers } from './checkers'
import { Maths } from './maths'

export namespace Strings {
    import isString = Checkers.isString;
    import isIntNumber = Checkers.isIntNumber;
    import isArray = Checkers.isArray;
    import vector = Maths.vector;
    import valueException = Exceptions.valueException;
    import typeException = Exceptions.typeException;

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

    export const getProjectId = (project: any): string => {
        return slugify(project.name, { lower: true, remove: /[.'/]/g })
    }

    export const padL = (text: string, length: number): string => {
        while (text.length < length) {
            text = ` ${text}`
        }

        return text
    }

    export const htmlEncode = (text: string): string => {
        text = text.replace(/</g, '&lt;')
        text = text.replace(/>/g, '&gt;')
        text = text.replace(/ /g, '&nbsp;')

        text = text.replace(/[\u2018\u2019\u201A\uFFFD]/g, "'")
        text = text.replace(/[\u201c\u201d\u201e]/g, '"')
        text = text.replace(/\u02C6/g, '^')
        text = text.replace(/\u2039/g, '<')
        text = text.replace(/\u203A/g, '>')
        text = text.replace(/\u2013/g, '-')
        text = text.replace(/\u2014/g, '--')
        text = text.replace(/\u2026/g, '...')
        text = text.replace(/\u00A9/g, '(c)')
        text = text.replace(/\u00AE/g, '(r)')
        text = text.replace(/\u2122/g, 'TM')
        text = text.replace(/\u00BC/g, '1/4')
        text = text.replace(/\u00BD/g, '1/2')
        text = text.replace(/\u00BE/g, '3/4')
        text = text.replace(/[\u02DC|\u00A0]/g, ' ')

        return text
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

    export const str2ab16 = (str: string): Uint16Array => {
        const bufView = new Uint16Array(str.length)
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i)
        }

        return bufView
    }

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    export const escapeRegExp = (string: string): string => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
    }

    export const separator = (num: number, delim = '='): string => {
        return Array(num).join(delim)
    }

    export const toInputName = (str: string, prefix = 'INPUT_'): string => {
        return prefix + str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).toUpperCase()
    }

    export const toParamName = (str: string): string => {
        return str.replace(/-\w/g, match => match[1].toUpperCase())
    }

    export const capFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

    export const parseJson = (str: string, defaultValue: any = undefined): string | undefined => {
        try {
            return JSON.parse(str)
        } catch (e) {
            return defaultValue
        }
    }

    export const escape = (str: string): string => {
        return (
            str
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

    export const join = (symbols: string[] | string, delim = ','): string => {
        return Array.isArray(symbols) ? symbols.join(delim) : symbols
    }

    export const removeLines = (str: string): string => {
        return str.replace(/\r?\n|\r/g, '')
    }

    export const replaceBy = (regex: string | RegExp, str: string, replace = ''): string =>
        str.replace(regex, replace)

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

    export const parseNumber = (str: string): RegExpExecArray | null => {
        if (!isString(str)) {
            throw valueException(`incorrect input string: < ${str} >`)
        }
        const regExp = /^-?\d+(?:\.\d*)?(?:e[+\\-]?\d+)?$/i

        return regExp.exec(str)
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

        return (str: string): string => {
            if (!isString(str)) {
                throw valueException(`incorrect input string: < ${str} >`)
            }

            const ret: number[] = []
            const transTable = initTransitionTable()

            for (let i = 0; i < str.length; i++) {
                let n = str.charCodeAt(i)
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

    export const koi2unicode = (str: string): string => {
        if (!isString(str)) {
            throw valueException(`incorrect input string: < ${str} >`)
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
        for (let i = 0; i < str.length; i++) {
            res += code2char(str.charCodeAt(i))
        }

        return res
    }

    export const win2unicode = (str: string): string => {
        if (!isString(str)) {
            throw valueException(`incorrect input string: < ${str} >`)
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
        for (let i = 0; i < str.length; i++) {
            res += code2char(str.charCodeAt(i))
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

    export const wordWrap = (str: string, width: number, brk: string, cut: boolean): string | undefined => {
        brk = brk || 'n'
        width = width || 75
        cut = cut || false

        if (!str) {
            return str
        }
        const regex = `.{1,${width}}(\\s|$)${cut ? `|.{${width}}|.+` : '|S+?(s|$)'}`

        return str.match(RegExp(regex, 'g'))?.join(brk)
    }

    export const randomString = (strLength = 8): string => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let result = ''

        const len = isIntNumber(strLength) && strLength > 0 ? strLength : null
        if (len == null) {
            throw valueException(`incorrect string length: < ${length} >`)
        }

        for (let i = 0; i < len; i++) {
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
        const res = vector(len, 0)
        for (let i = 0, temp = 0; i < len; i++) {
            temp += array[i]
            res[i] = Math.floor(temp / (i + 1))
        }

        return res
    }

    export const tabExpand = (str: string): string => {
        const tab = 8

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tabExpand_ = (str, p1, p2): string => {
            return p1 + ' '.repeat(p2.length * tab - (p1.length % tab))
        }

        if (!isString(str)) {
            throw typeException(`incorrect parameter argument: not a string < ${str} >`)
        }

        while (str.includes('\t')) {
            str = str.replace('/^([^\t\n]*)(\t+)/m', tabExpand_)
        }

        return str
    }

    export const tabUnexpand = (str: string): string => {
        const tab = 8

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tabExpand_ = (str, p1, p2): string => {
            return p1 + ' '.repeat(p2.length * tab - (p1.length % tab))
        }

        const chunkString = (str: string, length: number): RegExpMatchArray | null => {
            // str.match(/.{1,n}/g);
            // str.match(/(.|[\r\n]){1,n}/g);
            return str.match(new RegExp(`.{1,${length}}`, 'g'))
        }

        if (!isString(str)) {
            throw typeException(`incorrect parameter argument: not a string < ${str} >`)
        }

        const lines = str.split('\n')
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace('/\\s*/', tabExpand_)
            const chunks = chunkString(line, tab)

            if (chunks === null) {
                throw valueException(`Invalid chunk string ${chunks}`)
            }

            for (let j = 0; j < chunks.length - 1; j++) {
                chunks[j] = str.replace('/ {2,}$/', '\t')
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
     * @param {Function} fn Function to get body of
     * @return {String} Function body
     */
    export const getFunctionBody = (fn): string => {
        return (String(fn).match(/function[^{]*{([\s\S]*)\}/) || {})[1]
    }
}
