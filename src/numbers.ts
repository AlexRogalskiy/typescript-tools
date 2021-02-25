import { Checkers } from './checkers'
import { Exceptions } from './exceptions'

export namespace Numbers {
    import isNumber = Checkers.isNumber
    import isIntNumber = Checkers.isIntNumber
    import valueException = Exceptions.valueException
    import typeException = Exceptions.typeException

    export const random = (max: number): number => {
        return Math.floor(Math.random() * max)
    }

    export const randomBy = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    export const randomBinary = (): number => {
        return Math.round(Math.random())
    }

    export const rand = (min: number, max: number): number => {
        if (!isNumber(min)) {
            throw typeException(`incorrect input argument: {lower border} is not number < ${min} >`)
        }

        if (!isNumber(max)) {
            throw typeException(`incorrect input argument: {upper border} is not number < ${max} >`)
        }

        if (min > max) {
            min = [max, (max = min)][0]
        }

        return min + Math.random() * (max - min)
    }

    export const randInt = (min: number, max: number): number => {
        if (!isIntNumber(min)) {
            throw typeException(`incorrect input argument: {lower border} is not integer number < ${min} >`)
        }

        if (!isIntNumber(max)) {
            throw typeException(`incorrect input argument: {upper border} is not integer number < ${max} >`)
        }

        if (min > max) {
            min = [max, (max = min)][0]
        }

        return Math.floor(min + Math.random() * (max - min))
    }

    export const randUnevenInt = (min: number, max: number): number => {
        if (!isIntNumber(min)) {
            throw typeException(`incorrect input argument: {lower border} is not integer number < ${min} >`)
        }

        if (!isIntNumber(max)) {
            throw typeException(`incorrect input argument: {upper border} is not integer number < ${max} >`)
        }

        if (min > max) {
            min = [max, (max = min)][0]
        }

        return Math.round(min + Math.random() * (max - min))
    }

    export const randBigInt = (): number => {
        return parseInt(String(Number.MAX_VALUE * Math.random()))
    }

    export const randomNum = <T>(array: T[], n: number): T[] => {
        const limit = array.length < n ? array.length : n
        const randomIndicesSet = new Set<number>()

        while (randomIndicesSet.size < limit) {
            const rand = random(array.length)
            if (!randomIndicesSet.has(rand)) {
                randomIndicesSet.add(rand)
            }
        }

        return Array.from(randomIndicesSet).map(random => {
            return array[random]
        })
    }

    export const average = (delta: number, numberOfDays: number): number | undefined => {
        if (delta === undefined) {
            return undefined
        }

        return round(delta / numberOfDays)
    }

    export const round = (number: number, decimals = 1): number => {
        const i = Math.pow(10, decimals)

        return Math.round(number * i) / i
    }

    export const orderBy = <T>(items: T[], func: (value) => number): T[] => {
        return items.sort((a, b) => func(b) - func(a))
    }

    export const getSign = (value: number): string => {
        if (value === 0) return ''

        //return (value >> 31) | ((-value) >>> 31);
        // return flip((a >> 31) & 0x1);
        return value > 0 ? '+' : '-'
    }

    export const signsMatch = (x: number, y: number): boolean => {
        return !((x ^ y) < 0)
    }

    export const f1 = (x: number, y: number, z: number): number => {
        return x ^ y ^ z
    }

    export const f2 = (x: number, y: number, z: number): number => {
        return (x & y) | (~x & z)
    }

    export const f3 = (x: number, y: number, z: number): number => {
        return (x | ~y) ^ z
    }

    export const f4 = (x: number, y: number, z: number): number => {
        return (x & z) | (y & ~z)
    }

    export const rotl = (x: number, n: number): number => {
        return (x << n) | (x >>> (32 - n))
    }

    export const isFloat = (n: any): boolean => {
        return typeof n === 'number' && n % 1 !== 0
    }

    export const isInteger = (n: number): boolean => {
        return n === (n | 0)
    }

    export const toUint32 = (value: any): number => {
        return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32)
    }

    export const toFixed = (number: number, fractionDigits: number): number => {
        return parseFloat(Number(number).toFixed(fractionDigits))
    }

    export const dec2bin = (dec: number, length: number): string => {
        if (!isIntNumber(dec) || !isIntNumber(length)) {
            throw valueException(`incorrect input values: decimal < ${dec} >, output length < ${length} >`)
        }

        let out = ''
        while (length--) {
            out += (dec >> length) & 1
        }

        return out
    }

    export const is32Bit = (value: string): boolean => {
        const code = value.codePointAt(0)

        return code !== undefined && code > 0xffff
    }

    export const xor = (a: boolean, b: boolean): boolean => {
        return a ? !b : b
    }

    export const compare = (a: number, b: number): number => {
        return a < b ? -1 : a > b ? 1 : 0
    }
}
