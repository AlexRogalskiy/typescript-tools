import { Checkers } from './checkers'
import { Exceptions } from './exceptions'
import { Supplier } from '../typings/function-types'
import { NumberOrUndef, StringOrUndef } from '../typings/standard-types'

export namespace Maths {
    import isIntNumber = Checkers.isIntNumber
    import isNumber = Checkers.isNumber
    import isString = Checkers.isString
    import isNull = Checkers.isNull
    import valueException = Exceptions.valueException
    import isFunction = Checkers.isFunction
    import isArray = Checkers.isArray
    import isRealNumber = Checkers.isRealNumber

    export type Vector2D = { x: number; y: number }
    //export type Vector3D = { x: number; y: number; z: number }

    // const sqrt = Math.sqrt
    // const atan2 = Math.atan2
    // const pow = Math.pow
    // const abs = Math.abs
    // const PiBy180 = Math.PI / 180
    // const PiBy180Inv = 180 / Math.PI
    const PiBy2 = Math.PI / 2
    const invLog2 = 1 / Math.log(2)

    export const tabX = (low: number, i: number, h: number): number => {
        return low + i * h
    }

    export const tabUnevenX = (low: number, high: number, i: number, n: number): number => {
        return (low + high + (high - low) * Math.cos(((2 * i + 1) * Math.PI) / (2 * n))) / 2
    }

    export const memoizer = (memo, formula): ((num: number) => void) => {
        if (!isArray(memo)) {
            throw valueException(`incorrect input parameter: initial array < ${memo} >`)
        }
        if (!isFunction(formula)) {
            throw valueException(`incorrect formula function: function < ${formula} >`)
        }

        const recur = (num: number): void => {
            let result = memo[num]
            if (!isNumber(result)) {
                result = formula(recur, num)
                memo[num] = result
            }
            return result
        }

        return recur
    }

    export const sinus = (a: number, b: number, h: number, eps: number): number[] => {
        if (!isNumber(a) || !isNumber(b) || !isNumber(h) || !isNumber(eps)) {
            throw valueException(
                `incorrect input values: lower border < ${a} >, upper border < ${b} >, step < ${h} >, precision < ${eps} >`,
            )
        }

        const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
        if (precision == null) {
            throw valueException(`incorrect 'precision' value: < ${precision} >`)
        }

        const result: number[] = []

        const sinx = (x: number, eps: number): number => {
            let n = 1
            const x2 = -x * x
            let snx = x,
                xn = x
            while (Math.abs(xn) > eps) {
                n += 2.0
                xn *= x2 / n / (n - 1)
                snx += xn
            }
            return snx
        }

        for (let x = a; x <= b; x += h) {
            result.push(sinx(x, precision))
        }

        return result
    }

    export const sin2 = (x: number, n: number): number => {
        if (!isNumber(x)) {
            throw valueException(`incorrect input values: x < ${x} >`)
        }

        const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        let q = x,
            s = 0
        for (let i = 0; i < num; i++) {
            s += q
            q *= (-1 * x * x) / (2 * i) / (2 * i + 1)
        }

        return s
    }

