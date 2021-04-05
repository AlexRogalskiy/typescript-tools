import boxen from 'boxen'

import { RegexStringPair } from '../../typings/general-types'
import { HandlerFunction } from '../../typings/function-types'

/**
 * Output configuration options
 */
export const OUTPUT_OPTIONS: Readonly<boxen.Options> = {
    padding: 1,
    margin: 1,
    borderStyle: 'single',
    borderColor: 'yellow',
}

/**
 * Collection of encoded regex pairs
 */
export const REGEX_ASCII_PAIRS: Readonly<RegexStringPair[]> = [
    { left: /%5B/g, right: '[' },
    { left: /%5D/g, right: ']' },
]

/**
 * Collection of escaped regex entity pairs
 */
export const REGEX_ENTITY_PAIRS: Readonly<RegexStringPair[]> = [
    { left: /&/g, right: '&amp;' },
    { left: /</g, right: '&lt;' },
    { left: />/g, right: '&gt;' },
    { left: /"/g, right: '&quot;' },
    { left: /'/g, right: '&#039;' },
]

/**
 * Collection of escaped regex control pairs
 */
export const REGEX_CONTROL_PAIRS: Readonly<RegexStringPair[]> = [
    { left: /\\'/g, right: "\\'" },
    { left: /\\"/g, right: '\\"' },
    { left: /\\&/g, right: '\\&' },
    { left: /\\r/g, right: '\\r' },
    { left: /\r/g, right: '\\r' },
    { left: /\\n/g, right: '\\n' },
    { left: /\n/g, right: '\\n' },
    { left: /\\t/g, right: '\\t' },
    { left: /\\b/g, right: '\\b' },
    { left: /\\f/g, right: '\\f' },
]

/**
 * Default values for object types
 */
export const defaultValues = {
    boolean: true,
    array: [],
    string: null,
    object: null,
}

/**
 * Set of supported error codes
 */
export const redirectCodes: ReadonlySet<number> = new Set([300, 301, 302, 303, 304, 307, 308])

/**
 * Default general {@link HandlerFunction} implementation
 * @param options initial input {@link any} options
 * @param next initial input next functional operator
 */
export const generalHandler: HandlerFunction<any> = (options: any, next: (options: any) => any) =>
    next(options)
