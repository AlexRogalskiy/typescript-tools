import { Numbers } from './numbers'
import { Checkers } from './checkers'
import { Exceptions } from './exceptions'
import { Maths } from './maths'

export namespace Arrays {
    import random = Numbers.random
    import isArray = Checkers.isArray
    import exception = Exceptions.exception
    import randInt = Numbers.randInt
    import getEmptyNumberVector = Maths.getEmptyNumberVector
    import isNull = Checkers.isNull
    import isFunction = Checkers.isFunction
    import typeException = Exceptions.typeException
    import valueException = Exceptions.valueException

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
    export const strToFuncEnum = <T extends string, V>(o: T[], func: (v: T) => V): { [K in T]: V } => {
        return o.reduce((res, key) => {
            res[key] = func(key)
            return res
        }, Object.create(null))
    }

    export const sortByNumber = <T>(items: T[], property: string, direction = 'asc'): T[] => {
        return items
            .slice(0) // use `slice(0)` to avoid mutating the array
            .sort((a, b) => {
                const diff = a[property] - b[property]
                return diff * (direction === 'desc' ? -1 : 1)
            })
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
        fn,
        property: string,
        direction = 'desc',
    ): T[] => {
        // console.time('Sort')
        const getValue = (project): number => {
            const value = fn(project)
            return value === undefined ? -Infinity : value
        }

        return projects
            .slice(0) // use `slice(0)` to avoid mutating the array
            .sort(function (a, b) {
                let diff = getValue(a) - getValue(b)
                if (diff === 0) {
                    diff = a[property] - b[property]
                }
                return diff * (direction === 'desc' ? -1 : 1)
            })
    }

    export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K): Record<K, T[]> => {
        return list.reduce((previous, currentItem) => {
            const group = getKey(currentItem)
            if (!previous[group]) {
                previous[group] = []
            }
            previous[group].push(currentItem)
            return previous
        }, {} as Record<K, T[]>)
    }

    export const average = (arr: number[]): number => arr.reduce((p, c) => p + c, 0) / arr.length

    export const makeArray = <T>(value: T): T[] => (Array.isArray(value) ? value : [value])

    export const makeArray2 = <T>(arrayLike: any): T[] => {
        return Array.prototype.slice.call(arrayLike)
        //Array.from(arrayLike);
    }

    export const eliminateDuplicates = <T>(items: T[]): T[] => {
        return [...new Set(items)]
    }

    export const randWeightedArray = (numbers: number[]): number[] => {
        if (!isArray(numbers)) {
            throw typeException(`incorrect input argument: {numbers} is not array < ${numbers} >`)
        }

        let total = 0
        const dist = getEmptyNumberVector()

        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const index in numbers) {
            if (numbers.hasOwnProperty(index)) {
                total += numbers[index]
                dist[index] = total
            }
        }

        const result: number[] = []
        const rand = randInt(0, total)

        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const index in dist) {
            if (dist.hasOwnProperty(index)) {
                if (rand < dist[index]) {
                    result.push(Number(index))
                }
            }
        }

        return result
    }

    export const copyOfArray = (array: any[]): any[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input value: array < ${array} >`)
        }

        const res: any[] = []
        for (const item of array) {
            isArray(item) ? res.push(item.slice(0)) : res.push(item)
        }

        //return array.slice(0)
        return res
    }

    export const createAndFillArray = (start: number, end: number, func): any[] => {
        if (isNull(start) || isNull(end) || !isFunction(func)) {
            throw valueException(
                `incorrect input values: start < ${start} >, end < ${end} >, function of elements < ${func} >`,
            )
        }
        const res: any[] = []
        for (let i = start; i < end; i = func(i)) {
            res.push(i)
        }

        return res
    }
}
