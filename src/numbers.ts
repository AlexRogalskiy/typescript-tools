export namespace Numbers {
    export const random = (max: number): number => {
        return Math.floor(Math.random() * max)
    }

    export const average = (delta: number, numberOfDays: number): number | undefined => {
        if (delta === undefined) return undefined

        return round(delta / numberOfDays)
    }

    export const round = (number: number, decimals = 1): number => {
        const i = Math.pow(10, decimals)

        return Math.round(number * i) / i
    }

    export const orderBy = <T>(items: T[], fn): T[] => {
        return items.sort((a, b) => fn(b) - fn(a))
    }

    export const getSign = (value: number): string => {
        if (value === 0) return ''

        //return (value >> 31) | ((-value) >>> 31);
        return value > 0 ? '+' : '-'
    }

    export const signsMatch = (x: number, y: number): boolean => {
        return !((x ^ y) < 0)
    }

    export const f1 = (x, y, z): number => {
        return x ^ y ^ z
    }

    export const f2 = (x, y, z): number => {
        return (x & y) | (~x & z)
    }

    export const f3 = (x, y, z): number => {
        return (x | ~y) ^ z
    }

    export const f4 = (x, y, z): number => {
        return (x & z) | (y & ~z)
    }

    export const rotl = (x, n): number => {
        return (x << n) | (x >>> (32 - n))
    }

    export const isFloat = (n): boolean => {
        return typeof n === 'number' && n % 1 !== 0
    }

    export const isInteger = (n): boolean => {
        return n === (n | 0)
    }
}
