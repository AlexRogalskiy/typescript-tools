import { cloneDeep, merge } from 'lodash'

import { Keys, Pair } from '../../typings/general-types'
import { GradleDependency } from '../../typings/domain-types'
import { Optional } from '../../typings/standard-types'
import { TokenType } from '../../typings/enum-types'

import { Strings } from './strings'

import quote = Strings.quote

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const isRegex = require('is-regex')

export namespace Regexes {
    // # dockerfile_lint  ignore | # dockerfile_lint  -  ignore  | # dockerfile_lint = ignore
    export const TOKEN_INLINE_IGNORE = RegExp(/^#.*dockerfile_lint[ ]*\W[ ]*ignore.*$/)
}

export const MRE = /^m[trblxy]?$/
export const TOKEN_WHITESPACE = RegExp(/[\t\v\f\r ]+/)
export const TOKEN_LINE_CONTINUATION = RegExp(/\\[ \t]*$/)
export const TOKEN_COMMENT = RegExp(/^#.*$/)

const PROPERTY_REGEX_PATTERN = '[a-zA-Z_][a-zA-Z0-9_]*(?:\\.[a-zA-Z_][a-zA-Z0-9_]*)*'

const regex = (str: string): RegExp => new RegExp(str, 'g')

export const getProps = test => props => {
    const next = {}
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key) && test(key || '')) {
            next[key] = props[key]
        }
    }
    return next
}

export const commonHtmlStopWords = 'alt br div h1 h2 h3 h4 h5 h6 href img li ol pre src srcset ul'.split(' ')
export const linkRes = [
    /<(?:a|area|link)\s[^>]*href\s*=\s*"?([^">\s]+)/giu,
    /<(?:audio|embed|iframe|img|input|script|source|track|video)\s[^>]*(?:src|srcset)\s*=\s*"?([^">\s]+)/giu,
    /<object\s[^>]*data\s*=\s*"?([^">\s]+)/giu,
    /<video\s[^>]*poster\s*=\s*"?([^">\s]+)/giu,
]

export const getSiteUrl = (req: any): string => `${req.secure ? 'https' : 'http'}://${req.headers.host}`

export const escapeForRegExp = (str: string): string => str.replace(/[-/\\^$*+?.()|[\]{}]/gu, '\\$&')
export const hostnameTokenEscaped = (hostnameToken: string): string =>
    `${escapeForRegExp(hostnameToken)}|${escapeForRegExp(encodeURIComponent(hostnameToken))}`
export const hostnameTokenRe = (hostnameToken: string): RegExp =>
    new RegExp(hostnameTokenEscaped(hostnameToken), 'gu')
export const referenceRe = (hostnameToken: string): RegExp =>
    new RegExp(`(${hostnameTokenEscaped(hostnameToken)})/blog/post/([\\w-]+)`, 'gu')

export const splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/
export const inlineTag = /(?:\[(.+?)])?{@(link|linkcode|linkplain)\s+((?:.|\n)+?)}/gi

export const getMargin = getProps(k => MRE.test(k))
export const omitMargin = getProps(k => !MRE.test(k))

export const commonRegexPattern = (props: any): string =>
    `/^((${Object.keys(props).join('|')})|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/`

export const componentSelectorClassNamePattern = /^e[a-zA-Z0-9]+[0-9]+$/

