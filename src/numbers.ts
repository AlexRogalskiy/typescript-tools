import { Checkers } from './checkers'
import { Errors } from './errors'

export namespace Numbers {
    import isNumber = Checkers.isNumber
    import isIntNumber = Checkers.isIntNumber
    import valueError = Errors.valueError
    import typeError = Errors.typeError
    import isArray = Checkers.isArray

    export namespace NumberOperations {
        export const negate = (a: number): number => {
            let neg = 0
            const d = a < 0 ? 1 : -1
            while (a !== 0) {
                neg += d
                a += d
            }

            return neg
        }

        export const minus = (a: number, b: number): number => {
            if (!isIntNumber(a) || !isIntNumber(b)) {
                throw valueError(`incorrect input parameters: a < ${a} >, b < ${b} >`)
            }

            return a + negate(b)
        }

        export const abs = (a: number): number => {
            if (a < 0) {
                return negate(a)
            }
            return a
        }

        export const multiply = (() => {
            const multiply_ = (a: number, b: number): number => {
                if (a < b) {
                    return multiply_(b, a)
                }
                let sum = 0
                for (let i = abs(b); i > 0; i--) {
                    sum += a
                }
                if (b < 0) {
                    sum = negate(sum)
                }
                return sum
            }

            return function (a: number, b: number) {
                if (!isIntNumber(a) || !isIntNumber(b)) {
                    throw valueError(`incorrect input parameters: a < ${a} >, b < ${b} >`)
                }

                return multiply_(a, b)
            }
        })()

        export const divide = (a: number, b: number): number => {
            if (!isIntNumber(a) || !isIntNumber(b)) {
                throw valueError(`incorrect input parameters: a < ${a} >, b < ${b} >`)
            }

            if (b === 0) {
                throw valueError('Division by zero')
            }

            const absa = abs(a)
            const absb = abs(b)

            let product = 0
            let x = 0
            while (product + absb <= absa) {
                product += absb
                x++
            }

            if ((a < 0 && b < 0) || (a > 0 && b > 0)) {
                return x
            }

            return negate(x)
        }
    }

    export const greatest = (a: number, b: number, c: number): number => {
        return a > b ? (a > c ? a : c) : b > c ? b : c
    }

    export const isSimpleNumber = (num: number): boolean => {
        if (!isIntNumber(num) || num < 0) {
            throw valueError(`incorrect input parameter: number < ${num} >`)
        }

        let m = 0
        const n = Math.sqrt(num) + 1
        for (let j = 2; j < n; j++) {
            if (num % j === 0) {
                m++
            }
        }

        return m === 0
    }

    export const getRandPrime = (): number => {
        const isPrime = (n: number): boolean => {
            let d = Math.ceil(Math.sqrt(n))
            while (n % d-- && d) {
                // empty
            }

            return !d
        }

        let n
        while (((n = Math.round(Math.random() * 1_000_000_000)), !isPrime(n))) {
            // empty
        }
        return n
    }

    export const getDiv3Xor7 = (n: number, m: number): number => {
        if (!isIntNumber(n) || !isIntNumber(m) || n <= 0 || m <= 0 || n >= m) {
            throw valueError(`incorrect input parameters: lower border < ${n} >, upper border < ${m} >`)
        }

        return Math.abs(
            Math.floor(n / 7) +
                Math.floor(n / 3) -
                2 * Math.floor(n / 21) -
                Math.floor((m - 1) / 7) -
                Math.floor((m - 1) / 3) +
                2 * Math.floor((m - 1) / 21),
        )
    }

    export const isSuperSimpleNumber = (num: number): boolean => {
        if (isSimpleNumber(num)) {
            while (num) {
                num = Math.floor(num / 10)
            }
            return isSimpleNumber(num)
        }
        return false
    }

