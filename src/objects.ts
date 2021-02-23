import { Numbers } from './numbers'

export namespace Objects {
    import random = Numbers.random

    export const randomEnum = <T>(anEnum: T): T[keyof T] => {
        const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][]
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

    export const shallowEquals = (a, b): boolean => {
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
}
