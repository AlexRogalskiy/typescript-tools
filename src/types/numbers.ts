import { Optional } from '../../typings/standard-types'

import { Checkers, Comparators, Errors } from '../index'

export namespace Numbers {
    import isNumber = Checkers.isNumber
    import isIntNumber = Checkers.isIntNumber
    import valueError = Errors.valueError
    import typeError = Errors.typeError
    import isArray = Checkers.isArray

    export namespace NumberOperations {
        export const negate = (a: number): number => {
            let res = 0
            const d = a < 0 ? 1 : -1

            while (a !== 0) {
                res += d
                a += d
            }

            return res
        }

        export const decimalRound = (number, fractionalLength = 2): any => {
            const factor = 10 ** fractionalLength

            return Math.round(number * factor) / factor
        }

        export const percent = (x: number): string => (x * 100).toFixed(2)

        export const divide2 = (minValue: number, maxValue: number, length = 5): number[] => {
            const step = (maxValue - minValue) / (length - 1)
            const result = [minValue]

            for (let i = 1; i < length - 1; i += 1) {
                result.push(minValue + step * i)
            }

            result.push(maxValue)

            return result
        }

        export const transform = (stiffness: number, x: number): number => {
            return (1.0 - Math.exp(stiffness * -x)) / (1.0 - Math.exp(-stiffness))
        }

        /**
         * Compute the modulo of a number but makes sure to always return
         * a positive value.
         * @param {Number} number the number to computes the modulo of
         * @param {Number} modulo the modulo
         * @returns {Number} the result of the modulo of number
         */
        export const positiveModulo = (number: number, modulo: number): number => {
            let result = number % modulo

            if (result < 0) {
                result += modulo
            }

            return result
        }

        export const isInAcceptableRange = (actual: number, expected: number, threshold = 0.001): boolean => {
            return actual >= (1 - threshold) * expected && actual <= (1 + threshold) * expected
        }

        export const isInRange = (actual: number, min: number, max: number): boolean => {
            return actual >= min && actual <= max
        }

        export const humanNumber = (number: any, p = 2, placeHolder = '--'): Optional<string> => {
            if (typeof number === 'string') {
                return number
            }
            if (Number.isNaN(number) || number === null || number === undefined) {
                return placeHolder
            }
            const ds = [
                [9, 6, 3, 0],
                ['B', 'M', 'K', ''],
            ]
            const sign = number > 0 ? 1 : -1
            const absNum = Math.abs(number)
            const n = absNum.toString().split('.').shift() as string
            const digit = n.split('').length
            const pre = Number.parseInt(n, 10)
            let i = 0
            while (i <= ds[0].length) {
                const f = ds[0][i] as number
                if (digit / f > 1) {
                    const v = ((pre / Math.pow(10, f)) * sign).toFixed(p)
                    return `${v}${ds[1][i]}`
                }
                i += 1
            }

            return null
        }

        /**
         * Converts a number from a current scale to a 0 - 1 scale.
         *
         * @param {Number} value number to scale by
         * @param {Number} start low point of scale to convert from
         * @param {Number} end high point of scale to convert from
         * @example
         * (5).fromScale(0, 10) //=> 0.5
         * @return {Number} the scaled value
         */
        export const fromScale = (value: number, start: number, end: number): number => {
            const val = (value - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end))

            if (val > 1) {
                return 1
            }

            if (val < 0) {
                return 0
            }

            return val
        }

        /**
         * Converts a number from a 0 - 1 scale to the specified scale.
         *
         * @param {Number} value number to scale by
         * @param {Number} start low point of scale to convert to
         * @param {Number} end high point of scale to convert to
         * @example
         * (0.5).toScale(0, 10) //=> 5
         * @return {Number} the scaled value
         */
        export const toScale = (value: number, start: number, end: number): number => {
            const i = value * (Math.max(start, end) - Math.min(start, end)) + Math.min(start, end)

            if (i < start) {
                return start
            }

            if (i > end) {
                return end
            }

            return i
        }

