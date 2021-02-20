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

    export const isBuffer = (value): boolean => {
        return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined
    }
}
