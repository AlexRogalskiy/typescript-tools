import _ from 'lodash'

import { Consumer, Predicate, Processor, Comparator, BiProcessor } from '../../typings/function-types'

import { Numbers, Checkers, Errors, Maths, Sorting, CommonUtils, Objects } from '..'

import { SizeUtils } from '../utils/size-utils'

export namespace Arrays {
    import Helpers = Maths.Helpers

    import random = Numbers.random
    import randInt = Numbers.randInt

    import typeError = Errors.typeError
    import valueError = Errors.valueError

    import isNull = Checkers.isNull
    import isFunction = Checkers.isFunction
    import isArray = Checkers.isArray
    import checkType = Checkers.checkType
    import isInRange = Checkers.isInRange
    import checkArray = Checkers.checkArray

    import defineProperty = CommonUtils.defineProperty
    import lambda = CommonUtils.lambda
    import defineStaticProperty = CommonUtils.defineStaticProperty
    import isUndefined = Checkers.isUndefined
    import notNullOrUndefined = Checkers.notNullOrUndefined
    import isNullOrUndefined = Checkers.isNullOrUndefined

    import fromBigInteger = SizeUtils.fromBigInteger
    import interpolateSizes = SizeUtils.interpolateSizes
    import toBigInteger = SizeUtils.toBigInteger
    ;((): void => {
        const props = {
            proto: {
                index: 'index',
            },
            static: {
                index: '__index__',
            },
        }

        const indexOf_ = (array: any[], searchElement: any, fromIndex = 0): number => {
            let i,
                pivot = fromIndex ? fromIndex : 0

            if (!array) {
                throw new TypeError()
            }

            const length = array.length
            if (length === 0 || pivot >= length) {
                return -1
            }

            if (pivot < 0) {
                pivot = length - Math.abs(pivot)
            }

            for (i = pivot; i < length; i++) {
                if (array[i] === searchElement) {
                    return i
                }
            }

            return -1
        }

        if (!isFunction(Array.prototype[props.proto.index])) {
            defineProperty(Array.prototype, props.proto.index, {
                value(searchElement, fromIndex) {
                    return indexOf_(this as any[], searchElement, fromIndex)
                },
            })
        }

        if (!isFunction(Array[props.static.index])) {
            defineStaticProperty(Array, props.static.index, {
                value: (array, obj1, obj2) => indexOf_(array, obj1, obj2),
            })
        }
    })()

    export const arrayToMap = (array: string[]): { [key: string]: boolean } => {
        return array.reduce(
            (obj, value) => ({
                ...obj,
                [value]: true,
            }),
            {},
        )
    }

    export const isArraysEqual = <T>(first: T[], second: T[]): boolean => {
        if (first.length !== second.length) {
            return false
        }

        return !first.some(region => !second.includes(region))
    }

    export const flat = <T extends any[]>(array: T): FlatArray<T, 1>[] => {
        if (array.flat) {
            return array.flat()
        }

        // EDGE workaround
        return array.reduce((acc, val) => acc.concat(val), [])
    }

    export const addUnique = (arr: any[], items: any[]): any[] => {
        for (const item of items) {
            if (!arr.includes(item)) {
                arr.push(item)
            }
        }

        return arr
    }

    export const remove = (index: number, arr: any[]): any => arr.splice(index, 1)[0]

    export const uniqueArray = <T>(arr: T[]): T[] => Array.from(new Set(arr))

    export const asyncForEach = async (array, callback): Promise<void> => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    export const findMinimalFree = (
        array: number[],
        base: number,
        comparator: Comparator<number> = (a, b) => b - a,
    ): number => {
        return array.sort(comparator).reduceRight((prev, cur) => (prev === cur ? prev + 1 : prev), base)
    }

    export const appendToArray = (sliceSize: number) => (destination, source) => {
        // NOTE: destination.push(...source) throws "RangeError: Maximum call stack
        // size exceeded" for sufficiently lengthy source arrays
        let index = 0
        let slice = []
        while ((slice = source.slice(index, index + sliceSize)).length > 0) {
            destination.push(...slice)
            index += sliceSize
        }
    }

    export const arrayEquals = <T>(a: T[], b: T[]): boolean =>
        a.length === b.length && a.every((_, i) => a[i] === b[i])

