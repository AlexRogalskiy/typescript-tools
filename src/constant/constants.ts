import boxen from 'boxen'

import { RegexStringPair } from '../../typings/general-types'
import { HandlerFunction } from '../../typings/function-types'

import * as path from 'path';

export const DEFAULT_APP_NAME = 'APP';

// Update both DEFAULT_ELECTRON_VERSION and DEFAULT_CHROME_VERSION together,
// and update app / package.json / devDeps / electron to value of DEFAULT_ELECTRON_VERSION
export const DEFAULT_ELECTRON_VERSION = '13.5.1';
// https://atom.io/download/atom-shell/index.json
export const DEFAULT_CHROME_VERSION = '91.0.4472.164';

// Update each of these periodically
// https://product-details.mozilla.org/1.0/firefox_versions.json
export const DEFAULT_FIREFOX_VERSION = '92.0.1';

// https://en.wikipedia.org/wiki/Safari_version_history
export const DEFAULT_SAFARI_VERSION = {
    majorVersion: 15,
    version: '15.0',
    webkitVersion: '605.1.15',
};

export const ELECTRON_MAJOR_VERSION = parseInt(
    DEFAULT_ELECTRON_VERSION.split('.')[0],
    10,
);
export const PLACEHOLDER_APP_DIR = path.join(__dirname, './../', 'app');

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
