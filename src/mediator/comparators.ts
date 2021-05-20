import { Optional } from '../../typings/standard-types'
import { Comparator, ComparatorMode, PropertyComparator } from '../../typings/function-types'

import { Checkers, Errors, Files, Logging } from '..'

export namespace Comparators {
    import notNullOrUndefined = Checkers.notNullOrUndefined
    import errorLogs = Logging.errorLogs
    import isString = Checkers.isString
    import isObject = Checkers.isObject
    import valueError = Errors.valueError
    import isFunction = Checkers.isFunction
    import getSegmentName = Files.getSegmentName

    export const sortFilesBySegmentCount = (fileA: string, fileB: string): number => {
        const lengthA = fileA.split('/').length
        const lengthB = fileB.split('/').length

        if (lengthA > lengthB) {
            return -1
        }

        if (lengthA < lengthB) {
            return 1
        }

        // Paths that have the same segment length but
        // less placeholders are preferred
        const countSegments = (prev: number, segment: string): number =>
            getSegmentName(segment) ? prev + 1 : 0
        const segmentLengthA = fileA.split('/').reduce(countSegments, 0)
        const segmentLengthB = fileB.split('/').reduce(countSegments, 0)

        if (segmentLengthA > segmentLengthB) {
            return 1
        }

        if (segmentLengthA < segmentLengthB) {
            return -1
        }

        return fileA.localeCompare(fileB)
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
            if (Checkers.hasProperty(a, 'compareTo')) {
                return a.compareTo(b)
            }

            return a < b ? -1 : 1
        }

