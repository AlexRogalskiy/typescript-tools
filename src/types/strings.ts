import _ from 'lodash'

import { IOptions, Minimatch } from 'minimatch'
import slugify from 'slugify'
import cryptoRandomString from 'crypto-random-string'
import { XmlDocument } from 'xmldoc'
import { createHash, randomBytes } from 'crypto'
import { promises } from 'fs'
import { sep, posix } from 'path'
import yaml from 'js-yaml'

import { RegexStringPair } from '../../typings/general-types'
import { LockFile, LockFileEntry } from '../../typings/domain-types'
import { Optional, OptionalNumber, OptionalString } from '../../typings/standard-types'
import { BiProcessor, Comparator, Processor, StringProcessor, Supplier } from '../../typings/function-types'

import {
    Errors,
    Checkers,
    Maths,
    Numbers,
    CommonUtils,
    Logging,
    Arrays,
    REGEX_ENTITY_PAIRS,
    REGEX_CONTROL_PAIRS,
    REGEX_ASCII_PAIRS,
    TOKEN_WHITESPACE,
} from '..'

import { buildTimeRegex, githubRegex } from './regexes'

export namespace Strings {
    const ACCEPTABLE_RANDOM_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklnopqrstuvwxyz0123456789'

    import Helpers = Maths.Helpers

    import isString = Checkers.isString
    import isIntNumber = Checkers.isIntNumber
    import isArray = Checkers.isArray
    import isNull = Checkers.isNull
    import isNumber = Checkers.isNumber
    import isFunction = Checkers.isFunction

    import valueError = Errors.valueError
    import typeError = Errors.typeError

    import random = Numbers.random
    import randomBy = Numbers.randomBy
    import defineProperty = CommonUtils.defineProperty
    import defineStaticProperty = CommonUtils.defineStaticProperty
    import errorLogs = Logging.errorLogs
    import makeArray3 = Arrays.makeArray3

    export const fixedEncode = (value: string, ...pairs: RegexStringPair[]): string => {
        let result = value

        for (const pair of pairs) {
            result = result.replace(pair.left, pair.right)
        }

        return result
    }

    export const datePrefix = `[${new Date().toLocaleTimeString()}] `

    export const substitute = (value: string): string => {
        return value.replace(/^\W+/, '').replace(/\W+$/, '')
    }

    // Converts to a POSIX-style path
    export const posixPath = (p: string): string => {
        return p.split(sep).join(posix.sep)
    }

    export const isMatch = (value: string, ...patterns: string[]): boolean => {
        console.debug(`>>> matching patterns against value: ${value}`)

        return patterns.map(v => new Minimatch(v)).every(matcher => matcher.match(value))
    }

    export const checkAll = (changedFiles: string[], glob: string, options?: IOptions): boolean => {
        console.debug(`>>> checking "all" pattern ${glob}`)

        if (!changedFiles.length) return false

        const matcher = new Minimatch(glob, options)

        return changedFiles.every(file => matcher.match(file))
    }

    export const checkAny = (changedFiles: string[], glob: string, options?: IOptions): boolean => {
        console.debug(`>>> checking "any" pattern ${glob}`)

        if (!changedFiles.length) return false

        const matcher = new Minimatch(glob, options)

        return changedFiles.some(file => matcher.match(file))
    }

    // Takes a single line of text and parses out the cmd and rest,
    // which are used for dispatching to more exact parsing functions.
    export const splitCommand = (line: string): any => {
        // Make sure we get the same results irrespective of leading/trailing spaces
        const match = line.match(TOKEN_WHITESPACE)

        if (!match) {
            return {
                name: line.toUpperCase(),
                rest: '',
            }
        }

        const index = match.index ? match.index : 0
        const name = line.substr(0, index).toUpperCase()
        const rest = line.substr(index + match[0].length)

        return {
            name,
            rest,
        }
    }

