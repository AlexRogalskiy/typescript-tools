import { Checkers } from './checkers'
import { Exceptions } from './exceptions'

export namespace Comparators {
    import isNull = Checkers.isNull
    import isString = Checkers.isString
    import isObject = Checkers.isObject
    import isFunction = Checkers.isFunction
    import isArray = Checkers.isArray
    import valueException = Exceptions.valueException

    /**
     * Default comparator type
     */
    export type Comparator<T> = (a: T, b: T) => number

    export const comparator = <T>(column: number): Comparator<T> => {
        return (obj1: T, obj2: T) => {
            const hasProperty = (obj: any, prop: string): boolean => {
                const proto = obj.__proto__ || obj.constructor.prototype
                return prop in obj || prop in proto || proto[prop] === obj[prop]
                //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop])
            }

            const a = obj1[column]
            const b = obj2[column]

            if (a === b) {
                return 0
            }

            if (typeof a === typeof b) {
                if (hasProperty(a, 'compareTo')) {
                    return a.compareTo(b)
                }
                // return a.localCompare(b)
                return a < b ? -1 : 1
            }
            return typeof a < typeof b ? -1 : 1
        }
    }

    /**
     * @private
     * @module sorting
     * @param {String} a Input value.
     * @param {String} b Input value to compare with.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByDefault = (a: any, b: any): number => {
        const hasProperty = (obj, prop): boolean => {
            const proto = obj.__proto__ || obj.constructor.prototype

            //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
            return prop in obj || prop in proto || proto[prop] === obj[prop]
        }

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
     * @private
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmp = (a: any, b: any): number => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return (a === null) - (b === null) || +(a > b) || -(a < b)
    }

    /**
     * @private
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLocale = (a: any, b: any): number => {
        a = a === null ? '' : `${a}`
        b = b === null ? '' : `${b}`

        return a.localeCompare(b)
    }

    /**
     * @private
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLocaleIgnoreCase = (a: any, b: any): number => {
        a = a === null ? '' : `${a}`
        b = b === null ? '' : `${b}`

        return a.toLowerCase().localeCompare(b.toLowerCase())
    }

    /**
     * @private
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByLength = (a: any, b: any): number => {
        a = a === null ? '' : `${a}`
        b = b === null ? '' : `${b}`

        return a.length < b.length ? -1 : a.length > b.length ? 1 : 0
    }

    /**
     * @private
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {String} locale Language locale.
     * @param {Object} options Optional. Additional properties of comparison.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     *
     * @example
     * options = { sensitivity: 'base' }
     * locale = 'sv'
     */
    export const cmpByLocaleLang = (() => {
        const options_ = { sensitivity: 'base' }
        const locale_ = 'i'

        return function (a: any, b: any, locale: string, options: any) {
            a = a === null ? '' : `${a}`
            b = b === null ? '' : `${b}`

            locale = isString(locale) ? locale : locale_
            options = isObject(options) ? options : options_

            const localeCompareSupportsCollator = (): number | null => {
                try {
                    return new Intl.Collator(locale, options).compare(a, b)
                } catch (e) {
                    console.log(`ERROR: localeCompareSupportsCollator < ${e.name} >`)
                    return null
                }
            }

            const localeCompareSupportsLocales = (): number | null => {
                try {
                    return new Intl.Collator(locale, options).compare(a, b)
                } catch (e) {
                    console.log(`ERROR: localeCompareSupportsLocales < ${e.name} >`)
                    return null
                }
            }

            let result = localeCompareSupportsCollator()
            if (isNull(result)) {
                result = localeCompareSupportsLocales()
                if (isNull(result)) {
                    result = cmpByLocale(a, b)
                }
            }

            return result
        }
    })()

    /**
     * @private
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {String} value Property name.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByProperty = <T>(a: T, b: T, value: string): number => {
        return +(a[value] > b[value]) || +(a[value] === b[value]) - 1
    }

    /**
     * @private
     * @module sorting
     * @param {String} a Input string.
     * @param {String} b Input string to compare with.
     * @param {String} value Property name.
     * @return {Integer} -1 - lower, 0 - equals, 1 - greater
     */
    export const cmpByNormalize = (() => {
        const list = ['NFC', 'NFD', 'NFKC', 'NFKD']

        return (a, b, value): number => {
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
    })()

    /**
     * @private
     * @module sorting
     * @param {String} prop Input string.
     * @param {String} cmp Input string to compare with.
     * @return {Function} -1 - lower, 0 - equals, 1 - greater
     *
     * @example
     * s.sort(cmpBy_('last', cmpBy_('first')));
     */
    export const cmpBy = <T>(prop: string, cmp): Comparator<T> => {
        return (o, p) => {
            if (isObject(o) && isObject(p)) {
                const a = o[prop]
                const b = p[prop]

                cmp = isFunction(cmp) ? cmp : null

                if (cmp) {
                    return cmp(o, p)
                }

                if (typeof a === typeof b) {
                    if (isObject(a) || isArray(a)) {
                        return a.equals(b)
                    }
                    return cmpByLocaleLang(a, b, 'en', {})
                }

                return typeof a < typeof b ? -1 : 1

                /*if(a === b) {
                    return (globals.toolset.isFunction(cmp) ? cmp(o, p) : 0);
                }
                if(typeof a === typeof b) {
                    return a < b ? -1 : 1;
                }
                return typeof a < typeof b ? -1 : 1;*/
            }

            throw valueException(`Expected an object when sorting by < ${prop} >`)
        }
    }
}
