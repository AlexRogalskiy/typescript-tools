import { Numbers } from './numbers'
import { Checkers } from './checkers'
import { Errors } from './errors'

export namespace Objects {
    export const randomEnum = <T>(enumType: T): T[keyof T] => {
        const values = (Object.values(enumType) as unknown) as T[keyof T][]
        const index = Numbers.random(values.length)

        return values[index]
    }

    export const pluckBy = <T, K extends keyof T>(obj: T, propertyNames: K[]): T[K][] => {
        return propertyNames.map(n => obj[n])
    }

    export const updateBy = <T>(obj: T, fieldsToUpdate: Partial<T>): T => {
        return { ...obj, ...fieldsToUpdate }
    }

    export const omitNull = <T>(obj: T): T => {
        // eslint-disable-next-line github/array-foreach
        Object.keys(obj)
            .filter(k => obj[k] === null || obj[k] === undefined)
            .forEach(k => delete obj[k])

        return obj
    }

    export const merge = <A, B>(a: A, b: B): A & B => {
        return Object.assign({}, a, b)
    }

    export const shallowEquals = (a: any, b: any): boolean => {
        if (Object.is(a, b)) {
            return true
        }

        if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
            return false
        }

        const keysA = Object.keys(a)
        const keysB = Object.keys(b)

        if (keysA.length !== keysB.length) {
            return false
        }

        for (const key of keysA) {
            if (!b.hasOwnProperty(key) || !Object.is(a[key], b[key])) {
                return false
            }
        }

        return true
    }

    export const randWeightedObject = (nums: any): number[] => {
        if (!Checkers.isObject(nums)) {
            throw Errors.typeError(`incorrect input argument: {numbers} is not object < ${nums} >`)
        }

        let total = 0
        const dist = {}
        for (const index of nums) {
            if (nums.hasOwnProperty(index)) {
                total += nums[index]
                dist[index] = total
            }
        }

        const rand = Numbers.randInt(0, total)
        const result: number[] = []
        for (const index in dist) {
            if (dist.hasOwnProperty(index)) {
                if (rand < dist[index]) {
                    result.push(Number(index))
                }
            }
        }

        return result
    }

    export const getType = (obj: any): string => {
        return {}.toString
            .call(obj)
            .match(/\s([a-z|A-Z]+)/)[1]
            .toLowerCase()
    }

    export const classof = (obj: any): string => {
        if (obj === null) {
            return 'Null'
        }
        if (obj === undefined) {
            return 'Undefined'
        }
        return Object.prototype.toString.call(obj).slice(8, -1)
    }
}