        /** @param {number[]} values */
        export const max = (values: number[]): number =>
            values.length ? values.reduce((m, v) => (m > v ? m : v), Number.MIN_SAFE_INTEGER) : 0

        /** @param {number[]} values */
        export const min = (values: number[]): number =>
            values.length ? values.reduce((m, v) => (m < v ? m : v), Number.MAX_SAFE_INTEGER) : 0

        /** @param {number[]} values */
        export const product = (values: number[]): number => values.reduce((p, v) => p * v, 1)

        /** @param {number[]} values */
        export const sum = (values: number[]): number => values.reduce((s, v) => s + v, 0)

        /** @param {number[]} values */
        export const standardDerivation = (values: number[]): number => {
            const len = values.length
            const avg = sum(values) / len
            const variance = values.reduce((total, curr) => total + (curr - avg) ** 2, 0)
            return Math.sqrt(variance / (len - 1))
        }

        export const binomialCoefficient = (n: number, k: number): number => {
            if (Number.isNaN(n) || Number.isNaN(k)) return NaN

            if (k < 0 || k > n) return 0
            if (k === 0 || k === n) return 1
            if (k === 1 || k === n - 1) return n

            if (n - k < k) k = n - k
            let res = n
            for (let j = 2; j <= k; j++) res *= (n - j + 1) / j

            return Math.round(res)
        }

        // averageBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], o => o.n); // 5
        // averageBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 5
        export const averageBy = (arr: any, fn: any): number =>
            arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => acc + val, 0) /
            arr.length

        export const average = (...nums: number[]): number =>
            nums.reduce((acc, val) => acc + val, 0) / nums.length

        export const degreesToRads = (deg: number): number => (deg * Math.PI) / 180.0

        export const factorial = (n: number): number => {
            if (n < 0) {
                ;(() => {
                    throw new TypeError('Negative numbers are not allowed!')
                })()
            }

            return n <= 1 ? 1 : n * factorial(n - 1)
        }

        export const formatNumber = (num: number): string => num.toLocaleString()

        export const fibonacci = (n: number): number[] =>
            Array.from<number>({ length: n }).reduce(
                (acc: number[], _, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
                [],
            )

        // hammingDistance(2, 3); // 1
        export const hammingDistance = (num1: number, num2: number): number =>
            ((num1 ^ num2).toString(2).match(/1/g) || '').length

        export const inRange = (n: number, start: number, end?: number): boolean => {
            if (end && start > end) [end, start] = [start, end]

            return end == null ? n >= 0 && n < start : n >= start && n < end
        }

        // for (let i of rangeGenerator(6, 10)) console.log(i);
        // Logs 6, 7, 8, 9
        export function* rangeGenerator(start: number, end: number, step = 1): any {
            let i = start
            while (i < end) {
                yield i
                i += step
            }
        }

        // randomNumberInRange(2, 10); // 6.0211363285087005
        export const randomNumberInRange = (min: number, max: number): number =>
            Math.random() * (max - min) + min

        // randomIntegerInRange(0, 5); // 2
        export const randomIntegerInRange = (min: number, max: number): number =>
            Math.floor(Math.random() * (max - min + 1)) + min

        export const randomBoolean = (): boolean => Math.random() >= 0.5

        export const fibonacci2 = (n: number): number[] =>
            [...Array(n)].reduce((acc, _, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i), [])

        export const approxEqual = (n1: number, n2: number, epsilon = 0.0001): boolean =>
            Math.abs(n1 - n2) < epsilon

        // radsToDegrees(Math.PI / 2); // 90
        export const radsToDegrees = (rad: number): number => (rad * 180.0) / Math.PI

        // round(1.005, 2); // 1.01
        export const round = (n: number, decimals = 0): number =>
            Number(`${Math.round(parseFloat(`${n}e${decimals}`))}e-${decimals}`)

        // standardDeviation([10, 2, 38, 23, 38, 23, 21]); // 13.284434142114991 (sample)
        // standardDeviation([10, 2, 38, 23, 38, 23, 21], true);
        // 12.29899614287479 (population)
        export const standardDeviation = (arr: any[], usePopulation = false): number => {
            const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length

            return Math.sqrt(
                arr
                    .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
                    .reduce((acc, val) => acc + val, 0) /
                    (arr.length - (usePopulation ? 0 : 1)),
            )
        }

        export const toFloatFixed = (num: number, fractionDigits: number): number => {
            const leverage: number = 10 ** fractionDigits

            return Math.round(num * leverage) / leverage
        }

        export const daysToSeconds = (days: number): number => {
            const secondsInDay: number = 24 * 60 * 60

            return days * secondsInDay
        }

        // reverseNumber(981); // 189
        // reverseNumber(-500); // -5
        // reverseNumber(73.6); // 6.37
        // reverseNumber(-5.23); // -32.5
        export const reverseNumber = (n: number): number =>
            parseFloat(`${n}`.split('').reverse().join('')) * Math.sign(n)

        // primes(10); // [2, 3, 5, 7]
        export const primes = (num: number): number[] => {
            let arr = Array.from({ length: num - 1 }).map((_, i) => i + 2)
            const sqroot = Math.floor(Math.sqrt(num))
            const numsTillSqroot = Array.from({ length: sqroot - 1 }).map((_, i) => i + 2)

            for (const x of numsTillSqroot) {
                arr = arr.filter(y => y % x !== 0 || y === x)
            }

            return arr
        }

        // toSafeInteger('3.2'); // 3
        // toSafeInteger(Infinity); // 9007199254740991
        export const toSafeInteger = (num: number): number =>
            Math.round(Math.max(Math.min(num, Number.MAX_SAFE_INTEGER), Number.MIN_SAFE_INTEGER))

        // weightedAverage([1, 2, 3], [0.6, 0.2, 0.3]); // 1.72727
        export const weightedAverage = (nums: number[], weights: number[]): number => {
            const [sum, weightSum] = weights.reduce(
                (acc, w, i) => {
                    acc[0] = acc[0] + nums[i] * w
                    acc[1] = acc[1] + w
                    return acc
                },
                [0, 0],
            )

            return sum / weightSum
        }

        // toRomanNumeral(3); // 'III'
        // toRomanNumeral(11); // 'XI'
        // toRomanNumeral(1998); // 'MCMXCVIII'
        export const toRomanNumeral = (num: number): string => {
            const lookup: [string, number][] = [
                ['M', 1000],
                ['CM', 900],
                ['D', 500],
                ['CD', 400],
                ['C', 100],
                ['XC', 90],
                ['L', 50],
                ['XL', 40],
                ['X', 10],
                ['IX', 9],
                ['V', 5],
                ['IV', 4],
                ['I', 1],
            ]

            return lookup.reduce((acc, [k, v]) => {
                acc += k.repeat(Math.floor(num / v))
                num = num % v
                return acc
            }, '')
        }

        // toOrdinalSuffix('123'); // '123rd'
        export const toOrdinalSuffix = (num: string): string => {
            const int = parseInt(num),
                digits = [int % 10, int % 100],
                ordinals = ['st', 'nd', 'rd', 'th'],
                oPattern = [1, 2, 3, 4],
                tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19]

            return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
                ? int + ordinals[digits[0] - 1]
                : int + ordinals[3]
        }

        // toDecimalMark(12305030388.9087); // '12,305,030,388.909'
        export const toDecimalMark = (num: number): string => num.toLocaleString('en-US')

        // sumPower(10); // 385
        // sumPower(10, 3); // 3025
        // sumPower(10, 3, 5); // 2925
        export const sumPower = (end: number, power = 2, start = 1): number =>
            Array(end + 1 - start)
                .fill(0)
                .map((_, i) => (i + start) ** power)
                .reduce((a, b) => a + b, 0)

        export const sumN = (n: number): number => (n * (n + 1)) / 2

        // primeFactors(147); // [3, 7, 7]
        export const primeFactors = (n: number): number[] => {
            const a: number[] = []
            let f = 2

            while (n > 1) {
                if (n % f === 0) {
                    a.push(f)
                    n /= f
                } else {
                    f++
                }
            }

            return a
        }

        export const milesToKm = (miles: number): number => miles * 1.609344

        // nthRoot(32, 5); // 2
        export const nthRoot = (x: number, n: number): number => Math.pow(x, 1 / n)

        // midpoint([2, 2], [4, 4]); // [3, 3]
        // midpoint([4, 4], [6, 6]); // [5, 5]
        // midpoint([1, 3], [2, 4]); // [1.5, 3.5]
        export const midpoint = ([x1, y1]: number[], [x2, y2]: number[]): number[] => [
            (x1 + x2) / 2,
            (y1 + y2) / 2,
        ]

        // mapNumRange(5, 0, 10, 0, 100); // 50
        export const mapNumRange = (
            num: number,
            inMin: number,
            inMax: number,
            outMin: number,
            outMax: number,
        ): number => ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin

        // logBase(10, 10); // 1
        // logBase(100, 10); // 2
        export const logBase = (n: number, base: number): number => Math.log(n) / Math.log(base)

        // lcm(12, 7); // 84
        // lcm(...[1, 3, 4, 5]); // 60
        export const lcm = (...arr: number[]): number => {
            const gcd = (x, y): number => (!y ? x : gcd(y, x % y))
            const _lcm = (x, y): number => (x * y) / gcd(x, y)

            return [...arr].reduce((a, b) => _lcm(a, b))
        }

        export const kmToMiles = (km: number): number => km * 0.621371

        // gcd(8, 36); // 4
        // gcd(...[12, 8, 32]); // 4
        export const gcd = (...arr: any[]): any[] => {
            const _gcd = (x, y): number => (!y ? x : gcd(y, x % y))

            return [...arr].reduce((a, b) => _gcd(a, b))
        }

        export const fahrenheitToCelsius = (degrees: number): number => ((degrees - 32) * 5) / 9

        export const copySign = (x: number, y: number): number => (Math.sign(x) === Math.sign(y) ? x : -x)

        // euclideanDistance([1, 1], [2, 3]); // ~2.2361
        // euclideanDistance([1, 1, 1], [2, 3, 2]); // ~2.4495
        export const euclideanDistance = (a: number[], b: number[]): number =>
            Math.hypot(...Object.keys(a).map(k => b[k] - a[k]))

        export const distance = (x0: number, y0: number, x1: number, y1: number): number =>
            Math.hypot(x1 - x0, y1 - y0)

        export const divmod = (x: number, y: number): number[] => [Math.floor(x / y), x % y]

        // digitize(123); // [1, 2, 3]
        // digitize(-123); // [1, 2, 3]
        export const digitize = (n: number): number[] => [...`${Math.abs(n)}`].map(i => parseInt(i))

        // clampNumber(2, 3, 5); // 3
        // clampNumber(1, -1, -5); // -1
        export const clampNumber = (num: number, a: number, b: number): number =>
            Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))

        export const celsiusToFahrenheit = (degrees: number): number => 1.8 * degrees + 32

        // arithmeticProgression(5, 25); // [5, 10, 15, 20, 25]
        export const arithmeticProgression = (n: number, lim: number): number[] =>
            Array.from({ length: Math.ceil(lim / n) }, (_, i) => (i + 1) * n)

        // approximatelyEqual(Math.PI / 2.0, 1.5708); // true
        export const approximatelyEqual = (v1: number, v2: number, epsilon = 0.001): boolean =>
            Math.abs(v1 - v2) < epsilon

        export const accumulate = (...nums: number[]): number[] =>
            nums.reduce((acc, n) => [...acc, n + +acc.slice(-1)], [])

        export const sign = (nr: number): number => (nr > 0 ? 1 : nr < 0 ? -1 : 0)

        export const trunc = (nr: number, digits: number): number =>
            Math.trunc(nr * 10 ** digits) / 10 ** digits

        export const trimLeft = (s: string, c: string): string => {
            let i = 0
            while (i < s.length && s[i] === c) {
                i++
            }

            return s.substring(i)
        }

        export const decrementHugeNumberBy1 = (n: string | number): string => {
            // make sure s is a string, as we can't do math on numbers over a certain size
            n = n.toString()
            const allButLast = n.substr(0, n.length - 1)
            const lastNumber = n.substr(n.length - 1)

            if (lastNumber === '0') {
                return `${decrementHugeNumberBy1(allButLast)}9`
            }

            const finalResult = allButLast + (parseInt(lastNumber, 10) - 1).toString()
            return trimLeft(finalResult, '0')
        }

        export const ensureIsInRange = (val: number, min: number, max: number): number =>
            Math.min(max, Math.max(val, min))

        export const reachedEnd = (value: number, end: number, step: number): boolean =>
            step < 0 ? value < end : value > end

        /** @param {number[]} values */
        export const avg = (values: number[]): number => (values.length ? sum(values) / values.length : 0)

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

    export const median = (...values: number[]): number => {
        values.sort((a, b): number => {
            return a - b
        })

        const half = Math.floor(values.length / 2)
        if (values.length % 2) {
            return values[half]
        }

        return Math.floor((values[half - 1] + values[half]) / 2)
    }

    export const raffle = (
        rowSize: number,
        colSize: number,
    ): { row: number; colDir: string; column: number } => {
        return {
            row: Math.floor(Math.random() * rowSize),
            colDir: Math.random() < 0.5 ? 'left' : 'right',
            column: Math.floor(Math.random() * colSize),
        }
    }

    export const sortBy = <T extends string>(args: T[], comparator = Comparators.compare): T[] =>
        Array.apply(0, Array(args.length)).reduce(r => {
            return r.concat(
                args.splice(
                    args.reduce(
                        (longest, e, i) => {
                            return comparator(e.length, longest.e.length) >= 0 ? { i, e } : longest
                        },
                        { e: '', i: NaN },
                    ).i,
                    1,
                ),
            )
        }, [])

    export const findLongest = <T extends string>(...args: T[]): { index: number; value: string } => {
        return args.reduce(
            (longest, entry, index) => {
                return entry.length > longest.value.length ? { index, value: entry } : longest
            },
            { index: -1, value: '' },
        )
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
        while (((n = Math.round(Math.random() * 1000 * 1000 * 1000)), !isPrime(n))) {
            // empty
        }
        return n
    }

    export const getDiv3Xor7 = (n: number, m: number): number => {
        if (!isIntNumber(n) || !isIntNumber(m) || n <= 0 || m <= 0 || n >= m) {
            throw valueError(`incorrect input parameters: lower border < ${n} >, upper border < ${m} >`)
        }

        const left = Math.floor(n / 7) + Math.floor(n / 3) - 2 * Math.floor(n / 21)
        const right = Math.floor((m - 1) / 7) - Math.floor((m - 1) / 3) + 2 * Math.floor((m - 1) / 21)

        return Math.abs(left - right)
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

    export const randInt = (min: number, max: number, even = false): number => {
        if (!isIntNumber(min)) {
            throw typeError(`incorrect input argument: {lower border} is not integer number < ${min} >`)
        }

        if (!isIntNumber(max)) {
            throw typeError(`incorrect input argument: {upper border} is not integer number < ${max} >`)
        }

        if (min > max) {
            min = [max, (max = min)][0]
        }

        const value = min + Math.random() * (max - min)

        return even ? Math.round(value) : Math.floor(value)
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

    export const findKthSmallest = (k: number, arr1: number[], arr2: number[]): Optional<number> => {
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

    export const average = (delta: number, numberOfDays: number): Optional<number> => {
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

    /**
     * Set a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const setBit = (value: number, index: number): number => {
        return value | (1 << index)
    }

    /**
     * Clear a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const clearBit = (value: number, index: number): number => {
        return value & ~(1 << index)
    }

    /**
     * Toggle a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const toggleBit = (value: number, index: number): number => {
        return value ^ (1 << index)
    }

    /**
     * Check a bit
     * @param value initial input {@link number} value
     * @param index initial input {@link number} index
     */
    export const checkBit = (value: number, index: number): number => {
        return value & (1 << index)
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

    export const isOdd = (n: number): boolean => {
        return n % 2 !== 0
    }
}