    export const makeArray3 = <T>(size: number, initializer: any): T[] => {
        if (!isFunction(initializer)) {
            const val = initializer
            initializer = () => val
        }

        const array: T[] = []
        for (let i = 0; i < size; ++i) {
            array.push(initializer(i))
        }
        return array
    }

    export const first = <T>(arr: T[]): T => {
        return arr[0]
    }

    export const last = <T>(arr): T[] => {
        return arr[arr.length - 1]
    }

    export const clamp = (num, min, max): number => {
        return Math.max(min, Math.min(num, max))
    }

    export const flatMap = <T>(arr: any, selector: BiProcessor<any, number, T>): T[] => {
        return arr.reduce((result, item, i) => {
            const mappedValue = selector(item, i)
            if (notNullOrUndefined(mappedValue)) {
                if (Array.isArray(mappedValue)) {
                    result.push(...mappedValue)
                } else {
                    result.push(mappedValue)
                }
            }

            return result
        }, [])
    }

    export const memoize = (func: any, areArgsEqual = equalItems): any => {
        let lastArgs: any[] = [],
            lastResult

        return function (...args) {
            if (!areArgsEqual(args, lastArgs)) {
                lastResult = Objects.deepFreeze(func(...(lastArgs = args)))
            }
            return lastResult
        }
    }

    export const sumBy = <T>(array: T[], selector: Processor<T, number>): number => {
        return array.map(selector).reduce((sum, value) => sum + value, 0)
    }

    export const averageBy = <T>(array: T[], selector: Processor<T, number>): number => {
        return sumBy(array, selector) / array.length
    }

    export const keyBy = (arrayOrIter, keySelector, valueMapper: any): any => {
        const array = Array.isArray(arrayOrIter) ? arrayOrIter : Array.from(arrayOrIter)

        return array.reduce((map, item, i) => {
            const key = keySelector(item, i)
            map[key] = valueMapper(item, key, map[key])
            return map
        }, {})
    }

    export const bitsToNumber = (...bits: number[]): number => {
        // @ts-ignore
        return bits.reduce((number, bit) => (number << 1) | (!!bit | 0), 0)
    }

    export const makeRange = (start: number, end: number): any => {
        if (isUndefined(end)) {
            if (start < 0) {
                throw new TypeError('Invalid count')
            }

            end = start - 1
            start = 0
        }

        const dir = start > end ? -1 : 1
        const count = Math.abs(end - start + dir)

        return makeArray3(count, i => i * dir + start)
    }

    export const aggregateStorage = (...list): any => {
        const aggregate = list.reduce((aggregate, storage) => {
            for (const [key, value] of Object.entries(storage)) {
                aggregate[key] = aggregate[key].add(toBigInteger(value))
            }
            return aggregate
        }, {})

        return mapValues(aggregate, fromBigInteger)
    }

    export const interpolateStorage = (storage1, storage2, t): any => {
        const keySet = new Set([...Object.keys(storage1), ...Object.keys(storage2)])

        return keyBy(
            keySet.keys(),
            i => i,
            key => interpolateSizes(storage1[key], storage2[key], t),
        )
    }

    export const keyByProperty2 = (array, keyName, valueMapper): any => {
        return keyBy(array, item => item[keyName], valueMapper)
    }

    export const groupBy2 = (array, keySelector, valueMapper: any): any => {
        return keyBy(array, keySelector, (item, _, list: any[] = []) => {
            list.push(valueMapper(item))
            return list
        })
    }

    export const countBy = <T>(array: T[], keySelector: any): any => {
        return keyBy(array, keySelector, (_, __, count = 0) => count + 1)
    }

    export const mapValues = (obj: any, mapOp: (value, key) => any, omitUndefinedValues = true): any => {
        const res = {}

        for (const [key, value] of Object.entries(obj)) {
            const newValue = mapOp(value, key)
            if (!omitUndefinedValues || isNullOrUndefined(newValue)) res[key] = newValue
        }

        return res
    }

    export const mergeBy = (...arrays): any => {
        const keySelector = isFunction(last(arrays)) ? arrays.pop() : null
        const merge = {}

        for (const arr of arrays) {
            Object.assign(
                merge,
                keyBy(arr, keySelector, i => i),
            )
        }

        return Object.values(merge)
    }

    export const reverse = (iterable): any => {
        return Array.from(iterable).reverse()
    }

