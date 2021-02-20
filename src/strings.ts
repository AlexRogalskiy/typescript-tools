import slugify from 'slugify'

export namespace Strings {
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

    export const replaceBy = (regex: string | RegExp, str: string, replace = ''): string =>
        str.replace(regex, replace)

    export const pad = (num: number, size = 2, type = '0'): string => `${num}`.padStart(size, type)
}