export const keyframesPattern = /^@keyframes\s+(animation-[^{\s]+)+/
export const removeCommentPattern = /\/\*[\s\S]*?\*\//g

export const domElementPattern = /^((HTML|SVG)\w*)?Element$/
export const newBlockRegEx = /^\s*-\s*((\w+):\s*(.*))$/
export const blockLineRegEx = /^\s*((\w+):\s*(.*))$/
export const galaxyDepRegex = /[\w-]+\.[\w-]+/
export const dependencyRegex = /^dependencies:/
export const galaxyRegEx = /^\s+(?<lookupName>[\w.]+):\s*["'](?<version>.+)["']\s*/
export const nameMatchRegex =
    /(?<source>((git\+)?(?:(git|ssh|https?):\/\/)?(.*@)?(?<hostname>[\w.-]+)(?:(:\d+)?\/|:))(?<depName>[\w./-]+)(?:\.git)?)(,(?<version>[\w.]*))?/

// Regex by Diego Perini from: http://mathiasbynens.be/demo/url-regex
export const URI_REGEX = new RegExp(
    '^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z¡-￿0-9]-*)*[a-z¡-￿0-9]+)(?:\\.(?:[a-z¡-￿0-9]-*)*[a-z¡-￿0-9]+)*(?:\\.(?:[a-z¡-￿]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$',
    'i',
)

export const MODULE_REGEX_CONFIG = {
    distributionMatch: regex(
        '^(?:distributionUrl\\s*=\\s*)\\S*-(?<version>\\d+\\.\\d+(?:\\.\\d+)?(?:-\\w+)*)-(?<type>bin|all)\\.zip\\s*$',
    ),
    urlMatch: regex(
        '^(?:git::)?(?<url>(?:(?:(?:http|https|ssh)://)?(?:.*@)?)?(?<path>(?:[^:/]+[:/])?(?<project>[^/]+/[^/]+)))(?<subdir>[^?]*)?ref=(?<currentValue>.+)$',
    ),
    artifactMatch: regex('^[a-zA-Z][-_a-zA-Z0-9]*(?:\\.[a-zA-Z0-9][-_a-zA-Z0-9]*?)*$'),
    versionMatch: regex('^(?<version>[-.\\[\\](),a-zA-Z0-9+]+)'),
}

export const GITHUB_REGEX_CONFIG = {
    imageMatch: regex('^s*image:s*\'?"?([^s\'"]+|)\'?"?s*$'),
    nameMatch: regex('^s*name:s*\'?"?([^s\'"]+|)\'?"?s*$'),
    usesMatch: regex('^s+-?s+?uses: (?<depName>[w-]+/[w-]+)(?<path>.*)?@(?<currentValue>.+?)s*?$'),
}

export const DOCKER_REGEX_CONFIG = {
    fileMatch: [regex('(^|/|\\.)Dockerfile$'), regex('(^|/)Dockerfile\\.[^/]*$')],
    fromMatch: regex(
        '^[ \t]*FROM(?:\\\r?\n| |\t|#.*?\r?\n|[ \t]--[a-z]+=w+?)*[ \t](?<image>S+)(?:(?:\\\r?\n| |\t|#.*\r?\n)+as[ \t]+(?<name>S+))?/gim',
    ),
    copyMatch: regex('^[ \t]*COPY(?:\\\r?\n| |\t|#.*\r?\n|[ \t]--[a-z]+=w+?)*[ \t]--from=(?<image>S+)/gim'),
}

export const PROPERTY_REGEX = regex(
    `^(?<leftPart>\\s*(?<key>${PROPERTY_REGEX_PATTERN})\\s*=\\s*['"]?)(?<value>[^\\s'"]+)['"]?\\s*$`,
)

export const CLOUDFLARE_URL_REGEX =
    /\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/(?<depName>[^/]+?)\/(?<currentValue>[^/]+?)\/(?<asset>[-/_.a-zA-Z0-9]+)/

export const PLUGIN_REGEX = /^\s*plugin\s*(['"])(?<plugin>[^'"]+)\1/

export const COMMENT_REGEX = /^\s*#/

export const COMMA_REGEX = '\\s*,\\s*'

export const GROOVY_QUOTES = '(?:["\'](?:""|\'\')?)'

export const GROOVY_VERSION_REGEX = `(?:${GROOVY_QUOTES}\\$)?{?([^\\s"'{}$)]+)}?${GROOVY_QUOTES}?`

export const KOTLIN_VERSION_REGEX = '(?:"\\$)?{?([^\\s"{}$]+?)}?"?'

export const SCRIPT_REGEX = /<\s*(script|link)\s+[^>]*?\/?>/i

export const INTEGRITY_REGEX = /\s+integrity\s*=\s*(["'])(?<currentDigest>[^"']+)/

export const YAML_REGEX = /\.ya?ml$/

/**
 * Url regex patterns
 * @type {RegExp}
 */
export const URL_REGEX =
    /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
export const URL_REGEX2 = /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/
export const URL_REGEX3 = /(\w+):\/\/([\w. ]+)\/(\S*)/
export const URL_REGEX4 = /((http|https|ftp):\/\/[\w?=&.\\/-;#~%-]+(?![\w\s?&.\\/;#~%=-]*>))/g
export const URL_REGEX5 =
    /\.(html|css|js|png|jpg|jpeg|gif|ico|xml|rss|txt|eot|svg|ttf|woff|woff2|cur)(\?((r|v|rel|rev)=[-.\w]*)?)?$/
/**
 * Phone regex patterns
 * @type {RegExp}
 */
export const PHONE_REGEX = /(\d{3}).*(\d{3}).*(\d{4})/
/**
 * Html regex patterns
 * @type {RegExp}
 */
export const HTML_REGEX = /## (?<title>[A-Za-z0-9 ]+)\n\n(?<body>[^#]+)/gs
/**
 * Primitive regex patterns
 * @type {RegExp}
 */
export const PRIMITIVE_REGEX =
    /@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/gu
/**
 * Ternary regex pattern
 * @type {RegExp}
 */
export const TERNARY_REGEX = /^(-?\d*):(-?\d*):?(\d*)$/u
/**
 * Vowel regex patterns
 * @type {RegExp}
 */
export const VOWEL_REGEX = /[aeiouy]*/
/**
 * Date regex patterns
 * @type {RegExp}
 */
export const DATE_REGEX = /^\d{2}\/\d{2}\/\d{2,4}$/
/**
 * Host/port regex patterns
 * @type {RegExp}
 */
export const HOST_PORT_REGEX =
    /\b((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\b(?::([\d]+))?/
/**
 * Emoji regex pattern
 * @type {RegExp}
 */
export const EMOJI_REGEX =
    /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDF])\u200D[\u2640\u2642])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#*0-9]\uFE0F\u20E3|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g
/**
 * Mobile navigator regex pattern
 * @type {RegExp}
 */
export const MOBILE_NAVIGATOR_TYPE_REGEX =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
export const MOBILE_NAVIGATOR_CODE_REGEX =
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ /])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx\\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i
/**
 * Localhost regex pattern
 * @type {RegExp}
 */
export const LOCALHOST_REGEX = new RegExp(/^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
/**
 * Zipcode regex pattern
 * @type {RegExp}
 */
export const ZIPCODE_REGEX = new RegExp('^[a-z]{3}(-[A-Z]{3})?$')
/**
 * Email regex pattern
 * @type {RegExp}
 */
export const EMAIL_REGEX = new RegExp(
    '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$',
)
export const EMAIL_REGEX2 = new RegExp(
    '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
)

/**
 * REGEX_STRING is the regex pattern to check for correct string
 * @type {RegExp}
 */
export const ALPHA_REGEX = /^[a-zA-Z]+$/
// ------------------------------------------------------------------------------------------------

const replace = (str: string, ...regexp: Pair<string, RegExp>[]): string => {
    for (const item of regexp) {
        str = str.replace(item.right, item.left)
    }

    return str
}
// -------------------------------------------------------------------------------------------------
/**
 * Returns {@link RegExp} pattern by input array of {@link T} values
 * @param arr initial input array of {@link T} values
 */
export const getRegex = <T extends string>(arr: T[]): RegExp => {
    return new RegExp(`^(${arr.join('|')})\\b`, 'i')
}

export const regexp = (value: string): RegExp => {
    const [pattern, flags] = value.replace(/^\/(.*?)\/([igmuys]*)$|(.*)/, '$1$3:$2').split(':')

    return new RegExp(pattern, flags)
}

export const regexChars = (() => {
    const regex_whitespace = regex('\\s+'),
        regex_strip = regex('[^a-z0-9 ]'),
        regex_space = regex('[-/]'),
        regex_a = regex('[àáâãäå]'),
        regex_e = regex('[èéêë]'),
        regex_i = regex('[ìíîï]'),
        regex_o = regex('[òóôõöő]'),
        regex_u = regex('[ùúûüű]'),
        regex_y = regex('[ýŷÿ]'),
        regex_n = regex('ñ'),
        regex_c = regex('[çc]'),
        regex_s = regex('ß'),
        regex_and = regex(' & ')

    /** @const {Array} */
    const regex_pairs = [
        { left: 'a', right: regex_a },
        { left: 'e', right: regex_e },
        { left: 'i', right: regex_i },
        { left: 'o', right: regex_o },
        { left: 'u', right: regex_u },
        { left: 'y', right: regex_y },
        { left: 'n', right: regex_n },
        { left: 'k', right: regex_c },
        { left: 's', right: regex_s },
        { left: ' and ', right: regex_and },
        { left: ' ', right: regex_space },
        { left: '', right: regex_strip },
        { left: ' ', right: regex_whitespace },
    ]

    return (str: string): string => {
        str = replace(str.toLowerCase(), ...regex_pairs)

        return str === ' ' ? '' : str
    }
})()

export const isValidRegex = (value: RegExp | string): boolean =>
    isRegex(value) || (typeof value === 'string' && /^\/.*\/[gimsuy]*$/.test(value))

export const excludeNoteIdPrefix = (prefix: string, noteId: string): string => {
    return noteId.replace(new RegExp(`^${prefix}`), '')
}

export const prependNoteIdPrefix = (prefix: string, noteId: string): string => {
    if (new RegExp(`^${prefix}`).test(noteId)) {
        return `${prefix}${noteId}`
    }
    return noteId
}

export const isModule = (name: string): boolean => !/^(?:[./\\]|\w+:)/u.test(name)

export const formatRule = (rule: string, ruleRegex = /^Host\(`(.+?)`\)$/): string => {
    const match = ruleRegex.exec(rule)

    if (match) {
        return match[1]
    }

    return rule
}

export const getPos = (
    msg: string,
    regex = /\.spec\.ts:(?<line>\d+):(?<col>\d+)\)/,
): Record<string, string> => {
    const pos = regex.exec(msg)
    if (!pos || !pos.groups) {
        return {}
    }

    const line = pos.groups.line
    const col = pos.groups.col

    return {
        line,
        col,
    }
}

export const stripComment = (str: string): string => str.replace(/(^|\s+)\/\/.*$/, '')

export const isSingleLineDep = (str: string): boolean =>
    /^\s*(libraryDependencies|dependencyOverrides)\s*\+=\s*/.test(str)

export const isDepsBegin = (str: string): boolean =>
    /^\s*(libraryDependencies|dependencyOverrides)\s*\+\+=\s*/.test(str)

export const isPluginDep = (str: string): boolean => /^\s*addSbtPlugin\s*\(.*\)\s*$/.test(str)

export const isStringLiteral = (str: string): boolean => /^"[^"]*"$/.test(str)

export const isScalaVersion = (str: string): boolean => /^\s*scalaVersion\s*:=\s*"[^"]*"[\s,]*$/.test(str)

export const getScalaVersion = (str: string): string =>
    str.replace(/^\s*scalaVersion\s*:=\s*"/, '').replace(/"[\s,]*$/, '')

export const isPackageFileVersion = (str: string): boolean => /^(version\s*:=\s*).*$/.test(str)

export const getPackageFileVersion = (str: string): string =>
    str
        .replace(/^\s*version\s*:=\s*/, '')
        .replace(/[\s,]*$/, '')
        .replace(/"/g, '')

export const isScalaVersionVariable = (str: string): boolean =>
    /^\s*scalaVersion\s*:=\s*[_a-zA-Z][_a-zA-Z0-9]*[\s,]*$/.test(str)

export const getScalaVersionVariable = (str: string): string =>
    str.replace(/^\s*scalaVersion\s*:=\s*/, '').replace(/[\s,]*$/, '')

export const isResolver = (str: string): boolean =>
    /^\s*(resolvers\s*\+\+?=\s*(Seq\()?)?"[^"]*"\s*at\s*"[^"]*"[\s,)]*$/.test(str)

export const getResolverUrl = (str: string): string =>
    str.replace(/^\s*(resolvers\s*\+\+?=\s*(Seq\()?)?"[^"]*"\s*at\s*"/, '').replace(/"[\s,)]*$/, '')

export const isVarDependency = (str: string): boolean =>
    /^\s*(private\s*)?(lazy\s*)?val\s[_a-zA-Z][_a-zA-Z0-9]*\s*=.*(%%?).*%.*/.test(str)

export const isVarDef = (str: string): boolean =>
    /^\s*(private\s*)?(lazy\s*)?val\s+[_a-zA-Z][_a-zA-Z0-9]*\s*=\s*"[^"]*"\s*$/.test(str)

export const getVarName = (str: string): string =>
    str.replace(/^\s*(private\s*)?(lazy\s*)?val\s+/, '').replace(/\s*=\s*"[^"]*"\s*$/, '')

export const isVarName = (str: string): boolean => /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(str)

export const githubRegex = /^https:\/\/github\.com\/(?<account>[^/]+)\/(?<repo>[^/]+?)(\.git|\/.*)?$/

export const containsPlaceholder = (str: string): boolean => {
    return /\${.*?}/g.test(str)
}

export const buildTimeRegex = new RegExp(
    '^(\\d\\d\\d\\d)(\\d\\d)(\\d\\d)(\\d\\d)(\\d\\d)(\\d\\d)(\\+\\d\\d\\d\\d)$',
)

export const githubRefMatchRegex = /github.com([/:])(?<project>[^/]+\/[a-z0-9-.]+).*\?ref=(?<tag>.*)$/

export const gitTagsRefMatchRegex =
    /(?:git::)?(?<url>(?:http|https|ssh):\/\/(?:.*@)?(?<path>.*.*\/(?<project>.*\/.*)))\?ref=(?<tag>.*)$/

export const hostnameMatchRegex = /^(?<hostname>([\w|\d]+\.)+[\w|\d]+)/

export const gitlabRegExp = /^(https:\/\/[^/]*gitlab.[^/]*)\/(.*)$/

export const providerBlockExtractionRegex = /^\s*(?<key>[^\s]+)\s+=\s+{/

export const sourceExtractionRegex =
    /^(?:(?<hostname>(?:[a-zA-Z0-9]+\.+)+[a-zA-Z0-9]+)\/)?(?:(?<namespace>[^/]+)\/)?(?<type>[^/]+)/

export const extractVersion = new RegExp('^v(?<version>.+)$')

export const keyValueExtractionRegex = /^\s*(?<key>[^\s]+)\s+=\s+"(?<value>[^"]+)"\s*$/

export const resourceTypeExtractionRegex = /^\s*resource\s+"(?<type>[^\s]+)"\s+"(?<name>[^"]+)"\s*{/

export const checkIfStringIsPath = (path: string, regex = /(.|..)?(\/[^/])+/): boolean => {
    return !!regex.exec(path)
}

export const REGEXES = {
    wildcard: /^.*?/,
    space: /(\s+|\/\/[^\n]*|\/\*.*\*\/)+/s,
    depsKeyword: /dependencies/,
    colon: /:/,
    beginSection: /\[/,
    endSection: /],?/,
    package: /\s*.\s*package\s*\(\s*/,
    urlKey: /url/,
    stringLiteral: /"[^"]+"/,
    comma: /,/,
    from: /from/,
    rangeOp: /\.\.[.<]/,
    exactVersion: /\.\s*exact\s*\(\s*/,
}

export const sourceMapRegEx =
    /(?:\/{2}[#@]{1,2}|\/\*)\s+sourceMappingURL\s*=\s*(data:(?:[^;]+;)*(base64)?,)?(\S+)(?:\n\s*)?/

export const packagePattern = new RegExp('[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]')

export const escape = (text: string): string => {
    return text.replace(/(\\:`_\*)/gi, '\\$1')
}

export const regexMatchAll = (regex: RegExp, content: string): RegExpMatchArray[] => {
    const matches: RegExpMatchArray[] = []

    let matchResult
    do {
        matchResult = regex.exec(content)
        if (matchResult) {
            matches.push(matchResult)
        }
    } while (matchResult)

    return matches
}

export const expandDepName = (name: string): string => {
    return name.includes('/') ? name.replace('/', ':') : `${name}:${name}`
}

export const classRegex = (className: string): RegExp => {
    return new RegExp(`(^|\\s+)${className}(\\s+|$)`)
}

export const groovyVersionRegex = (dependency: GradleDependency): RegExp => {
    const groovyQuotes = '(?:["\'](?:""|\'\')?)'
    const groovyVersion = `(?:${groovyQuotes}\\$)?{?([^\\s"'{}$)]+)}?${groovyQuotes}?`

    return regex(
        `id\\s+${groovyQuotes}${dependency.group}${groovyQuotes}\\s+version\\s+${groovyVersion}(?:\\s|;|})`,
    )
}

export const kotlinPluginVersionRegex = (dependency: GradleDependency): RegExp => {
    return regex(`(id\\("${dependency.group}"\\)\\s+version\\s+")[^$].*?(")`)
}

export const dependencyVersionRegex = (dependency: GradleDependency): RegExp => {
    return regex(`(dependency\\s+['"]${dependency.group}:${dependency.name}:)[^'"]+(['"])`)
}

export const formatRegexArray = (
    group: string,
    name: string,
    version: string,
    prefix: string,
    postfix: string,
    comma = COMMA_REGEX,
): RegExp[] => {
    const regexes = [
        `${group}${comma}${name}${comma}${version}`,
        `${group}${comma}${version}${comma}${name}`,
        `${name}${comma}${group}${comma}${version}`,
        `${version}${comma}${group}${comma}${name}`,
        `${name}${comma}${version}${comma}${group}`,
        `${version}${comma}${name}${comma}${group}`,
    ]

    return regexes.map(value => regex(`${prefix}${value}${postfix}`))
}

export const variableRegex = (variable: string, version: string): RegExp => {
    return regex(`(${variable}\\s*:\\s*?["'])(${version})(["'])`)
}

export const updateVersionLiterals = (
    dependency: GradleDependency,
    buildGradleContent: string,
    newValue: string,
): Optional<string> => {
    const regexes: RegExp[] = [
        groovyVersionRegex(dependency),
        kotlinPluginVersionRegex(dependency),
        dependencyVersionRegex(dependency),
    ]

    let result = buildGradleContent
    for (const regex of regexes) {
        const match = regex.exec(result)
        if (match) {
            result = result.replace(match[0], `${match[1]}${newValue}${match[2]}`)
        }
    }
    return result === buildGradleContent ? null : result
}

export const updatePropertyFileGlobalVariables = (
    dependency: GradleDependency,
    content: string,
    newValue: string,
    variables: Record<string, string> = {},
): Optional<string> => {
    const variable = variables[`${dependency.group}:${dependency.name}`]

    if (variable) {
        const value = regex(`(${variable}\\s*=\\s*)(.*)`)
        const match = value.exec(content)

        if (match) {
            return content.replace(match[0], `${match[1]}${newValue}`)
        }
    }

    return null
}

export const updateKotlinVariablesByExtra = (
    dependency: GradleDependency,
    buildGradleContent: string,
    newValue: string,
    variables: Record<string, string> = {},
): Optional<string> => {
    const variable = variables[`${dependency.group}:${dependency.name}`]

    if (variable) {
        const value = regex(`(val ${variable} by extra(?: {|\\()\\s*")(.*)("\\s*[})])`)
        const match = value.exec(buildGradleContent)

        if (match) {
            return buildGradleContent.replace(match[0], `${match[1]}${newValue}${match[3]}`)
        }
    }

    return null
}

export const updateGlobalVariables = (
    dependency: GradleDependency,
    buildGradleContent: string,
    newValue: string,
    variables: Record<string, string> = {},
): Optional<string> => {
    const variable = variables[`${dependency.group}:${dependency.name}`]

    if (variable) {
        const regex = variableDefinitionRegex(variable)
        const match = regex.exec(buildGradleContent)

        if (match) {
            return buildGradleContent.replace(match[0], `${match[1]}${newValue}${match[3]}`)
        }
    }

    return null
}

export const updateGlobalMapVariables = (
    dependency: GradleDependency,
    buildGradleContent: string,
    newValue: string,
    variables: Record<string, string> = {},
): Optional<string> => {
    let variable = variables[`${dependency.group}:${dependency.name}`]

    if (variable) {
        while (variable && variable.split('.').length > 0) {
            const regex = variableMapDefinitionRegex(variable, dependency.version)
            const match = regex.exec(buildGradleContent)

            if (match) {
                return buildGradleContent.replace(match[0], `${match[1]}${newValue}${match[3]}`)
            }

            variable = variable.split('.').splice(1).join('.')
        }
    }

    return null
}

export const variableMapDefinitionRegex = (variable: string, version: Optional<string>): RegExp => {
    return regex(`(${variable}\\s*:\\s*?["'])(${version})(["'])`)
}

export const variableDefinitionRegex = (variable: string): RegExp => {
    return regex(`(${variable}\\s*=\\s*?["'])(.*)(["'])`)
}

export const dependencyStringLiteralExpressionRegex = (dependency: GradleDependency): RegExp => {
    return regex(`\\s*dependency\\s+['"]${dependency.group}:${dependency.name}:([^'"{}$]+)['"](?:\\s|;|})`)
}

export const kotlinImplementationVersionRegex = (dependency: GradleDependency): RegExp => {
    // implementation("com.graphql-java", "graphql-java", graphqlVersion)
    return regex(
        `(?:implementation|testImplementation)\\s*\\(\\s*['"]${dependency.group}['"]\\s*,\\s*['"]${dependency.name}['"]\\s*,\\s*([a-zA-Z_][a-zA-Z_0-9]*)\\s*\\)\\s*(?:\\s|;|})`,
    )
}

export const kotlinPluginVariableDotVersionRegex = (dependency: GradleDependency): RegExp => {
    // id("org.jetbrains.kotlin.jvm").version(kotlinVersion)
    return regex(
        `id\\s*\\(\\s*"${dependency.group}"\\s*\\)\\s*\\.\\s*version\\s*\\(\\s*([a-zA-Z_][a-zA-Z_0-9]*)\\s*\\)\\s*(?:\\s|;|})`,
    )
}

export const dependencyStringVariableExpressionRegex = (dependency: GradleDependency): RegExp => {
    return regex(`\\s*dependency\\s+['"]${dependency.group}:${dependency.name}:([^}]*)}['"](?:\\s|;|)`)
}

export const moduleKotlinVersionRegex = (dependency: GradleDependency): RegExp[] => {
    // one capture group: the version variable
    const group = `group\\s*=\\s*"${dependency.group}"`
    const name = `name\\s*=\\s*"${dependency.name}"`
    const version = `version\\s*=\\s*${KOTLIN_VERSION_REGEX}`

    return formatRegexArray(group, name, version, '', '[\\s),]')
}

export const groovyPluginVersionRegex = (dependency: GradleDependency): RegExp => {
    return regex(
        `(id\\s+${GROOVY_QUOTES}${dependency.group}${GROOVY_QUOTES}\\s+version\\s+${GROOVY_QUOTES})[^"$].*?(${GROOVY_QUOTES})`,
    )
}

export const moduleMapVersionRegex = (dependency: GradleDependency): RegExp[] => {
    // two captures groups: start and end. The version is in between them
    const group = `group\\s*:\\s*${GROOVY_QUOTES}${dependency.group}${GROOVY_QUOTES}`
    const name = `name\\s*:\\s*${GROOVY_QUOTES}${dependency.name}${GROOVY_QUOTES}`
    const version = `version\\s*:\\s*${GROOVY_QUOTES})[^{}$"']+?(${GROOVY_QUOTES}`

    return formatRegexArray(group, name, version, '(', ')')
}

export const moduleKotlinNamedVersionRegex = (dependency: GradleDependency): RegExp[] => {
    // two captures groups: start and end. The version is in between them
    const group = `group\\s*=\\s*"${dependency.group}"`
    const name = `name\\s*=\\s*"${dependency.name}"`
    const version = 'version\\s*=\\s*")[^{}$]*?("'

    return formatRegexArray(group, name, version, '(', ')')
}

export const moduleMapVariableVersionRegex = (dependency: GradleDependency): RegExp[] => {
    // one capture group: the version variable
    const group = `group\\s*:\\s*${GROOVY_QUOTES}${dependency.group}${GROOVY_QUOTES}`
    const name = `name\\s*:\\s*${GROOVY_QUOTES}${dependency.name}${GROOVY_QUOTES}`
    const version = `version\\s*:\\s*${GROOVY_VERSION_REGEX}`

    return formatRegexArray(group, name, version, '', '')
}

export const moduleKotlinVariableVersionRegex = (dependency: GradleDependency): RegExp[] => {
    // one capture group: the version variable
    const group = `group\\s*=\\s*"${dependency.group}"`
    const name = `name\\s*=\\s*"${dependency.name}"`
    const version = `version\\s*=\\s*${KOTLIN_VERSION_REGEX}`

    return formatRegexArray(group, name, version, '', '[\\s),]')
}

export const moduleStringVersionRegex = (dependency: GradleDependency): RegExp => {
    return regex(`${GROOVY_QUOTES}${dependency.group}:${dependency.name}:\\$([^{].*?)${GROOVY_QUOTES}`)
}

export const groovyPluginVariableVersionRegex = (dependency: GradleDependency): RegExp => {
    return regex(
        `id\\s+${GROOVY_QUOTES}${dependency.group}${GROOVY_QUOTES}\\s+version\\s+${GROOVY_VERSION_REGEX}(?:\\s|;|})`,
    )
}

export const kotlinPluginVariableVersionRegex = (dependency: GradleDependency): RegExp => {
    return regex(`id\\("${dependency.group}"\\)\\s+version\\s+${KOTLIN_VERSION_REGEX}(?:\\s|;|})`)
}

export const variableDefinitionFormatMatch = (variable: string): RegExp => {
    return regex(`(${variable}\\s*=\\s*?["'])(.*)(["'])`)
}

export const variableMapDefinitionFormatMatch = (variable: string, version: string): RegExp => {
    return regex(`(${variable}\\s*:\\s*?["'])(${version})(["'])`)
}

export const skipCommentLines = (
    lines: string[],
    lineNumber: number,
): { lineNumber: number; line: string } => {
    let ln = lineNumber

    while (ln < lines.length - 1 && COMMENT_REGEX.test(lines[ln])) {
        ln += 1
    }

    return { line: lines[ln], lineNumber: ln }
}

export const versionLikeSubstring = (input: string): Optional<string> => {
    const match = input ? MODULE_REGEX_CONFIG.versionMatch.exec(input) : null
    return match && match.groups ? match.groups.version : null
}

export const isDependencyString = (input: string): boolean => {
    const split = input?.split(':')

    if (split?.length !== 3) {
        return false
    }

    const [groupId, artifactId, versionPart] = split

    return (
        groupId !== null &&
        artifactId !== null &&
        versionPart !== null &&
        MODULE_REGEX_CONFIG.artifactMatch.test(groupId) &&
        MODULE_REGEX_CONFIG.artifactMatch.test(artifactId) &&
        versionPart === versionLikeSubstring(versionPart)
    )
}

export const parseJavaVersion = (value: string): number => {
    const versionMatch = /version "(?:1\.)?(\d+)[\d._-]*"/.exec(value)

    if (versionMatch !== null && versionMatch.length === 2) {
        return parseInt(versionMatch[1], 10)
    }

    return 0
}

export const getPluginCommands = (content: string): string[] => {
    const result = new Set<string>()
    const lines: string[] = content.split('\n')

    for (const line of lines) {
        const match = PLUGIN_REGEX.exec(line)
        if (match) {
            // @ts-ignore
            const { plugin } = match.groups
            result.add(`gem install ${quote(plugin)}`)
        }
    }

    return [...result]
}

/**
 * The regUrl is expected to be a base URL. GitLab composer repository installation guide specifies
 * to use a base URL containing packages.json. Composer still works in this scenario by determining
 * whether to add / remove packages.json from the URL.
 *
 * See https://github.com/composer/composer/blob/750a92b4b7aecda0e5b2f9b963f1cb1421900675/src/Composer/Repository/ComposerRepository.php#L815
 */
export const transformRegUrl = (url: string): string => {
    return url.replace(/(\/packages\.json)$/, '')
}

export const ESCAPE_CHARS = {
    [TokenType.LineComment]: { match: regex('//.*?$') },
    [TokenType.MultiComment]: { match: regex('(.*?)\\*.*?\\*\\/') },
    [TokenType.Newline]: { match: regex('\r?\n/') },
    [TokenType.Space]: { match: regex('[ \t\r]+/ ') },
    [TokenType.Semicolon]: { match: regex(';') },
    [TokenType.Colon]: { match: regex(':') },
    [TokenType.Dot]: { match: regex('.') },
    [TokenType.Comma]: { match: regex(',') },
    // [TokenType.Operator]: { match: regex(':==|+=?|-=?|/=?|**?|.+|:') },
    [TokenType.Assignment]: { match: regex('=') },
    [TokenType.SingleQuoted]: { match: regex("'") },
    [TokenType.DoubleQuoted]: { match: regex('"') },
    [TokenType.Substitute]: {
        match: regex(
            '${s*[a-zA-Z_][a-zA-Z0-9_]*(?:s*.s*[a-zA-Z_][a-zA-Z0-9_]*)*s*}|$[a-zA-Z_][a-zA-Z0-9_]*(?:.[a-zA-Z_][a-zA-Z0-9_]*)*',
        ),
        value: (value: string): string => value.replace(/^\${?\s*/, '').replace(/\s*}$/, ''),
    },
    [TokenType.Unknown]: { match: regex('.') },
    [TokenType.Word]: { match: regex('[a-zA-Z$_][a-zA-Z0-9$_]+/') },
    // [TokenType.LeftParen]: { match: regex('\\(') },
    // [TokenType.RightParen]: { match: regex('\\)') },
    [TokenType.LeftBracket]: { match: regex('\\[') },
    [TokenType.RightBracket]: { match: regex('\\]') },
    [TokenType.LeftBrace]: { match: regex('\\{') },
    [TokenType.RightBrace]: { match: regex('\\}') },
    [TokenType.TripleSingleQuoted]: { match: regex("'''") },
    [TokenType.TripleDoubleQuoted]: { match: regex('"""') },
    [TokenType.EscapedChar]: {
        match: regex('\\[\'"bfnrt\\]'),
        value: (value: string): string => {
            const regexes = {
                "\\'": "'",
                '\\"': '"',
                '\\b': '\b',
                '\\f': '\f',
                '\\n': '\n',
                '\\r': '\r',
                '\\t': '\t',
                '\\\\': '\\',
            }
            return regexes[value]
        },
    },
}

export const matchPattern = (value, regExp): boolean => {
    return !value || regExp.test(value)
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

export const isHostname = (value: string): boolean => {
    const regExp = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*$/

    return matchPattern(value, regExp)
}

export const inRange = (value, { min, max, inclusive = true }): boolean => {
    if (min > max) {
        throw new Error('Max value must be bigger then min value')
    }

    return inclusive ? min <= value && value <= max : min < value && value < max
}

export const createRegexMatcher = <T extends Keys<typeof ESCAPE_CHARS>, B extends typeof ESCAPE_CHARS[T]>(
    eventType: T,
    body: B,
): Optional<B> => {
    const event = ESCAPE_CHARS[eventType]

    if (event) {
        return merge(cloneDeep(event), body)
    }

    return null
}

export const matchEntry = (match: RegExpMatchArray): any => {
    return {
        matched: match.slice(),
        start: match.index,
        end: (match.index ? match.index : 0) + match[0].length,
        input: match.input,
        groups: match.groups || undefined,
    }
}

export const stripComments = (str: string): string => {
    return str
        .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/g, ' ')
        .replace(/\n/g, '')
        .replace(/^\s+|\s+$|(\s)+/g, '$1')
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
export const match = (value: any, pattern: RegExp): any => {
    return (value = pattern.exec(value)) != null ? value[0] : value
}

/**
 * Get YamlMime of a yaml document
 * @returns the yamlMime if no error occurs, otherwise undefined is returned
 * @param yamlDocument parsed yaml document
 */
export const getYamlMime = (yamlDocument: string): Optional<string> => {
    const regex = /^### YamlMime:([A-Z]\w+)/g
    const m = regex.exec(yamlDocument)

    if (m !== null) {
        return m[1]
    }

    return undefined
}

// Escapes glob pattern characters
export const escapeGlobPattern = (glob: string): string => {
    return glob.replace(/[!#()*?[\\\]{}]/g, '\\$&')
}
