import { Optional } from '../typings/standard-types'

import { Checkers } from './checkers'
import { Errors } from './errors'

export namespace Comparators {
    import valueError = Errors.valueError

    /**
     * Comparator types
     */
    export type Comparator<T> = (a: T, b: T) => number
    export type ComparatorMode = 'asc' | 'desc'

    /**
     * @private
     * @module comparators
     * @param obj initial input object to verify
     * @param prop initial input {@link PropertyKey} to validate by
     * @return {@link boolean} true - if property exists, false - otherwise
     */
    const hasProperty = (obj: any, prop: PropertyKey): boolean => {
        const proto = obj.__proto__ || obj.constructor.prototype

        //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
        return prop in obj || prop in proto || proto[prop] === obj[prop]
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input value.
     * @param {String} b Input value to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByOrder = (a: any, b: any): number => {
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
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compare = <T>(a: T, b: T): number => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return (a === null) - (b === null) || +(a > b) || -(a < b)
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {ComparatorMode} mode comparator mode (ascending / descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByLocale2 = <T extends string>(a: T, b: T, mode: ComparatorMode = 'asc'): number => {
        const a_ = a === null ? '' : `${a}`
        const b_ = b === null ? '' : `${b}`

        return mode === 'asc' ? a_.localeCompare(b_) : b_.localeCompare(a_)
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {ComparatorMode} mode comparator mode (ascending / descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByIgnoreCase = <T extends string>(
        a: T,
        b: T,
        mode: ComparatorMode = 'asc',
    ): number => {
        const a_ = a.toLowerCase()
        const b_ = b.toLowerCase()

        return mode === 'asc' ? (a_ < b_ ? -1 : a_ > b_ ? 1 : 0) : a_ > b_ ? 1 : a_ < b_ ? -1 : 0
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {ComparatorMode} mode comparator mode (ascending / descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByLocaleIgnoreCase = <T extends string>(
        a: T,
        b: T,
        mode: ComparatorMode = 'asc',
    ): number => {
        const a_ = a === null ? '' : `${a}`
        const b_ = b === null ? '' : `${b}`

        return mode === 'asc'
            ? a_.toLowerCase().localeCompare(b_.toLowerCase())
            : b_.toLowerCase().localeCompare(a_.toLowerCase())
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {ComparatorMode} mode comparator mode (ascending / descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByLength = <T extends string>(a: T, b: T, mode: ComparatorMode = 'asc'): number => {
        const a_ = a === null ? '' : `${a}`
        const b_ = b === null ? '' : `${b}`

        const diff = a_.length - b_.length

        return mode === 'asc' ? (diff < 0 ? -1 : diff ? 1 : 0) : diff < 0 ? 1 : diff ? -1 : 0
    }

    /**
     * @public
     * @module comparators
     * @param column initial input {@link String} or {@link Number} column name
     * @return {@link Number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByProperty = <T>(column: PropertyKey): Comparator<T> => {
        return (a: T, b: T) => {
            if (!hasProperty(a, column)) {
                throw valueError(`Property=${String(column)} not exists on object=${a}`)
            }

            if (!hasProperty(b, column)) {
                throw valueError(`Property=${String(column)} not exists on object=${b}`)
            }

            return compareByOrder(a[column], b[column])
        }
    }

    /**
     * @public
     * @module comparators
     * @param {String} property Input string.
     * @param {String} comparator Input string to compare with.
     * @return {Function} -1 - lower, 0 - equals, 1 - greater
     *
     * @example
     * s.sort(cmpBy_('last', cmpBy_('first')));
     */
    export const compareByProperty2 = <T>(
        property: PropertyKey,
        comparator: Comparator<T>,
    ): Comparator<T> => {
        return (a, b) => {
            if (Checkers.isObject(a) && Checkers.isObject(b)) {
                const a_ = a[property]
                const b_ = b[property]

                const cmp_ = Checkers.isFunction(comparator) ? comparator : null

                if (cmp_) {
                    return cmp_(a_, b_)
                }

                if (typeof a_ === typeof b_) {
                    if (Checkers.isObject(a_) || Checkers.isArray(a_)) {
                        return a_.equals(b_)
                    }
                    return compareByLocale(a_, b_)
                }

                return typeof a_ < typeof b_ ? -1 : 1
            }

            throw valueError(`Expected an object when sorting by < ${String(property)} >`)
        }
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {String} value Property name.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByProperty3 = <T>(a: T, b: T, value: PropertyKey): number => {
        return +(a[value] > b[value]) || +(a[value] === b[value]) - 1
    }

    /**
     * @public
     * @module ascending sorting by field
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {PropertyKey} prop property to sort by
     * @param {ComparatorMode} mode comparator mode (ascending/descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByProperty4 = <T>(
        a: T,
        b: T,
        prop: PropertyKey,
        mode: ComparatorMode = 'asc',
    ): number => {
        const a_ = a === null ? null : `${a[prop]}`
        const b_ = b === null ? null : `${b[prop]}`

        if (a_ === b_) return 0

        return mode === 'asc' ? (a < b ? -1 : a > b ? 1 : 0) : a > b ? 1 : a < b ? -1 : 0
    }

    export const compareByProperties = <T>(
        a: T,
        b: T,
        mode: ComparatorMode = 'asc',
        ...props: PropertyKey[]
    ): number => {
        for (const item of props) {
            a = a[item]
            b = b[item]
        }

        return mode === 'asc' ? (a < b ? -1 : a > b ? 1 : 0) : a > b ? 1 : a < b ? -1 : 0
    }

    /**
     * @public
     * @module comparators
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
    export const compareByLocale = (() => {
        const DEFAULT_OPTIONS = { sensitivity: 'base' }
        const DEFAULT_LOCALE = 'en'

        return <T extends string>(a: T, b: T, locale?: string, options?: any): number => {
            const a_ = a === null ? '' : `${a}`
            const b_ = b === null ? '' : `${b}`

            const locale_ = Checkers.isString(locale) ? locale : DEFAULT_LOCALE
            const options_ = Checkers.isObject(options) ? options : DEFAULT_OPTIONS

            const localeCompareSupportsCollator = (): Optional<number> => {
                try {
                    return new Intl.Collator(locale_, options_).compare(a_, b_)
                } catch (e) {
                    console.log(`ERROR: localeCompareSupportsCollator < ${e.name} >`)
                    return null
                }
            }

            const localeCompareSupportsLocales = (): Optional<number> => {
                try {
                    return new Intl.Collator(locale_, options_).compare(a_, b_)
                } catch (e) {
                    console.log(`ERROR: localeCompareSupportsLocales < ${e.name} >`)
                    return null
                }
            }

            let result = localeCompareSupportsCollator()
            if (Checkers.isNull(result)) {
                result = localeCompareSupportsLocales()
                if (Checkers.isNull(result)) {
                    return compareByLocale2(a_, b_)
                }
            }

            return 0
        }
    })()

    /**
     * @public
     * @module comparators
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     * @param list initial input {@link string} array of items to compare by
     */
    export const normalizeAndCompare = (list: string[]): ((a: any, b: any, value: string) => number) => {
        return (a: any, b: any, value: string): number => {
            if (a === null || b === null) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return (a === null) - (b === null)
            }

            const value_ = list.includes(value) ? value : list[0]
            const first = a.normalize(value_)
            const second = b.normalize(value_)

            return +(first > second) || -(first < second) || 1
        }
    }
}