    export const shortHash = (buffer: any): string => {
        const h = createHash('sha256')
        h.write(buffer)
        h.end()
        return h.digest('hex').slice(0, 20)
    }

    export const splitTags = (value: string): string[] => {
        return value.trim().split(/\s*,\s*/)
    }

    export const getLineFromPos = (str, pos, matchPartial = '', matchValue = ''): number => {
        let offset = 1

        // When match is within multiple lines
        if (matchPartial && /[\n\r]/g.test(matchPartial)) {
            offset = getLineFromPos(matchPartial, matchPartial.indexOf(matchValue))
        }

        const lines = str.substr(0, pos).match(/[\n\r]/g)

        return lines ? lines.length + offset : offset
    }

    export const matches = (blobString, regex): any => {
        const lines = blobString.split('\n')

        return [...blobString.matchAll(regex)]
            .map(match => {
                const matchPartial = match[0]
                const matchValue = match[1]

                if (!matchValue) {
                    return undefined
                }

                const lineNumber = getLineFromPos(blobString, match.index, matchPartial, matchValue)

                let matchValueStriped = matchValue
                if (matchValue.length !== matchValue.replace(/['|"]/g, '').length) {
                    matchValueStriped = matchValueStriped.replace(/['|"]/g, '')
                }

                const line = lines[lineNumber - 1]
                const startPos = line.lastIndexOf(matchValue)
                const endPos = startPos + matchValue.length

                const offset = lineNumber === 1 ? 0 : 1
                const startPosInBlob = lines.slice(0, lineNumber - 1).join(' ').length + startPos + offset
                const endPosInBlob = startPosInBlob + matchValue.length

                return {
                    lineNumber,
                    startPosInBlob,
                    endPosInBlob,
                    startPos,
                    endPos,
                    values: [matchValueStriped, ...match.slice(2)],
                }
            })
            .filter(Boolean)
    }

    export const extractYaml = (content: string, options = { json: true }): Optional<string> => {
        try {
            return yaml.safeLoad(content, options)
        } catch (err) {
            errorLogs('Failed to parse helm requirements.yaml')
            return null
        }
    }

    export const envReplace = (value: any, env = process.env, regex = /(\\*)\${([^}]+)}/g): string => {
        if (!_.isString(value)) {
            return value
        }

        return value.replace(regex, (match, envVarName): any => {
            if (env[envVarName] === undefined) {
                console.warn(`Failed to replace env in config: ${match}`)
                throw new Error('env-replace')
            }

            return env[envVarName]
        })
    }

    export const getRandomString = (length = 15): string => {
        return cryptoRandomString(length)
    }

    export const getSectionName = (str: string): string => {
        const [, sectionName] = /^\[\s*([^\s]+)\s*]\s*$/.exec(str) || []
        return sectionName
    }

    export const getSectionRecord = (str: string): string => {
        const [, sectionRecord] = /^([^\s]+)\s+=/.exec(str) || []
        return sectionRecord
    }

    export const readFileAsXmlDocument = async (file: string): Promise<XmlDocument> => {
        try {
            return new XmlDocument(await promises.readFile(file, { encoding: 'utf-8' }))
        } catch (err) {
            console.error(`failed to parse '${file}' as XML document, message ${err.message}`)
            return undefined
        }
    }

    export const parsePythonVersion = (str: string): number[] => {
        const arr = str.split(' ')[1].split('.')

        return [parseInt(arr[0], 10), parseInt(arr[1], 10)]
    }

    export async function getNpmLock(filePath: string): Promise<LockFile> {
        const lockRaw = await promises.readFile(filePath, 'utf8')

        try {
            const lockParsed = JSON.parse(lockRaw)
            const lockedVersions: Record<string, string> = {}
            for (const [entry, val] of Object.entries((lockParsed.dependencies || {}) as LockFileEntry)) {
                console.info({ entry, version: val.version })
                lockedVersions[entry] = val.version
            }
            return { lockedVersions, lockfileVersion: lockParsed.lockfileVersion }
        } catch (err) {
            console.error({ filePath, err }, 'Warning: Exception parsing npm lock file')
            return { lockedVersions: {} }
        }
    }

    export const formatBuildTime = (timeStr: string): Optional<string> => {
        if (!timeStr) {
            return null
        }

        if (buildTimeRegex.test(timeStr)) {
            return timeStr.replace(buildTimeRegex, '$1-$2-$3T$4:$5:$6$7')
        }

        return null
    }

    export const isDefaultRepo = (url: string, accountName: string, repoName: string): boolean => {
        const match = githubRegex.exec(url)
        if (match) {
            const { account, repo } = match.groups || {}
            return account.toLowerCase() === accountName && repo.toLowerCase() === repoName
        }
        return false
    }

    export const props = (() => {
        const props = {
            proto: {
                replaceByRegex: 'replaceByRegex',
                replaceWith: 'replaceWith',
                escapeSpecialChars: 'escapeSpecialChars',
            },
            static: {
                replaceByRegex: '__replaceByRegex__',
                replaceWith: '__replaceWith__',
                escapeSpecialChars: '__escapeSpecialChars__',
            },
        }

        const replaceWith_ = (self: any, regex: string | RegExp, replacement: string): string =>
            self.replace(regex, replacement)

        const replaceByRegex_ = (
            self: any,
            regex: string | RegExp,
            replacer: (substring: string, ...args: any[]) => string,
        ): string => self.replace(regex, replacer)

        const escapeSpecialChars_ = (self: any, pairs: Readonly<RegexStringPair[]>): string => {
            let result = self

            for (const pair of pairs) {
                result = result.replace(pair.left, pair.right)
            }

            return result
        }

        if (!isFunction(String.prototype[props.proto.replaceWith])) {
            // Define "replaceWith" function for built-in types
            defineProperty(String.prototype, props.proto.replaceWith, {
                value(regex: string | RegExp, replacement: string) {
                    return replaceWith_(this, regex, replacement)
                },
            })
        }

        if (!isFunction(String.prototype[props.proto.replaceByRegex])) {
            // Define "replaceByRegex" function for built-in types
            defineProperty(String.prototype, props.proto.replaceByRegex, {
                value(regex: string | RegExp, replacer: (substring: string, ...args: any[]) => string) {
                    return replaceByRegex_(this, regex, replacer)
                },
            })
        }

        if (!isFunction(String.prototype[props.proto.escapeSpecialChars])) {
            // Define "escapeSpecialChars" function for built-in types
            defineProperty(String.prototype, props.proto.escapeSpecialChars, {
                value(pairs = REGEX_CONTROL_PAIRS) {
                    return escapeSpecialChars_(this, pairs)
                },
            })
        }

        if (!isFunction(String[props.static.replaceWith])) {
            // Define "__replaceWith__" function for built-in types
            defineStaticProperty(String, props.static.replaceWith, {
                value: (self: any, regex: string | RegExp, replacement: string) =>
                    replaceWith_(self, regex, replacement),
            })
        }

        if (!isFunction(String[props.static.replaceByRegex])) {
            // Define "__replaceByRegex__" function for built-in types
            defineStaticProperty(String, props.static.replaceByRegex, {
                value: (
                    self: any,
                    regex: string | RegExp,
                    replacer: (substring: string, ...args: any[]) => string,
                ) => replaceByRegex_(self, regex, replacer),
            })
        }

        if (!isFunction(String[props.static.escapeSpecialChars])) {
            // Define "__escapeSpecialChars__" function for built-in types
            defineStaticProperty(String, props.static.escapeSpecialChars, {
                value: (self, pairs = REGEX_CONTROL_PAIRS) => escapeSpecialChars_(self, pairs),
            })
        }
    })()

    export const splitList = (value: string): string[] => {
        return value.trim().split(/\s*,\s*/)
    }

    /**
     * Generates a random string.
     * @param length Length of string.
     */
    export const generateRandomString = (length: number): string => {
        let result = ''

        const bytes = new Uint32Array(length)
        const random = window.crypto.getRandomValues(bytes)
        for (let i = 0; i < length; i += 1) {
            result += ACCEPTABLE_RANDOM_CHARSET[random[i] % ACCEPTABLE_RANDOM_CHARSET.length]
        }

        return result
    }

    export const repeatString = (str: string, count: number): string => {
        return new Array(count + 1).join(str)
    }

    export const b64EncodeUnicode = (str: string): string => {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(
            encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
                return String.fromCharCode(Number(`0x${p1}`))
            }),
        )
    }

    export const b64DecodeUnicode = (str: string): string => {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(
            atob(str)
                .split('')
                .map(c => {
                    return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
                })
                .join(''),
        )
    }

    // LZW-compress a string
    export const lzw_encode = (value: string): string => {
        const dict = {}
        const data = `${value}`.split('')
        const out: any[] = []
        let currChar
        let phrase = data[0]
        let code = 256
        for (let i = 1; i < data.length; i++) {
            currChar = data[i]
            if (dict[phrase + currChar] != null) {
                phrase += currChar
            } else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))
                dict[phrase + currChar] = code
                code++
                phrase = currChar
            }
        }

        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))
        for (let i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i])
        }

        return out.join('')
    }

    // Decompress an LZW-encoded string
    export const lzw_decode = (value: string): string => {
        const dict = {}
        const data = `${value}`.split('')
        let currChar = data[0]
        let oldPhrase = currChar
        const out = [currChar]
        let code = 256
        let phrase
        for (let i = 1; i < data.length; i++) {
            const currCode = data[i].charCodeAt(0)
            if (currCode < 256) {
                phrase = data[i]
            } else {
                phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar
            }
            out.push(phrase)
            currChar = phrase.charAt(0)
            dict[code] = oldPhrase + currChar
            code++
            oldPhrase = phrase
        }

        return out.join('')
    }

    /**
     * Creates a function which replaces a given path.
     *
     * @param {RegExp} fromRegexp - A `RegExp` object to replace.
     * @param {string} toStr - A new string to replace.
     * @returns {function} A function which replaces a given path.
     */
    export const defineConvert = (fromRegexp: string, toStr: string): Processor<string, string> => {
        return filePath => filePath.replace(fromRegexp, toStr)
    }

    /**
     * Combines given converters.
     * The result function converts a given path with the first matched converter.
     *
     * @param {{match: function, convert: function}} converters - A list of converters to combine.
     * @returns {function} A function which replaces a given path.
     */
    export const combine = (converters: any[]): Processor<string, string> => {
        return filePath => {
            for (const converter of converters) {
                if (converter.match(filePath)) {
                    return converter.convert(filePath)
                }
            }
            return filePath
        }
    }

    export const stripImportPathParams = (path: string): string => {
        const i = path.indexOf('!')

        return i === -1 ? path : path.slice(0, i)
    }

    export const isBlankString = (value: string): boolean => {
        return !value || /^\s*$/.test(value)
    }

    export const massageGithubUrl = (url: string): string => {
        return url
            .replace('http:', 'https:')
            .replace(/^git:\/?\/?/, 'https://')
            .replace('www.github.com', 'github.com')
            .split('/')
            .slice(0, 5)
            .join('/')
    }

    export const normalizeName = (input: string): string => {
        return input.toLowerCase().replace(/([-.])/g, '_')
    }

    export const shardParts = (lookupName: string): string[] => {
        return createHash('md5').update(lookupName).digest('hex').slice(0, 3).split('')
    }

    export const cleanSimpleHtml = (html: string): string => {
        return (
            html
                .replace(/<\/?pre>/, '')
                // Certain simple repositories like artifactory don't escape > and <
                .replace(/data-requires-python="([^"]*?)>([^"]*?)"/g, 'data-requires-python="$1&gt;$2"')
                .replace(/data-requires-python="([^"]*?)<([^"]*?)"/g, 'data-requires-python="$1&lt;$2"')
        )
    }

    export const parseIndexDir = (
        content: string,
        filterFn = (x: string): boolean => !/^\.+/.test(x),
    ): string[] => {
        const unfiltered = content.match(/(?<=href=['"])[^'"]*(?=\/['"])/g) || []
        return unfiltered.filter(filterFn)
    }

    export const maskToken = (str?: string): Optional<string> => {
        return str ? [str.substring(0, 2), new Array(str.length - 3).join('*'), str.slice(-2)].join('') : str
    }

    export const massageGitlabUrl = (url: string): string => {
        return url
            .replace('http:', 'https:')
            .replace(/^git:\/?\/?/, 'https://')
            .replace(/\/tree\/.*$/i, '')
            .replace(/\/$/i, '')
            .replace('.git', '')
    }

    export const assertPatternsInput = (patterns: any[]): void => {
        if (!patterns.every(pattern => typeof pattern === 'string')) {
            throw new TypeError('Patterns must be a string or an array of strings')
        }
    }

    export const repoName = (value: string | { repository: string }): string => {
        return String(_.isString(value) ? value : value.repository).toLowerCase()
    }

    export const noWhitespaceOrHeadings = (input: string): string => {
        return input.replace(/\r?\n|\r|\s|#/g, '')
    }

    export const noLeadingAtSymbol = (input: string): string => {
        return input.length && input.startsWith('@') ? input.slice(1) : input
    }

    export const numFormat = (value: number, fraction = 2): string => value.toFixed(fraction)

    export const extractAttachmentsFromString = (
        content: string,
        regex = /src="([0-9a-zA-Z-]*-[0-9a-zA-Z]{8,14}\.png)"/g,
    ): string[] => {
        const attachmentGroups = [...content.matchAll(regex)]

        return [...new Set(attachmentGroups.filter(group => group.length > 0).map(group => group[1]))]
    }

    export const uniqueId = (): string => {
        return Math.random()
            .toString(36)
            .substring(Number(2 + new Date().getTime().toString(36)))
    }

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

    export const removeChars = (str: string, remove: string): string => {
        const s = str.split('')
        const r = remove.split('')
        const flags: boolean[] = []

        for (const item of r) {
            flags[item.charCodeAt(0)] = true
        }

        let dst = 0
        const res: string[] = []
        for (const item of s) {
            if (!flags[item.charCodeAt(0)]) {
                res[dst++] = item
            }
        }

        return res.join('')
    }

    export const sortBy = (
        comparator: Optional<Comparator<{ index: number; value: string }>>,
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
    export const getPostCode = (value: string): Optional<string> => {
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

    export const cjk = (value: string): string[] => {
        // eslint-disable-next-line no-control-regex
        return value.replace(new RegExp(/[\x00-\x7F]/g), '').split('')
    }

    export const notBlankOrElse = (value: string, defaultValue: string): string => {
        return isBlankString(value) ? defaultValue : value
    }

    export const toString = (value: string | string[]): string => {
        return Array.isArray(value) ? value[0] : value
    }

    export const getProjectId = (value: any): string => {
        return slugify(value, { lower: true, remove: /[.'/]/g })
    }

    export const padLeft = (value: string, length: number): string => {
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

    export const toUTF16 = (codePoint: number): string => {
        const TEN_BITS = parseInt('1111111111', 2)
        const codeUnit_ = (codeUnit: number): string => {
            return `\\u${codeUnit.toString(16).toUpperCase()}`
        }

        if (codePoint <= 0xffff) {
            return codeUnit_(codePoint)
        }

        codePoint -= 0x10000
        // Shift right to get to most significant 10 bits
        const leadSurrogate = 0xd800 + (codePoint >> 10)
        // Mask to get least significant 10 bits
        const tailSurrogate = 0xdc00 + (codePoint & TEN_BITS)

        return codeUnit_(leadSurrogate) + codeUnit_(tailSurrogate)
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
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

    export const generateRandomHex = (): string => randomBytes(32).toString('hex')

    export const escapeRegExp2 = (value: string): string => {
        return value.replace(/[.*+?^${}()|\\[\]]/g, '\\$&')
    }

    export const isTagNameValid = (name: string): boolean => {
        if (name.length === 0) return false

        // eslint-disable-next-line no-control-regex
        return !new RegExp(/[\s#<>:"\\/|?*\x00-\x1F]/g).test(name)
    }

    export const replaceAttachments = (content: string, sources: [string, string][]): string => {
        return sources.reduce((content, [local, cloud]) => {
            return content.replace(`](${local})`, `](${cloud})`)
        }, content)
    }

    export const capitalFirstLetter = (value: string): string =>
        value.charAt(0).toUpperCase() + value.slice(1)

    export const parseJson = (value: string, defaultValue: any = undefined): Optional<string> => {
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

    export const toPathString = (pathArr: string[]): string => {
        const x = pathArr,
            n = x.length
        let p = '$'

        for (let i = 1; i < n; i++) {
            if (!/^(~|\^|@.*?\(\))$/u.test(x[i])) {
                p += /^[0-9*]+$/u.test(x[i]) ? `[${x[i]}]` : `['${x[i]}']`
            }
        }

        return p
    }

    export const hashCode = (str: string): string => {
        let hash = 0,
            i,
            chr
        if (str.length === 0) {
            return String(hash)
        }

        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i)
            hash = (hash << 5) - hash + chr
        }

        hash = Math.abs(hash) >> 0

        return hash.toString(16)
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

    export const removeSlash = (str: string): string => (str.length > 1 ? str.replace(/\/$/, '') : str)

    export const padBegin = (num: number, size = 2, type = '0'): string => `${num}`.padStart(size, type)

    export const padEnd = (num: number, size = 2, type = '0'): string => `${num}`.padEnd(size, type)

    export const joinStr = (...args: (string | undefined)[]): string => args.filter(Boolean).join('-')

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

    export const parseNumber = (value: string): Optional<RegExpExecArray> => {
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

    export const wordWrap = (value: string, width: number, brk: string, cut: boolean): Optional<string> => {
        brk = brk || 'n'
        width = width || 75
        cut = cut || false

        if (!value) {
            return value
        }
        const regex = `.{1,${width}}(\\s|$)${cut ? `|.{${width}}|.+` : '|S+?(s|$)'}`

        return value.match(RegExp(regex, 'g'))?.join(brk)
    }

    export const randomString3 = (len = 8): string => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let result = ''

        const length = isIntNumber(len) && len > 0 ? len : null
        if (length == null) {
            throw valueError(`incorrect string length: < ${length} >`)
        }

        for (let i = 0; i < length; i++) {
            const value = random(chars.length)
            result += chars.substring(value, value + 1)
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

        // @ts-ignore
        const tabExpand_ = (value, p1, p2): string => {
            return p1 + ' '.repeat(p2.length * tab - (p1.length % tab))
        }

        const chunkString = (value: string, length: number): Optional<RegExpMatchArray> => {
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

            if (chunks === null || chunks === undefined) {
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
    export const serialMaker = (
        prefix: OptionalString,
        seq: OptionalNumber,
    ): { gensym: Supplier<string> } => {
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
    ): Optional<{ name: Optional<string>; fields: { name: string; value: string }[] }[]> => {
        // Start with an object to hold the top-level fields
        const categories: { name: Optional<string>; fields: { name: string; value: string }[] }[] = [
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

    export const checkPostCode = (toCheck: string): Optional<string> => {
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

    export const sequencer = <T extends string, U extends string>(
        map: (value: T, index: number, array: T[]) => U,
        str: string,
    ): string => {
        let exploded = str.split('')
        exploded = exploded.map(map)
        return exploded.join('')
    }

    export const htmlText = (value: string): string => {
        return unescape(value.replace(/<.*?>/g, '')).replace(/&amp;/, '&')
    }

    export const joinList = (list: any[], joiner = '|'): string => {
        return `(?:${list.join(joiner)})`
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

    export const repeat = (str: string, num: number): string => {
        let result = ''

        while (true) {
            if (num & 1) {
                result += str
            }
            num >>>= 1
            if (num <= 0) break
            str += str
        }

        return result
    }

    export const longestSequence = (
        compareFunc,
        myEnum: string,
    ): { member: OptionalString; count: number } => {
        let result: { member: Optional<string>; count: number } = { member: null, count: 0 }
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

    export const escapeAscii = (value: string): string => {
        return fixedEncode(value, ...REGEX_ASCII_PAIRS)
    }

    export const escapeHtml = (value: string): string => {
        return fixedEncode(value, ...REGEX_ENTITY_PAIRS)
    }

    export const escapeControl = (value: string): string => {
        return fixedEncode(value, ...REGEX_CONTROL_PAIRS)
    }

    /**
     * @public
     * @function deepTrim
     * @description Deep trim object properties of type {String}.
     * @param {Object} object - Object with untrimmed properties of type {String}.
     * @returns {Object} - Object with trimmed properties of type {String}.
     */
    export const deepTrim = (object: any): void => {
        if (!object) return

        for (const property in object) {
            if (object.hasOwnProperty(property)) {
                if (typeof object[property] === 'object' || object[property] instanceof Object) {
                    deepTrim(object[property])
                } else if (typeof object[property] === 'string' || object[property] instanceof String) {
                    object[property] = object[property].trim()
                }
            }
        }

        return object
    }

    export const randomString = (len = 8): string => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        return makeArray3(len, () => possible.charAt((Math.random() * possible.length) | 0)).join('')
    }

    export const equalIgnoreCase = (str1: string, str2: string): boolean => {
        return str1.toLowerCase() === str2.toLowerCase()
    }

    export const toTitleCase = (str: string): string => {
        return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    }

    export const toCamelCase = (str: string): string => {
        return str.replace(/-\w/g, match => match[1].toUpperCase())
    }

    export const toDashedCase = (str: string): string => {
        return str.replace(/[A-Z]+/g, match => `-${match.toLowerCase()}`)
    }

    export const escapeJSON = (value: string): string => {
        value = value.replace(new RegExp("\\'".replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g'), "'")
        value = value.replace(/"((?:"[^"]*"|[^"])*?)"(?=[:},])(?=(?:"[^"]*"|[^"])*$)/gm, (_, group) => {
            return `"${group.replace(/"/g, '\\"')}"`
        })

        return value
    }

    export const lastSegment = (str = '', delimiter): string => {
        return str.substr(str.lastIndexOf(delimiter) + 1)
    }

    export const toBase64 = (kind: 'normal' | 'url', text: any): Optional<string> => {
        if (kind === 'normal') {
            return Buffer.from(text, 'utf8').toString('base64')
        } else if (kind === 'url') {
            return Buffer.from(text, 'utf8')
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '')
        }

        return null
    }

    export const fromBase64 = (text: any): string => {
        return Buffer.from(text, 'base64').toString('utf8')
    }

    export const joinPath = (p1: string, p2: string): string => {
        p1 = p1.replace(/\/$/, '')
        p2 = p2.replace(/^\//, '')

        return `${p1}/${p2}`
    }

    export const shortString = (str, maxLength = 25, suffixLength = 5): string => {
        if (str.length <= maxLength) {
            return str
        }

        return `${str.slice(0, maxLength - (suffixLength + 3))}...${
            suffixLength ? str.slice(-suffixLength) : ''
        }`
    }
}
