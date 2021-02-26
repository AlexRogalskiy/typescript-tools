import { Numbers } from './numbers'
import { Checkers } from './checkers'
import { Exceptions } from './exceptions'

export namespace Objects {
    import random = Numbers.random
    import isObject = Checkers.isObject
    import randInt = Numbers.randInt
    import typeException = Exceptions.typeException

    export const randomEnum = <T>(enumType: T): T[keyof T] => {
        const enumValues = (Object.values(enumType) as unknown) as T[keyof T][]
        const randomIndex = random(enumValues.length)

        return enumValues[randomIndex]
    }

    export const pluckBy = <T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] => {
        return propertyNames.map(n => o[n])
    }

    export const updateBy = <T>(todo: T, fieldsToUpdate: Partial<T>): T => {
        return { ...todo, ...fieldsToUpdate }
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

    export const randWeightedObject = (numbers: any): number[] => {
        if (!isObject(numbers)) {
            throw typeException(`incorrect input argument: {numbers} is not object < ${numbers} >`)
        }

        let total = 0
        const dist = {}
        for (const index of numbers) {
            if (numbers.hasOwnProperty(index)) {
                total += numbers[index]
                dist[index] = total
            }
        }

        const rand = randInt(0, total)
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
}