    export const get = (val, path, defaultValue): any => {
        for (const part of path) {
            if (val == null) {
                val = undefined
                break
            }

            val = val[part]
        }

        return isNullOrUndefined(val) ? val : defaultValue
    }

    export const equalItems = (arr1, arr2): boolean => {
        if (arr1.length !== arr2.length) {
            return false
        }

        for (let i = 0; i < arr1.length; ++i) {
            if (!Object.is(arr1[i], arr2[i])) {
                return false
            }
        }

        return true
    }

    export const unique = (values: any[]): any[] => {
        return Array.from(new Set(values).values())
    }

    export const unionAll = (...arrays: any[]): any[] => {
        return unique(flatMap(arrays, i => i))
    }

    export const hashCode = (value: any): number => {
        return Array.from(JSON.stringify(value)).reduce(
            (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
            0,
        )
    }

    export const filterValues = (obj: any, filter: (value, key) => any): any => {
        return mapValues(obj, (value, key) => (filter(value, key) ? value : undefined))
    }

    /**
     * Ensures the given value is a string array.
     *
     * @param {any} x - The value to ensure.
     * @returns {string[]} The string array.
     */
    export const toStringArray = (x: any[]): string[] => {
        if (Array.isArray(x)) {
            return x.map(String)
        }
        return []
    }

    export const randomJoin = (n: number, delim = ' ', ...args: any[]): string => {
        return _.range(n)
            .map(() => randomElement(args))
            .join(delim)
    }

    export const validateString = (input: string, lexDelim = ',', tokenDelim = '='): boolean => {
        if (!input) {
            return true
        }

        const pairs = input.split(lexDelim)
        const res = pairs.map(pair => {
            const s = pair.split(tokenDelim)
            const [key, val] = s
            return key && val
        })

        if (res.some(r => !r)) {
            throw valueError("Values should be specified in 'key=val,key2=val2' format!")
        }

        return true
    }

    export const findMinValue = (arr: number[]): number => {
        return Math.min.apply(
            null,
            arr.filter(i => i !== undefined),
        )
    }

    export const findMaxValue = (arr: number[]): number => {
        return Math.max.apply(
            null,
            arr.filter(i => i !== undefined),
        )
    }

    export const selectors = (keys: string[], selectors: string[]): { [k: string]: any } => {
        return Object.keys(selectors)
            .map(selector => {
                if (keys.includes(selector)) {
                    return [selector, selectors[selector]]
                }

                return null
            })
            .filter(x => x)
    }

    export const trimNulls = <T>(arr: T[]): { deleted: number; result: T[] } => {
        const len = arr.length

        let i = 0
        while ((arr[i] === null || typeof arr[i] === 'undefined') && i < len) {
            ++i
        }

        return {
            deleted: i,
            result: arr.slice(i),
        }
    }

    export const init = (() => {
        const props = {
            proto: {
                unique: 'unique',
                forEachParallel: 'forEachParallel',
                forEachSequential: 'forEachSequential',
            },
        }

        const unique_ = (obj: any): any => {
            const res = obj.concat()
            for (let i = 0; i < res.length; ++i) {
                for (let j = i + 1; j < res.length; ++j) {
                    if (res[i] === res[j]) {
                        res.splice(j--, 1)
                    }
                }
            }

            return res
        }

        const iterateAsync_ = async <T>(obj: any, func: (item: T) => Promise<void>): Promise<void> => {
            await Promise.all(obj.map(async (item: T) => await func(item)))
        }

        const iterateSync_ = async <T>(obj: any, func: (item: T) => void): Promise<void> => {
            for (const item of obj) {
                func(item)
            }
        }

        if (!isFunction(Array.prototype[props.proto.unique])) {
            defineProperty(Array.prototype, props.proto.unique, {
                value(): any[] {
                    return unique_(this)
                },
            })
        }

        if (!isFunction(Array.prototype[props.proto.forEachParallel])) {
            defineProperty(Array.prototype, props.proto.forEachParallel, {
                async value(func: (item: any) => Promise<void>): Promise<void> {
                    return await iterateAsync_(this, func)
                },
            })
        }

        if (!isFunction(Array.prototype[props.proto.forEachSequential])) {
            defineProperty(Array.prototype, props.proto.forEachSequential, {
                async value(func: (item: any) => Promise<void>): Promise<void> {
                    return await iterateSync_(this, func)
                },
            })
        }
    })()

    /**
     * Copies array and then pushes item into it.
     * @param {array} arr Array to copy and into which to push
     * @param {any} item Array item to add (to end)
     * @returns {array} Copy of the original array
     */
    export const push = (arr: any[], item: any): any[] => {
        arr = arr.slice()
        arr.push(item)
        return arr
    }

    /**
     * Copies array and then unshifts item into it.
     * @param {any} item Array item to add (to beginning)
     * @param {array} arr Array to copy and into which to unshift
     * @returns {array} Copy of the original array
     */
    export const unshift = (item: any, arr: any): any[] => {
        arr = arr.slice()
        arr.unshift(item)
        return arr
    }

    /**
     * Copy items out of one array into another.
     * @param {array} source Array with items to copy
     * @param {array} target Array to which to copy
     * @param {function} conditionCb Callback passed the current item;
     *     will move item if evaluates to `true`
     * @returns {void}
     */
    export const moveToAnotherArray = (source: any[], target: any[], conditionCb): void => {
        const il = source.length
        for (let i = 0; i < il; i++) {
            const item = source[i]
            if (conditionCb(item)) {
                target.push(source.splice(i--, 1)[0])
            }
        }
    }

    export const list = (...args: any[]): any[] => {
        // const unboundSlice = Array.prototype.slice
        // const slice = Function.prototype.call.bind(unboundSlice)
        // return slice(args, 0)
        return Array.prototype.slice.call(args, 0)
    }

    /**
     * Creates array by range
     * range(n) creates a array from 1 to n, including n
     * range(n,m) creates a array from n to m, by step of 1. May not include m, if n or m are not integer.
     * range(n,m,delta) creates a array from n to m, by step of delta. May not include m
     *
     * @param min
     * @param max
     * @param delta
     */
    export const rangeBy = (min: number, max?: number, delta?: number): number[] => {
        const res: number[] = []
        let myStepCount

        if (!max) {
            for (let i = 0; i < min; i++) {
                res[i] = i + 1
            }
        } else {
            if (!delta) {
                myStepCount = max - min
                for (let i = 0; i <= myStepCount; i++) {
                    res.push(i + min)
                }
            } else {
                myStepCount = Math.floor((max - min) / delta)
                for (let i = 0; i <= myStepCount; i++) {
                    res.push(i * delta + min)
                }
            }
        }

        return res
    }

    export const insertAll = (array: any[], index: number, ...args: any): any[] => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array # 1 < ${array} >`)
        }