        return typeof a < typeof b ? -1 : 1
    }

    export const compareArray = (a: any[], b: any): number => {
        for (let i = 0; i < a.length; ++i) {
            const result = compare(a[i], b[i])
            if (result !== 0) {
                return result
            }
        }

        return 0
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compare = <T>(a: T, b: T): number => {
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
    export const compareByLocale = <T extends string>(a: T, b: T, mode: ComparatorMode = 'asc'): number => {
        let a_ = !a ? '' : `${a}`
        let b_ = !b ? '' : `${b}`

        if (mode !== 'asc') {
            b_ = [a_, (a_ = b_)][0]
        }

        return a_.localeCompare(b_)
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {ComparatorMode} mode comparator mode (ascending / descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareIgnoreCase = <T extends string>(a: T, b: T, mode: ComparatorMode = 'asc'): number => {
        let a_ = !a ? '' : `${a}`.toLowerCase()
        let b_ = !b ? '' : `${b}`.toLowerCase()

        if (mode !== 'asc') {
            b_ = [a_, (a_ = b_)][0]
        }

        return a_ < b_ ? -1 : a_ > b_ ? 1 : 0
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
        a: Optional<T>,
        b: Optional<T>,
        mode: ComparatorMode = 'asc',
    ): number => {
        let a_: string = !a ? '' : `${a}`.toLowerCase()
        let b_: string = !b ? '' : `${b}`.toLowerCase()

        if (mode !== 'asc') {
            b_ = [a_, (a_ = b_)][0]
        }

        return a_.localeCompare(b_)
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {ComparatorMode} mode comparator mode (ascending / descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByLength = <T extends string>(
        a: Optional<T>,
        b: Optional<T>,
        mode: ComparatorMode = 'asc',
    ): number => {
        let a_ = !a ? '' : `${a}`
        let b_ = !b ? '' : `${b}`

        if (mode !== 'asc') {
            b_ = [a_, (a_ = b_)][0]
        }

        const diff = a_.length - b_.length

        return diff < 0 ? -1 : diff ? 1 : 0
    }

    /**
     * @public
     * @module comparators
     * @param {String} prop Input string.
     * @param {String} comparator Input string to compare with.
     * @return {Function} -1 - lower, 0 - equals, 1 - greater
     *
     * @example
     * s.sort(compareByPropertyKey('last', compareByPropertyKey('first')));
     */
    export const compareByPropertyKey = <T>(
        prop: PropertyKey,
        comparator: Comparator<T> = compareByOrder,
    ): Comparator<T> => {
        return <TT>(a: TT, b: TT) => {
            if (Checkers.isObject(a) && Checkers.isObject(b)) {
                const a_ = a[prop]
                const b_ = b[prop]

                const comparator_ = Checkers.isFunction(comparator) ? comparator : null

                if (comparator_) {
                    return comparator_(a_, b_)
                }

                if (typeof a_ === typeof b_) {
                    if (Checkers.isObject(a_) || Checkers.isArray(a_)) {
                        return a_.equals(b_)
                    }
                    return compareByLocaleOptions(a_, b_)
                }

                return typeof a_ < typeof b_ ? -1 : 1
            }

            throw Errors.valueError(`Expected object with a valid property < ${String(prop)} >`)
        }
    }

    /**
     * @public
     * @module comparators
     * @param prop initial input @link String} or {@link Number} column name
     * @param comparator initial input {@link Comparator} to operate by
     * @return {@link Number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByProp = <T>(
        prop: PropertyKey,
        comparator: Comparator<T> = compareByOrder,
    ): Comparator<T> => {
        return <TT>(a: TT, b: TT) => {
            if (!Checkers.hasProperty(a, prop)) {
                throw Errors.valueError(`Property=${String(prop)} not exists on object=${a}`)
            }

            if (!Checkers.hasProperty(b, prop)) {
                throw Errors.valueError(`Property=${String(prop)} not exists on object=${b}`)
            }

            if (!isFunction(comparator)) {
                throw valueError(`Invalid comparator type: ${typeof comparator}, should be [Function]`)
            }

            return comparator(a[prop], b[prop])
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
    export const compareByProperty = <T>(a: T, b: T, value: PropertyKey): number => {
        return +(a[value] > b[value]) || +(a[value] === b[value]) - 1
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {PropertyKey} prop property to compare by
     * @param {ComparatorMode} mode comparator mode (ascending/descending)
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByPropertyOrder = <T>(
        a: T,
        b: T,
        prop: PropertyKey,
        mode: ComparatorMode = 'asc',
    ): number => {
        let a_ = !a ? '' : `${a[prop]}`
        let b_ = !b ? '' : `${b[prop]}`

        if (a_ === b_) {
            return 0
        }

        if (mode !== 'asc') {
            b_ = [a_, (a_ = b_)][0]
        }

        return a_ < b_ ? -1 : a_ > b_ ? 1 : 0
    }

    /**
     * @public
     * @param {Comparator} comparators collection to operate by
     */
    export const compareBy = <T>(...comparators: Comparator<T>[]): Comparator<T> => {
        return (a, b): number => {
            return comparators.map(f => f.call(null, a, b)).find(v => v !== 0) || 0
        }
    }

    /**
     * @public
     * @module comparators
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {ComparatorMode} mode comparator mode (ascending/descending)
     * @param {PropertyKey} props property collection to compare by
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     */
    export const compareByProps = <T>(
        a: T,
        b: T,
        mode: ComparatorMode = 'asc',
        ...props: PropertyKey[]
    ): number => {
        for (const item of props) {
            a = a[item]
            b = b[item]
        }

        if (mode !== 'asc') {
            b = [a, (a = b)][0]
        }

        return a < b ? -1 : a > b ? 1 : 0
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
    export const compareByLocaleOptions = ((localeOptions: any): any => {
        return <T extends string>(
            a: Optional<T>,
            b: Optional<T>,
            mode: ComparatorMode = 'asc',
            locale?: string,
            options?: any,
        ): number => {
            let a_ = !a ? '' : `${a}`
            let b_ = !b ? '' : `${b}`

            if (mode !== 'asc') {
                b_ = [a_, (a_ = b_)][0]
            }

            const locale_: string | string[] = isString(locale) ? locale : localeOptions.locale
            const options_: Intl.CollatorOptions = isObject(options) ? options : localeOptions.options

            const compareByCollator = <TT extends string>(aa: TT, bb: TT): Optional<number> => {
                try {
                    return new Intl.Collator(locale_, options_).compare(aa, bb)
                } catch (error) {
                    errorLogs(`Invalid locale collation, message: ${error.message}`)

                    return null
                }
            }

            return (
                [compareByCollator, compareByLocale]
                    .map(func => func.call(null, a_, b_))
                    .find(notNullOrUndefined) || 0
            )
        }
    })({ locale: 'en', options: { sensitivity: 'base' } })

    /**
     * @public
     * @module comparators
     * @return {number} -1 - lower, 0 - equals, 1 - greater
     * @param list initial input {@link string} array of items to compare by
     */
    export const normalizeAndCompare = ((...list: string[]): PropertyComparator<any> => {
        return (a: any, b: any, value: string): number => {
            if (a === null || b === null) {
                // @ts-ignore
                return (a === null) - (b === null)
            }

            const value_ = list.includes(value) ? value : list[0]
            const first = a.normalize(value_)
            const second = b.normalize(value_)

            return +(first > second) || -(first < second) || 0
        }
    })('NFC', 'NFD', 'NFKC', 'NFKD')
}