    export const isPerfectNumber = (num: number): boolean => {
        if (!isIntNumber(num) || num < 0) {
            throw valueError(`incorrect input parameter: number < ${num} >`)
        }

        let m = 0
        for (let j = 1; j < num; j++) {
            if (num % j === 0) {
                m += j
            }
        }

        return num === m
    }

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
            throw typeError(`incorrect input argument: {lower border} is not number < ${min} >`)
        }

        if (!isNumber(max)) {
            throw typeError(`incorrect input argument: {upper border} is not number < ${max} >`)
        }

        if (min > max) {
            min = [max, (max = min)][0]
        }

        return min + Math.random() * (max - min)
    }

    export const randInt = (min: number, max: number): number => {
        if (!isIntNumber(min)) {
            throw typeError(`incorrect input argument: {lower border} is not integer number < ${min} >`)
        }

        if (!isIntNumber(max)) {
            throw typeError(`incorrect input argument: {upper border} is not integer number < ${max} >`)
        }

        if (min > max) {
            min = [max, (max = min)][0]
        }

        return Math.floor(min + Math.random() * (max - min))
    }

    export const randUnevenInt = (min: number, max: number): number => {
        if (!isIntNumber(min)) {
            throw typeError(`incorrect input argument: {lower border} is not integer number < ${min} >`)
        }

        if (!isIntNumber(max)) {
            throw typeError(`incorrect input argument: {upper border} is not integer number < ${max} >`)
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

    export const multiply = (a: number, b: number): number => {
        let c = 0
        while (0 !== b) {
            if ((b & 1) !== 0) {
                c += a
            }
            a <<= 1
            b >>= 1
        }
        return c
    }

    export const add = (a: number, b: number): number => {
        if (0 === b) {
            return a
        }
        while (0 !== a) {
            let c = b & a
            b = b ^ a
            c <<= 1
            a = c
        }

        return b
    }

    export const findKthSmallest = (k: number, arr1: number[], arr2: number[]): number | null => {
        if (!isArray(arr1)) {
            throw valueError(`incorrect input value: array # 1 < ${arr1} >`)
        }

        if (!isArray(arr2)) {
            throw valueError(`incorrect input value: array # 2 < ${arr2} >`)
        }

        if (arr1.length === 0 && arr2.length === 0) {
            throw valueError(`incorrect input values: array # 1 < ${arr1} > and array # 2 < ${arr2} >`)
        }

        if (arr1.length === 0) {
            return arr2[k - 1]
        } else if (arr2.length === 0) {
            return arr1[k - 1]
        }

        const lastA = arr1[arr1.length - 1]
        if (arr1.length + arr2.length === k) {
            return Math.max(lastA, arr2[arr2.length - 1])
        } else if (arr1.length <= k && arr2[k - arr1.length] >= lastA) {
            return lastA
        }

        let start = 0,
            end = Math.min(arr1.length - 1, k)
        let k1, k2

        while (start <= end) {
            k1 = Math.floor(start + end) / 2
            k2 = k - k1
            if (k2 > arr2.length) {
                start = k1 + 1
            } else if (k1 === 0) {
                if (arr1[k1] >= arr2[k2 - 1]) {
                    return arr2[k2 - 1]
                } else {
                    start = k1 + 1
                }
            } else if (k2 === 0) {
                if (arr2[k2] >= arr1[k1 - 1]) {
                    return arr1[k1 - 1]
                } else {
                    end = k1 - 1
                }
            } else if (k2 === arr2.length) {
                if (arr1[k1] >= arr2[k2 - 1]) {
                    return Math.max(arr1[k1 - 1], arr2[k2 - 1])
                } else if (arr1[k1] < arr2[k2 - 1]) {
                    start = k1 + 1
                } else {
                    end = k1 - 1
                }
            }
        }

        return null
    }

    export const numberOf2sInRange = (n: number): number => {
        const numberOf2s = (n): number => {
            let count = 0
            while (n > 0) {
                if (n % 10 === 2) {
                    count++
                }
                n = Math.floor(n / 10)
            }
            return count
        }

        let count = 0
        for (let i = 2; i <= n; i++) {
            count += numberOf2s(i)
        }

        return count
    }

    export const countLeadingZeros = (value: any): number => {
        if (!isNumber(value)) {
            throw valueError(`Invalid number value=${value}`)
        }

        if (0 === value) {
            return 32
        }

        let n = 0
        if ((value & 0xffff0000) === 0) {
            n += 16
            value <<= 16
        }
        if ((value & 0xff000000) === 0) {
            n += 8
            value <<= 8
        }
        if ((value & 0xf0000000) === 0) {
            n += 4
            value <<= 4
        }
        if ((value & 0xc0000000) === 0) {
            n += 2
            value <<= 2
        }
        if ((value & 0x80000000) === 0) {
            n += 1
        }

        return n
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

    export const toUint32 = (value: any): number => {
        return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32)
    }

    export const toFixed = (number: number, fractionDigits: number): number => {
        return parseFloat(Number(number).toFixed(fractionDigits))
    }

    export const getPrime = (min: number): number => {
        const _primes = [17, 67, 257, 1031, 4099, 16411, 65537, 262147, 1048583, 4194319, 16777259]

        for (let i = 0, _len = _primes.length; i < _len; i++) {
            if (_primes[i] > min) {
                return _primes[i]
            }
        }

        return _primes[_primes.length - 1]
    }

    export const dec2bin = (dec: number, length: number): string => {
        if (!isIntNumber(dec) || !isIntNumber(length)) {
            throw valueError(`incorrect input values: decimal < ${dec} >, output length < ${length} >`)
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