        index = Math.min(index, array.length)
        array.splice(index, 0, ...args)
        return array
    }

    export function shuffle<T>(arr: T[]): T[] {
        if (!Array.isArray(arr)) {
            throw new Error('expected an array')
        }
        const len = arr.length
        const result = Array(len)
        for (let i = 0, rand; i < len; i++) {
            rand = Math.floor(Math.random() * i)
            if (rand !== i) {
                result[i] = result[rand]
            }
            result[rand] = arr[i]
        }

        return result
    }

    export const range = (start: number, end: number, step: number): number[] => {
        const array: number[] = []

        if (step > 0) {
            for (let i = start; i <= end; i += step) {
                array.push(i)
            }
        } else {
            for (let i = start; i >= end; i += step) {
                array.push(i)
            }
        }

        return array
    }

    export const randomElement = <T>(arr: T[]): T => arr[random(arr.length)]

    /**
     * Utility function to create a K:V from a list of strings
     * @param o initial input array to operate by
     * @param func
     */
    export const strToEnum = <T extends string, V>(o: T[], func: (v: T) => V): { [K in T]: V } => {
        return o.reduce((res, key) => {
            res[key] = func(key)
            return res
        }, Object.create(null))
    }

    /**
     * Utility function to create a K:V from a list of strings
     * @param o initial input array to operate by
     * @param func
     */
    export const strToEnumFunc = <T extends string, V>(o: T[], func: (v: T) => V): { [K in T]: V } => {
        return o.reduce((res, key) => {
            res[key] = func(key)
            return res
        }, Object.create(null))
    }

    export const sortByNumber = <T>(items: T[], property: string, direction = 'asc'): T[] => {
        return items.slice(0).sort((a, b) => {
            const diff = a[property] - b[property]
            return diff * (direction === 'desc' ? -1 : 1)
        })
    }

    export const filterBy = (property: PropertyKey): Consumer<any> => {
        const set = new Set()
        return obj => !(set.has(obj[property]) || !set.add(obj[property]))
    }

    export const sortByString = <T>(items: T[], property: string, direction = 'asc'): T[] => {
        return items
            .slice(0) // use `slice(0)` to avoid mutating the array
            .sort((a, b) => {
                const diff = a[property].localeCompare(b[property])
                return diff * (direction === 'desc' ? -1 : 1)
            })
    }

    /*
    Sort an array of projects, applying the given function to all projects.
    If the function returns `undefined` (meaning that no data is available),
    the project should be displayed at the end, when the descending direction is used (by default).
    */
    export const sortProjectsByFunction = <T>(
        projects: T[],
        func: Processor<T, number>,
        property: string,
        direction = 'desc',
    ): T[] => {
        const getValue = (project: T): number => {
            const value = func(project)
            return value === undefined ? -Infinity : value
        }

        return projects.slice(0).sort((a, b) => {
            let diff = getValue(a) - getValue(b)
            if (diff === 0) {
                diff = a[property] - b[property]
            }

            return diff * (direction === 'desc' ? -1 : 1)
        })
    }

    export const groupBy = <T, K extends PropertyKey>(list: T[], getKey: (item: T) => K): Record<K, T[]> => {
        return list.reduce((previous, currentItem) => {
            const group = getKey(currentItem)
            if (!previous[group]) {
                previous[group] = []
            }
            previous[group].push(currentItem)

            return previous
        }, {} as Record<K, T[]>)
    }

    export const average = (array: number[]): number => array.reduce((p, c) => p + c, 0) / array.length

    export const makeArray = <T>(value: T): T[] => (Array.isArray(value) ? value : [value])

    export const makeArray2 = <T>(array: any): T[] => {
        // Array.from(arrayLike);
        return Array.prototype.slice.call(array)
    }

    export const eliminateDuplicates = <T>(items: T[]): T[] => {
        return [...new Set(items)]
    }

    export const randWeightedArray = (numbers: number[]): number[] => {
        if (!isArray(numbers)) {
            throw typeError(`incorrect input argument: {numbers} is not array < ${numbers} >`)
        }

        let total = 0
        const dist = Helpers.getEmptyNumberVector()

        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const index in numbers) {
            if (numbers.hasOwnProperty(index)) {
                total += numbers[index]
                dist[index] = total
            }
        }

        const result: number[] = []
        const rand = randInt(0, total)

        for (const index of dist) {
            if (Object.prototype.hasOwnProperty.call(dist, index)) {
                if (rand < dist[index]) {
                    result.push(Number(index))
                }
            }
        }

        return result
    }

    export const copyOfArray = (array: any[]): any[] => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array < ${array} >`)
        }

        const res: any[] = []
        for (const item of array) {
            isArray(item) ? res.push(item.slice(0)) : res.push(item)
        }

        return res
    }

    export const createAndFillArray = (start: number, end: number, func): any[] => {
        if (isNull(start) || isNull(end) || !isFunction(func)) {
            throw valueError(
                `incorrect input values: start < ${start} >, end < ${end} >, function of elements < ${func} >`,
            )
        }

        const res: any[] = []
        for (let i = start; i < end; i = func(i)) {
            res.push(i)
        }

        return res
    }

    export const pluck = <T>(prop: PropertyKey, ...values: T[]): T[] => {
        const res: T[] = []

        for (let i = 0, member; (member = values[i]); i++) {
            res.push(member[prop] || member)
        }

        return res
    }

    export const unsortedRemoveDuplicates = <T>(comparator: Comparator<T>, ...values: T[]): T[] => {
        const copy = [...values]
        if (comparator) {
            for (let i = 0; i < copy.length; i++) {
                const src = copy[i]
                for (let j = i + 1; j < copy.length; j++) {
                    if (comparator(copy[j], src) === 0) {
                        copy.splice(j, 1)
                    }
                }
            }
        } else {
            for (let i = 0; i < copy.length; i++) {
                const src = copy[i]
                for (let j = i + 1; j < copy.length; j++) {
                    if (copy[j] === src) {
                        copy.splice(j--, 1)
                    }
                }
            }
        }

        return copy
    }

    export const unsortedIntersect = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        if (!array1 || !array2) {
            return unsortedRemoveDuplicates(comparator)
        }

        const len2 = array2.length
        array1 = unsortedRemoveDuplicates(comparator, ...array1)

        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0; j < len2; j++) {
                    if (comparator(array2[j], src) === 0) break
                }
                if (i === len2) {
                    array1.splice(i--, 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0; j < len2; j++) {
                    if (array2[j] === src) break
                }
                if (i === len2) {
                    array2.splice(i--, 1)
                }
            }
        }

        return array2
    }

    export const unsortedExclusion = <T>(comparator: Comparator<T>, ...array: T[]): T[] => {
        const copy: T[] = unsortedRemoveDuplicates(comparator, ...array)

        if (!array) {
            return copy
        }

        const left = unsortedSubtract(comparator, copy, array)
        const right = unsortedSubtract(comparator, array, copy)

        return left.concat(right).sort(comparator)
    }

    export const unsortedSubtract = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = unsortedRemoveDuplicates(comparator, ...array1)
        if (!array2) {
            return array1
        }

        array2 = unsortedRemoveDuplicates(comparator, ...array2)
        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0, len = array2.length; j < len; j++) {
                    if (comparator(array2[j], src) === 0) {
                        array1.splice(i--, 1)
                        break
                    }
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0, len = array2.length; j < len; j++) {
                    if (array2[j] === src) {
                        array1.splice(i--, 1)
                        break
                    }
                }
            }
        }

        return array1
    }

    export const unsortedUnion = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        return unsortedRemoveDuplicates(comparator, ...[...array1, ...array2])
    }

    export const exclusion = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = removeDuplicates(comparator, array1, array2)
        if (!array2) {
            return array1
        }

        const left = subtract(comparator, array1, array2)
        const right = subtract(comparator, array2, array1)

        return left.concat(right).sort(comparator)
    }

    export const removeDuplicates = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = array1.concat(array2).sort(comparator)
        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = i + 1; j < array1.length && comparator(array1[j], src) === 0; j++) {
                    // empty
                }
                if (i - 1 > i) {
                    array1.splice(i + 1, i - i - 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = i + 1; j < array1.length && array1[j] === src; j++) {
                    // empty
                }
                if (i - 1 > i) {
                    array1.splice(i + 1, i - i - 1)
                }
            }
        }

        return array2
    }

    export const intersect = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = unsortedRemoveDuplicates(comparator, ...array1)
        if (!array2) {
            return array1
        }

        array2 = unsortedRemoveDuplicates(comparator, ...array2)
        let len2 = array2.length

        if (len2 < array1.length) {
            const c = array2
            array2 = array1
            array1 = c
            len2 = array2.length
        }
        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && comparator((src2 = array2[j]), src) !== 1; j++)
                    if (comparator(src, src2) === 0) {
                        found = true
                        break
                    }
                if (!found) {
                    array1.splice(i--, 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && src >= (src2 = array2[j]); j++)
                    if (src2 === src) {
                        found = true
                        break
                    }
                if (!found) {
                    array1.splice(i--, 1)
                }
            }
        }

        return array1
    }

    export const union = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        const array = array1.concat(array2)
        return unsortedRemoveDuplicates(comparator, ...array)
    }

    export const subtract = <T>(compareFunction: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = unsortedRemoveDuplicates(compareFunction, ...array1)
        if (!array2) {
            return array1
        }

        array2 = unsortedRemoveDuplicates(compareFunction, ...array2)
        const len2 = array2.length

        if (compareFunction) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && compareFunction((src2 = array2[j]), src) !== 1; j++)
                    if (compareFunction(src, src2) === 0) {
                        found = true
                        break
                    }
                if (found) {
                    array1.splice(i--, 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && src >= (src2 = array2[j]); j++)
                    if (src2 === src) {
                        found = true
                        break
                    }
                if (found) {
                    array1.splice(i--, 1)
                }
            }
        }

        return array1
    }

    export const findArray = (array: number[], subArray: number[]): number => {
        const arrayLen = array.length
        const subArrayLen = subArray.length

        if (0 === arrayLen || 0 === subArrayLen || subArrayLen > arrayLen) {
            return -1
        }

        const len = arrayLen - subArrayLen
        let index = -1
        let flag = false

        const isSubArrayExists = (array: number[], subArray: number[], index: number): boolean => {
            if (subArray[0] === array[index]) {
                for (let j = 1; j < subArray.length; j++) {
                    if (subArray[j] !== array[index + j]) {
                        return false
                    }
                }
                return true
            }
            return false
        }

        for (let i = 0; i <= len; i++) {
            flag = isSubArrayExists(array, subArray, i)
            if (flag) {
                if (len - i < subArrayLen) {
                    return i
                } else {
                    index = i
                }
            }
        }
        return index
    }

    export const trueForAll = <T>(predicate: Predicate<T>, ...array: T[]): boolean => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array # 1 < ${array} >`)
        }

        predicate = lambda(predicate)
        checkType(predicate, 'function')

        for (let i = 0, _len = array.length; i < _len; i++) {
            if (!predicate(array[i])) {
                return false
            }
        }

        return true
    }

    export const removeAt = <T>(index: number, array: T[]): void => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array # 1 < ${array} >`)
        }

        isInRange(index, 0, array.length)

        let _i = index
        const _len = --array.length
        for (; _i < _len; _i++) {
            array[_i] = array[_i + 1]
        }

        delete array[_len]
    }

    /**
     * Inserts an element into the List at the specified index.
     * @param {Number} index The zero-based index at which item should be inserted.
     * @param {Object} item The object to insert.
     * @param array
     */
    export const insert = (index: number, item: any, array: any[]): any[] => {
        checkArray(array)

        if (index !== array.length) {
            isInRange(index, 0, array.length)
        }

        let _len = ++array.length

        while (_len-- > index) {
            array[_len] = array[_len - 1]
        }

        array[index] = item

        return array
    }

    export const search = (arr: any[], num: number, lowest: boolean): number => {
        let start = 0
        let end = arr.length - 1

        while (start <= end) {
            let middle = Math.floor((start + end) / 2)

            if (arr[middle].q.length === num) {
                if (lowest) {
                    while (arr[middle - 1] && arr[middle].q.length === arr[middle - 1].q.length) middle--
                } else {
                    while (arr[middle + 1] && arr[middle].q.length === arr[middle + 1].q.length) middle++
                }

                return middle
            } else if (arr[middle].q.length < num) {
                start = middle + 1
            } else {
                end = middle - 1
            }
        }

        throw new Error('The provided min/max length is out of boundaries.')
    }

    export const flatten = (...args: any[]): any[] => {
        return args.reduce((a, b) => a.concat(b))
    }

    // Алгоритм Фишера-Йетса — отличный пример, он не только несмещенный, но и выполняется
    // за линейное время, использует константную память и легок в реализации.
    export const shuffle2 = (array: any[]): any[] => {
        let n = array.length
        let t, i
        while (n) {
            i = (Math.random() * n--) | 0
            t = array[n]
            array[n] = array[i]
            array[i] = t
        }

        return array
    }

    // Random shuffle an array.
    // https://stackoverflow.com/a/2450976/1413259
    // https://github.com/coolaj86/knuth-shuffle
    export const shuffle3 = (arr: any[]): any[] => {
        let i = arr.length,
            t,
            j
        while (0 !== i) {
            j = Math.floor(Math.random() * i)
            i -= 1
            t = arr[i]
            arr[i] = arr[j]
            arr[j] = t
        }

        return arr
    }

    export const removeValues = (data: any[], ...args: any[]): any[] => {
        for (let i = 0, n = data.length; i < n; i++) {
            for (let j = 0, n = args.length; i < n; i++) {
                if (data[i] === args[j]) {
                    data.splice(i, 1)
                }
            }
        }

        return data
    }

    export const arrayShuffle = (array: any[]): any[] => {
        checkArray(array)

        for (let i = 0; i < array.length; i++) {
            // const l = Math.floor(Math.random() * i + 1);
            const l = Math.floor(Math.random() * array.length)
            Sorting.swap(array, l, i)
        }

        return array
    }

    export const toArray = (arr: any[], from = 0): any[] => {
        return Array.prototype.slice.call(arr, from)
    }

    /**
     * https://jsperf.com/comparison-object-index-type
     * @param {number} count
     * @returns {Object|Array<Object>}
     */
    export const createObjectArray = (count: number): any[] => {
        const array = new Array(count)
        for (let i = 0; i < count; i++) {
            array[i] = createObject()
        }

        return array
    }

    export const createObject = (): any => {
        return Object.create(null)
    }
}