    export const sin3 = (x: number, e: number, n: number, eps: number): number | null => {
        if (!isNumber(x) || !isRealNumber(e) || e <= 0 || e >= 1) {
            throw valueException(`incorrect input values: x < ${x} >, precision < ${e} >`)
        }

        const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
        if (num === null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
        if (precision === null) {
            throw valueException(`incorrect 'precision' value: < ${precision} >`)
        }

        let r = x,
            s = x
        let i = 1
        while (Math.abs(r) > precision && i <= num) {
            r *= (-1 * x * x) / (2 * i) / (2 * i + 1)
            s += r
            i++
        }

        return i <= n ? s : null
    }

    /**
     * Calculate the sin of an angle, avoiding returning floats for known results
     * @static
     * @param {Number} angle the angle in radians or in degree
     * @return {Number}
     */
    export const sin = (angle: number): number => {
        if (angle === 0) {
            return 0
        }
        const angleSlice = angle / PiBy2
        let sign = 1
        if (angle < 0) {
            // sin(-a) = -sin(a)
            sign = -1
        }
        if (angleSlice === 1) {
            return sign
        } else if (angleSlice === 2) {
            return 0
        } else if (angleSlice === 3) {
            return -sign
        }

        return Math.sin(angle)
    }

    /**
     * Calculate the cos of an angle, avoiding returning floats for known results
     * @param {Number} angle the angle in radians or in degree
     * @return {Number}
     */
    export const cos = (angle: number): number => {
        if (angle === 0) {
            return 1
        }
        if (angle < 0) {
            // cos(a) = cos(-a)
            angle = -angle
        }
        const angleSlice = angle / PiBy2
        if (angleSlice === 1 || angleSlice === 3) {
            return 0
        } else if (angleSlice === 2) {
            return -1
        }

        return Math.cos(angle)
    }

    export const cos2 = (x: number, e: number, n: number, eps: number): number | null => {
        if (!isNumber(x) || !isRealNumber(e) || e <= 0 || e >= 1) {
            throw valueException(`incorrect input values: x < ${x} >, precision < ${e} >`)
        }

        const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
        if (precision == null) {
            throw valueException(`incorrect 'precision' value: < ${precision} >`)
        }

        let r = 1
        let s = 1
        let i = 1
        while (Math.abs(r) > precision && i <= num) {
            r *= (-1 * x * x) / (2 * i * (2 * i - 1))
            s += r
            i++
        }

        return i <= num ? s : null
    }

    export const quarterPI = (n: number): number => {
        const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${n} >`)
        }

        let sum = 0,
            x
        for (let i = n; i > 0; i--) {
            x = 1 / (2 * i - 1)
            if (i % 2 === 0) x = -x
            sum += x
        }

        return sum
    }

    export const fibonacci = memoizer([0, 1], (recur, n) => {
        return recur(n - 1 + recur(n - 2))
    })

    export const fibonacci2 = (() => {
        const memo = [0, 1]

        const fib = (num: number): number => {
            let result = memo[num]
            if (!isNumber(result)) {
                result = fib(num - 1) + fib(num - 2)
                memo[num] = result
            }
            return result
        }

        return fib
    })()

    export const factorial = memoizer([1, 1], (recur, n) => {
        return n * recur(n - 1)
    })

    export const factorial2 = (num: number): number => {
        if (!isIntNumber(num) || num < 0) {
            throw valueException(`incorrect input parameter: factorial (n!) < ${num} >`)
        }

        let val = 1
        for (let i = num; i > 1; i--) {
            val *= i
        }

        return val
    }

    export const factorial3 = (num: number): number[] => {
        if (!isIntNumber(num) || num < 0) {
            throw valueException(`incorrect input parameters: max number < ${num} >`)
        }

        const doAllFactorials = (n: number, results: number[], level: number): number => {
            if (n > 1) {
                results[level] = n * doAllFactorials(n - 1, results, level + 1)
                return results[level]
            }
            results[level] = 1
            return 1
        }

        const results = vector(num === 0 ? 1 : num, 0)
        doAllFactorials(num, results, 0)
        return results
    }

    export const factorial4 = (() => {
        const _factorial = (n: number, p = 1): number => {
            if (n <= 1) {
                return p
            }
            const result = n * p
            return _factorial(n - 1, result)
        }

        return (n: number) => {
            return _factorial(n)
        }
    })()

    export const geron = (a: number, eps: number): number => {
        if (!isNumber(a) || a < 0) {
            throw valueException(`incorrect input value: expression < ${a} >`)
        }

        const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
        if (precision == null) {
            throw valueException(`incorrect 'precision' value: < ${precision} >`)
        }

        let rad = 1.0,
            z
        do {
            z = rad
            rad = (rad + a / rad) / 2 //rad = (rad + a / rad) >> 1;
        } while (Math.abs(z - rad) >= precision)

        return rad
    }

    export const sqrt32 = (a: number): number => {
        if (!isNumber(a) || a < 0) {
            throw valueException(`incorrect input value: expression < ${a} >`)
        }
        let c = 0x8000,
            g = 0x8000
        for (; ;) {
            if (g * g > a) {
                g ^= c
            }
            c >>= 1
            if (c === 0) {
                return g
            }
            g |= c
        }
    }

    // http://en.wikipedia.org/wiki/Hyperbolic_function
    export const sinh = (z: number, n: number): number => {
        if (!isNumber(z)) {
            throw valueException(`incorrect input value: z < ${z} >`)
        }

        let s = z,
            g = z

        const num = n == null ? 100 : isIntNumber(n) && n >= 1 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        for (let i = 1; i <= num; i++) {
            g *= (z * z) / (2 * i) / (2 * i + 1)
            s += g
        }

        return s
    }

    // http://en.wikipedia.org/wiki/Hyperbolic_function
    export const cosh = (z: number, n: number): number => {
        if (!isNumber(z)) {
            throw valueException(`incorrect input value: z < ${z} >`)
        }

        let s = 1,
            g = 1

        const num = n == null ? 100 : isIntNumber(n) && n >= 1 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        for (let i = 1; i <= num; i++) {
            g *= (z * z) / (2 * i - 1) / (2 * i)
            s += g
        }

        return s
    }

    /**
     * Rotates `vector` with `radians`
     * @param {Object} vector The vector to rotate (x and y)
     * @param {Number} radians The radians of the angle for the rotation
     * @return {Object} The new rotated point
     */
    export const rotateVector = (vector: Vector2D, radians: number): Vector2D => {
        const sinValue = sin(radians)
        const cosValue = cos(radians)

        const x = vector.x * cosValue - vector.y * sinValue
        const y = vector.x * sinValue + vector.y * cosValue

        return { x, y }
    }

    /**
     *    returns next power of two
     */
    export const nextPow2 = (value: number): number => {
        return Math.pow(2, Math.ceil(Math.log(value) * invLog2))
    }

    export const sum = (...values: number[]): number => {
        return values.reduce((previous, current) => previous + current, 0)
    }

    export const getEmptyNumberVector = (): number[] => {
        return vector<number>(0, 0)
    }

    export const getEmptyStringVector = (): string[] => {
        return vector<string>(0, '')
    }

    export const getEmptyBooleanVector = (): boolean[] => {
        return vector<boolean>(0, false)
    }

    export const vector = <T>(dimension: number, initial: T): T[] => {
        if (!isIntNumber(dimension) || dimension < 0) {
            throw valueException(`incorrect input values: array dimension < ${dimension} >`)
        }

        const arr: T[] = []
        for (let i = 0; i < dimension; i++) {
            arr[i] = initial
        }

        return arr
    }

    export const EMPTY_NUMBER_VECTOR = vector<number>(0, 0)
    export const EMPTY_STRING_VECTOR = vector<string>(0, '')
    export const EMPTY_BOOLEAN_VECTOR = vector<boolean>(0, false)

    export const matrix = <T>(rows: number, columns: number, initial: T): T[][] => {
        if (!isIntNumber(rows) || !isIntNumber(columns) || rows < 0 || columns < 0) {
            throw valueException(
                `incorrect input values: number of rows < ${rows} >, number of columns < ${columns} >`,
            )
        }

        const matrix: T[][] = []
        let arr: T[] = []
        for (let i = 0; i < rows; i++) {
            arr = []
            for (let j = 0; j < columns; j++) {
                arr[j] = initial
            }
            matrix[i] = arr
        }

        return matrix
    }

    export const rangeVector = (min: number, max: number, delta: number): number[] => {
        const res: number[] = []

        const minValue = isNumber(min) ? min : null
        if (isNull(minValue)) {
            throw valueException(`incorrect {min} value: < ${min} >`)
        }

        const maxValue = isNumber(max) ? max : null
        if (isNull(maxValue)) {
            throw valueException(`incorrect {max} value: < ${max} >`)
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (minValue > maxValue) {
            throw valueException(`incorrect range size: min < ${minValue} >, max < ${maxValue} >`)
        }

        const deltaValue = delta == null ? 1 : isNumber(delta) && delta > 0 ? delta : null
        if (isNull(deltaValue)) {
            throw valueException(`incorrect {delta} value: < ${delta} >`)
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (let i = minValue; i <= maxValue; i += delta) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res.push(i)
        }

        return res
    }

    // let seqer = serialMaker();
    // let unique = seqer.gensym();
    // document.writeln(unique);
    export const serialMaker = (prefix: StringOrUndef, seq: NumberOrUndef): { gensym: Supplier<string> } => {
        const prefixValue = prefix == null ? '' : isString(prefix) ? prefix : null
        if (isNull(prefixValue)) {
            throw valueException(`incorrect prefix value: < ${prefixValue} >`)
        }

        let seqValue = seq == null ? 0 : isNumber(seq) ? seq : null
        if (isNull(seqValue)) {
            throw valueException(`incorrect sequence value: < ${seqValue} >`)
        }

        return {
            gensym: () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return prefixValue + seqValue++
            },
        }
    }

    export const calcVectorAngle = (ux: number, uy: number, vx: number, vy: number): number => {
        const ta = Math.atan2(uy, ux)
        const tb = Math.atan2(vy, vx)

        return tb >= ta ? tb - ta : 2 * Math.PI - (ta - tb)
    }

    // let xx = getFuncMinimum(-0.3, 0.5, function(v) {
    //	return v * Math.pow(v - 1, 2) * Math.pow(v - 1, 3);
    // }, 1e-7);
    // document.writeln("let getFuncMinimum: " + xx.xmin + ' ' + xx.ymin);
    export const getFuncMinimum = (a: number, b: number, func, eps: number): { xmin; ymin } => {
        if (!isNumber(a) || !isNumber(b) || !isFunction(func)) {
            throw valueException(
                `incorrect input values: lower border < ${a} >, upper border < ${b} >, function < ${func} >`,
            )
        }

        const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
        if (precision == null) {
            throw valueException(`incorrect 'precision' value: < ${precision} >`)
        }

        let x0 = a,
            h = (b - a) / 2,
            ymin,
            xmin,
            y,
            x
        while (h >= precision) {
            ymin = Number.POSITIVE_INFINITY
            x = x0

            do {
                y = func(x)
                if (y < ymin) {
                    ymin = y
                    xmin = x
                }
                x += h
            } while (y <= ymin || x <= b)
            x0 = xmin - h
            h /= 2
        }

        return { xmin, ymin }
    }

    // let res = permutation([1, 2, 3, 4]);
    // document.writeln("permutation: " + res);
    export const permutation = (str: string[]): string[][] => {
        const permArr: string[][] = []
        const usedChars: string[] = []

        const permute = (input: string[]): void => {
            for (let i = 0; i < input.length; i++) {
                const ch: string = input.splice(i, 1)[0]
                usedChars.push(ch)
                if (input.length === 0) {
                    permArr.push(usedChars.slice())
                }
                permute(input)
                input.splice(i, 0, ch)
                usedChars.pop()
            }
        }
        if (!isArray(str)) {
            throw valueException(`incorrect input parameter: array < ${str} >`)
        }
        permute(str)

        return permArr
    }
}
