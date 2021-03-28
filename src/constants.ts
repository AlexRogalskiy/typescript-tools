import boxen from 'boxen'

import { RegexStringPair } from '../typings/general-types'

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
