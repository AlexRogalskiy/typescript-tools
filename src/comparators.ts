import { Checkers } from './checkers'
import { Errors } from './errors'

export namespace Comparators {
    import valueError = Errors.valueError

    /**
     * Comparator type
     */
    export type Comparator<T> = (a: T, b: T) => number

    const hasProperty = (obj, prop): boolean => {
        const proto = obj.__proto__ || obj.constructor.prototype

        //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
        return prop in obj || prop in proto || proto[prop] === obj[prop]
    }

    /**
     * @public
     * @module sorting
     * @param column initial input {@link String} or {@link Number} column name
     * @return {@link Number} -1 - lower, 0 - equals, 1 - greater
     */
    export const comparator = <T>(column: PropertyKey): Comparator<T> => {
        return (a: T, b: T) => {
            if (!hasProperty(a, column)) {
                throw valueError(`Property=${String(column)} not exists on object=${a}`)
            }

            if (!hasProperty(b, column)) {
                throw valueError(`Property=${String(column)} not exists on object=${b}`)
            }

            return cmpByDefault(a[column], b[column])
        }
    }

    /**
     * @public
     * @module sorting
     * @param {String} a Input value.
     * @param {String} b Input value to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByDefault = (a: any, b: any): number => {
        if (a === b) {
            return 0
        }

        if (typeof a === typeof b) {
            if (hasProperty(a, 'compareTo')) {
                return a.compareTo(b)
            }

            // a.localCompare(b)
            return a < b ? -1 : 1
        }

        return typeof a < typeof b ? -1 : 1
    }

    /**
     * @public
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmp = <T>(a: T, b: T): number => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return (a === null) - (b === null) || +(a > b) || -(a < b)
    }

    /**
     * @public
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLocale = <T extends string>(a: T, b: T): number => {
        const a_ = a === null ? '' : `${a}`
        const b_ = b === null ? '' : `${b}`

        return a_.localeCompare(b_)
    }

    export const cmpByIgnoreCase = <T extends string>(a: T, b: T): number => {
        const a_ = a.toLowerCase()
        const b_ = b.toLowerCase()

        if (a_ < b_) {
            return -1
        }
        if (a_ > b_) {
            return 1
        }

        return 0
    }

    /**
     * @public
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLocaleIgnoreCase = <T extends string>(a: T, b: T): number => {
        const a_ = a === null ? '' : `${a}`
        const b_ = b === null ? '' : `${b}`

        return a_.toLowerCase().localeCompare(b_.toLowerCase())
    }

    /**
     * @public
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLength = <T extends string>(a: T, b: T): number => {
        const a_ = a === null ? '' : `${a}`
        const b_ = b === null ? '' : `${b}`

        return a_.length < b_.length ? -1 : a_.length > b_.length ? 1 : 0
    }

    /**
     * @public
     * @module ascending sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLengthAsc = <T extends string>(a: T, b: T): number => {
        const diff = a.length - b.length

        return diff < 0 ? -1 : diff ? 1 : 0
    }

    /**
     * @public
     * @module descending sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLengthDesc = <T extends string>(a: T, b: T): number => {
        const diff = a.length - b.length

        return diff < 0 ? 1 : diff ? -1 : 0
    }

    /**
     * @public
     * @module ascending sorting by field
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {PropertyKey} prop property to sort by
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByFieldAsc = <T>(a: T, b: T, prop: PropertyKey): number => {
        a = a[prop]
        b = b[prop]

        return a < b ? -1 : a > b ? 1 : 0
    }

    export const cmpDeepByFieldAsc = <T>(a: T, b: T, prop: PropertyKey[]): number => {
        for (const item of prop) {
            a = a[item]
            b = b[item]
        }

        return a < b ? -1 : a > b ? 1 : 0
    }

    /**
     * @public
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {String} locale Language locale.
     * @param {Object} options Optional. Additional properties of comparison.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     *
     * @example
     * options = { sensitivity: 'base' }
     * locale = 'sv'
     */
    export const cmpByLocaleLang = (() => {
        const options_ = { sensitivity: 'base' }
        const locale_ = 'i'

        return <T extends string>(a: T, b: T, locale: string, options: any) => {
            const a_ = a === null ? '' : `${a}`
            const b_ = b === null ? '' : `${b}`

            locale = Checkers.isString(locale) ? locale : locale_
            options = Checkers.isObject(options) ? options : options_

            const localeCompareSupportsCollator = (): number | null => {
                try {
                    return new Intl.Collator(locale, options).compare(a_, b_)
                } catch (e) {
                    console.log(`ERROR: localeCompareSupportsCollator < ${e.name} >`)
                    return null
                }
            }

            const localeCompareSupportsLocales = (): number | null => {
                try {
                    return new Intl.Collator(locale, options).compare(a_, b_)
                } catch (e) {
                    console.log(`ERROR: localeCompareSupportsLocales < ${e.name} >`)
                    return null
                }
            }

            let result = localeCompareSupportsCollator()
            if (Checkers.isNull(result)) {
                result = localeCompareSupportsLocales()
                if (Checkers.isNull(result)) {
                    result = cmpByLocale(a_, b_)
                }
            }

            return result
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {String} value Property name.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByProperty = <T>(a: T, b: T, value: PropertyKey): number => {
        return +(a[value] > b[value]) || +(a[value] === b[value]) - 1
    }

    /**
     * @public
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {String} value Property name.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByNormalize = ((list: string[]): ((a: any, b: any, value: string) => number) => {
        return (a: any, b: any, value: string): number => {
            if (a === null || b === null) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return (a === null) - (b === null)
            }

            value = list.includes(value) ? value : list[0]
            const first = a.normalize(value)
            const second = b.normalize(value)

            return +(first > second) || -(first < second) || 1
        }
    })(['NFC', 'NFD', 'NFKC', 'NFKD'])

    /**
     * @public
     * @module sorting
     * @param {String} property Input string.
     * @param {String} comparator Input string to compare with.
     * @return {Function} -1 - lower, 0 - equals, 1 - greater
     *
     * @example
     * s.sort(cmpBy_('last', cmpBy_('first')));
     */
    export const cmpBy = <T>(property: string, comparator: Comparator<T>): Comparator<T> => {
        return (a, p) => {
            if (Checkers.isObject(a) && Checkers.isObject(p)) {
                const a_ = a[property]
                const b_ = p[property]

                const cmp_ = Checkers.isFunction(comparator) ? comparator : null

                if (cmp_) {
                    return cmp_(a, p)
                }

                if (typeof a_ === typeof b_) {
                    if (Checkers.isObject(a_) || Checkers.isArray(a_)) {
                        return a_.equals(b_)
                    }
                    return cmpByLocaleLang(a_, b_, 'en', {})
                }

                return typeof a_ < typeof b_ ? -1 : 1
            }

            throw valueError(`Expected an object when sorting by < ${property} >`)
        }
    }
}
