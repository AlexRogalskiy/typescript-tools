import { Checkers } from './checkers'
import { Exceptions } from './exceptions'
import { Processor, Supplier } from '../typings/function-types'
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
    import typeException = Exceptions.typeException
    import isObject = Checkers.isObject

    export type Vector2D = { x: number; y: number }
    //export type Vector3D = { x: number; y: number; z: number }

    // const sqrt = Math.sqrt
    // const atan2 = Math.atan2
    // const pow = Math.pow
    // const abs = Math.abs
    export const PiBy180 = Math.PI / 180
    export const PiBy180Inv = 180 / Math.PI
    export const PiBy2 = Math.PI / 2
    export const invLog2 = 1 / Math.log(2)

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
        // eslint-disable-next-line no-constant-condition
        while (true) {
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

    export const exp = (value: number, n: number): number => {
        if (!isNumber(value)) {
            throw valueException(`incorrect input values:  value< ${value} >, number of iterations < ${n} >`)
        }

        const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        let s = 1,
            q = value,
            i
        for (i = 1; i <= num; i++) {
            s += q
            q = (q * value) / (i + 1)
        }

        return s
    }

    // let res1 = var fourier(1, function(x) {return x*x});
    // let res2 = var fourier(2, function(x) {return x});
    // let res3 = var fourier(-3, function(x) {return x*x + x});
    //document.writeln("res1: " + res1 + " >> res2: " + res2 + ' >> res3: ' + res3);
    export const fourier = (value: number, func: Processor<number, number>): number => {
        const N = 10000
        const n = 100
        const a = vector(n, 0)

        const intCos = (k: number, value: number): number => {
            let s = 0,
                x = -Math.PI * value
            const h = ((1 + value) * Math.PI) / N
            for (let i = 0; i < N; i++) {
                s += (func(x) * Math.cos(x * k) + func(x + h) * Math.cos((x + h) * k)) / 2
                x += h
            }
            s *= h * (2 - value)

            return s
        }

        const makeCos = (value: number): void => {
            value = value || 0
            for (let i = 0; i < n; i++) {
                a[i] = intCos(i, value) / Math.PI
            }
            a[0] /= 2
        }

        const sumCos = (value: number): number => {
            let s = 0
            for (let i = 0; i < n; i++) {
                s += a[i] * Math.cos(value * i)
            }

            return s
        }

        const b = vector(n, 0)
        const intSin = (k: number, value: number): number => {
            let s = 0,
                x = -Math.PI * value
            const h = ((1 + value) * Math.PI) / N
            for (let i = 0; i < N; i++) {
                s += (func(x) * Math.sin(x * k) + func(x + h) * Math.sin((x + h) * k)) / 2
                x += h
            }
            s *= h * (2 - value)

            return s
        }

        const makeSin = (value: number): void => {
            value = value || 0
            for (let i = 0; i < n; i++) {
                b[i] = intSin(i, value) / Math.PI
            }
            b[0] = 0
        }

        const sumSin = (value: number): number => {
            let s = 0
            for (let i = 0; i < n; i++) {
                s += b[i] * Math.sin(value * i)
            }

            return s
        }

        const makeCosSin = (value: number): void => {
            value = value || 0
            makeCos(value)
            makeSin(value)
        }

        const sumCosSin = (value: number): number => {
            return sumCos(value) + sumSin(value)
        }

        if (!isNumber(value) || !isFunction(func)) {
            throw valueException(`incorrect input values: x < ${value} >, function < ${func} >`)
        }

        if (func(-1) === func(1)) {
            makeCos(value)
            return sumCos(value)
        }

        makeCosSin(value)
        return sumCosSin(value)
    }

    // let arX = [], arY= [];
    // for(var i=0; i<9; i++) {
    //	arX.push(i);
    //	arY.push(i * (i - 9/3) * (i - 9 + 1) + 0.001 * (Math.random() % 100 - 50));
    //	document.writeln(' ' + arX[i] + ' > ' + arY[i]);
    // };
    // var res = var interpolation(9, 0.1, arX, arY);
    // document.writeln("interpolation: " + res);
    export const interpolate = (arrayX: number[], arrayY: number[], x: number, n: number): number => {
        if (!isArray(arrayX) || !isArray(arrayY) || !isNumber(x)) {
            throw valueException(
                `incorrect input values: arrayX < ${arrayX} >, arrayY < ${arrayY} >, x < ${x} >`,
            )
        }

        const psi = (i: number, z: number): number => {
            let tmp = 1
            for (let j = 0; j < i; j++) {
                tmp *= (z - arrayX[j]) / (arrayX[i] - arrayX[j])
            }
            for (let j = i + 1; j < n; j++) {
                tmp *= (z - arrayX[j]) / (arrayX[i] - arrayX[j])
            }

            return tmp
        }

        const lagr = (z: number): number => {
            let s = 0
            for (let i = 0; i < n; i++) {
                s += arrayY[i] * psi(i, z)
            }

            return s
        }

        const num = n == null ? 9 : isIntNumber(n) && n > 0 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        if (x < 0 || x > num) {
            throw valueException(`incorrect input value: x < ${x} > is out of range [0, ${num}]`)
        }

        return lagr(x)
    }

    // let res = globals.calcpolinom([1, -10, 27, -18], 0, 10);
    // document.writeln("<p>" + res + "</p>");
    // Метод Ньютона-Рафсона
    export const polinom = (array: number[], init: number, n: number): number => {
        if (!isArray(array) || !isNumber(init)) {
            throw valueException(`incorrect input values:  array < ${array} >, initial value < ${init} >`)
        }

        const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        const b: number[] = []
        let f, df
        for (let i = 0; i < array.length; i++) {
            b.push((array.length - 1 - i) * array[i])
        }

        for (let k = 0; k < num; k++) {
            f = array[array.length - 1]
            df = 0
            for (let i = 1; i < array.length; i++) {
                f += array[array.length - 1 - i] * Math.pow(init, i)
                df += b[array.length - 1 - i] * Math.pow(init, i - 1)
            }
            init -= f / df
        }

        return init
    }

    // let res = polinom2(f, 12, 20);
    // document.writeln("polinom2: " + res);
    // const f = function(x) {
    //	return x * x - 9 * x + 14;
    // };
    export const polinom2 = (func: Processor<number, number>, init: number, n: number): number => {
        if (!isNumber(init) || !isFunction(func)) {
            throw valueException(`incorrect input values:  initial value < ${init} >, function < ${func} >`)
        }

        const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        let res = init
        const h = 0.00001
        const df = (func(res + h) - func(res)) / h
        for (let i = 0; i < num; i++) {
            res = res - func(res) / df //((func(x + h) - func(x)) / h)
        }

        return res
    }

    // document.writeln("monteCarlo: " + monteCarlo(2, 5));
    export const monteCarlo = (r: number, h: number, N: number): number => {
        if (!isNumber(r) || !isNumber(h)) {
            throw valueException(`incorrect input values:  r < ${r} >, h < ${h} >`)
        }

        const num = N == null ? 150 : isIntNumber(N) && N > 0 ? N : null
        if (num == null) {
            throw valueException(`incorrect 'number of iterations' value: < ${num} >`)
        }

        let n = 0
        let x, y, z
        const v0 = 4 * r * r * (h + r)
        for (let i = 0; i <= num; i++) {
            x = (2 * i * r) / num - r
            for (let j = 0; j <= num; j++) {
                y = (2 * j * r) / num - r
                for (let k = 0; k <= num; k++) {
                    z = (k * (h + r)) / num
                    if (
                        (Math.sqrt(x * x + y * y) / r <= z / h && z <= h) ||
                        (x * x + y * y + (z - h) * (z - h) <= r * r && z > h)
                    ) {
                        n++
                    }
                }
            }
        }

        return (v0 * n) / Math.pow(N + 1, 3)
    }

    export const toRadians = (value: number): number => {
        if (!isNumber(value)) {
            throw typeException(`incorrect type of argument: degrees < ${value} >`)
        }

        return value * PiBy180
    }

    export const toDegrees = (value: number): number => {
        if (!isNumber(value)) {
            throw typeException(`incorrect type of argument: radians < ${value} >`)
        }

        return value * PiBy180Inv
    }

    // polygon = {arrayX: [-73,-33,7,-33], arrayY: [-85,-126,-85,-45]};
    // point = {x: -40, y: -60};
    export const inPolygon = (polygon: { arrayX; arrayY }, point: { x; y }): boolean => {
        if (!isObject(polygon)) {
            throw valueException(`incorrect input value: {polygon} not an object < ${polygon} >`)
        }

        if (
            !Object.prototype.hasOwnProperty.call(polygon, 'arrayX') ||
            !Object.prototype.hasOwnProperty.call(polygon, 'arrayY') ||
            !isArray(polygon['arrayX']) ||
            !isArray(polygon['arrayY'])
        ) {
            throw valueException(
                `incorrect input value: {polygon} is invalid {'arrayX': array, 'arrayY': array} < ${polygon} >`,
            )
        }

        if (polygon['arrayX'].length !== polygon['arrayY'].length) {
            throw valueException(
                `incorrect input value: {polygon} length of {arrayX} is not equal to {arrayY} in < ${polygon} >`,
            )
        }

        if (!isObject(point)) {
            throw valueException(`incorrect input values: {point} is not object < ${point} >`)
        }

        if (
            !Object.prototype.hasOwnProperty.call(point, 'x') ||
            !Object.prototype.hasOwnProperty.call(point, 'y') ||
            !isNumber(point['x']) ||
            !isNumber(point['arrayY'])
        ) {
            throw valueException(
                `incorrect input value: {point} is invalid {'x': number, 'y': number} < ${point} >`,
            )
        }

        let c = false
        for (let i = 0, len = polygon['arrayX'].length, j = len - 1; i < len; i++) {
            const inArray =
                (polygon['arrayY'][i] <= point['y'] && point['y'] < polygon['arrayY'][j]) ||
                (polygon['arrayY'][j] <= point['y'] && point['y'] < polygon['arrayY'][i])

            const f1 = (polygon['arrayX'][j] - polygon['arrayX'][i]) * (point['y'] - polygon['arrayY'][i])
            const f2 = polygon['arrayY'][j] - polygon['arrayY'][i] + polygon['arrayX'][i]
            const inArray2 = point['x'] > f1 / f2

            if (inArray && inArray2) {
                c = !c
            }
            j = i
        }

        return c
    }

    /* Сферический закон косинуса */
    export const getSphericalDistance = (
        startCoords: { longitude; latitude },
        destCoords: { longitude; latitude },
    ): number => {
        if (!isObject(startCoords) || !isObject(destCoords)) {
            throw valueException('incorrect initialization value: [not an object]')
        }
        if (
            !Object.prototype.hasOwnProperty.call(startCoords, 'latitude') ||
            !Object.prototype.hasOwnProperty.call(startCoords, 'longitude')
        ) {
            throw valueException(
                "incorrect initialization value 'start coordinates': {'latitude': [number], 'longitude': [number]}",
            )
        }

        if (
            !Object.prototype.hasOwnProperty.call(destCoords, 'latitude') ||
            !Object.prototype.hasOwnProperty.call(destCoords, 'longitude')
        ) {
            throw valueException(
                "incorrect initialization value 'destination coordinates': {'latitude': [number], 'longitude': [number]}",
            )
        }

        const startLatRads = toRadians(startCoords.latitude),
            startLongRads = toRadians(startCoords.longitude)
        const destLatRads = toRadians(destCoords.latitude),
            destLongRads = toRadians(destCoords.longitude)

        const f1 = Math.sin(startLatRads) * Math.sin(destLatRads)
        const f2 = Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads)

        return Math.acos(f1 + f2)
    }

    /* Найти ближайшую к заданной точке (широта, долгота) локацию */
    export const findClosestLocation = (
        coords: { longitude; latitude },
        arrayOfCoords: { longitude; latitude }[],
    ): void => {
        if (!isArray(arrayOfCoords)) {
            throw valueException(`incorrect array value: < ${arrayOfCoords} >`)
        }

        let closestCoords
        let minDist = Number.MAX_VALUE
        for (const item of arrayOfCoords) {
            const dist = getSphericalDistance(coords, item)
            if (dist < minDist) {
                closestCoords = item
                minDist = dist
            }
        }

        return closestCoords
    }

    export const tabulate = (
        low: number,
        high: number,
        num: number,
        func: Processor<number, number>,
    ): { x; y }[] => {
        const point = (x: number, y: number): { x; y } => {
            return { x, y }
        }

        if (!isIntNumber(high) || num < 1) {
            throw typeException(
                `incorrect input argument: {number of points} is not positive integer number < ${num} >`,
            )
        }

        if (!isFunction(func)) {
            throw typeException(`incorrect input argument: not a function < ${func} >`)
        }

        if (!isNumber(low)) {
            throw typeException(`incorrect input argument: {low} is not number < ${low} >`)
        }

        if (!isNumber(high)) {
            throw typeException(`incorrect input argument: {high} is not number < ${high} >`)
        }

        if (low > high) {
            low = [high, (high = low)][0]
        }

        const h = Math.floor((high - low) / (num - 1))
        const res: { x; y }[] = []
        for (let i = 1; i <= num; i++) {
            const x = low + (i - 1) * h
            const y = func(x)
            res.push(point(x, y))
        }

        return res
    }

    // Перевод географических координат (широты и долготы) точки в прямоугольные координаты
    // проекции Гаусса-Крюгера
    // Географические координаты точки (в градусах)
    /** point = {
     *			lon: 37.618, Долгота (положительная для восточного полушария)
     *			lat: 55.752  Широта (положительная для северного полушария)
     *		}
     */
    export const toCartesianCoords = (() => {
        // Параметры эллипсоида Красовского
        const a = 6378245.0 // Большая (экваториальная) полуось
        const b = 6356863.019 // Малая (полярная) полуось
        const e2 = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(a, 2) // Эксцентриситет
        const n = (a - b) / (a + b) // Приплюснутость

        return (point): { north: number; east: number } => {
            if (!isObject(point)) {
                throw valueException(`incorrect input value: <point> not an object < ${point} >`)
            }

            if (
                !Object.prototype.hasOwnProperty.call(point, 'lon') ||
                !Object.prototype.hasOwnProperty.call(point, 'lat')
            ) {
                throw valueException(
                    `incorrect input value: {point} is invalid {'lon': number, 'lat': number} < ${point} >`,
                )
            }

            if (!isNumber(point['lon']) || !isArray(point['lat'])) {
                throw valueException(
                    `incorrect type value: not a number {'lon': ${point['lon']}, 'lat': ${point['lat']}}`,
                )
            }

            // Номер зоны Гаусса-Крюгера (если точка рассматривается в системе
            // координат соседней зоны, то номер зоны следует присвоить вручную)
            const zone = (point['lon'] / 6 + 1).integer()

            //Параметры зоны Гаусса-Крюгера
            const F = 1.0 // Масштабный коэффициент
            const Lat0 = 0.0 // Начальная параллель (в радианах)
            const Lon0 = ((zone * 6 - 3) * Math.PI) / 180 // Центральный меридиан (в радианах)
            const N0 = 0.0 // Условное северное смещение для начальной параллели
            const E0 = zone * 1e6 + 500000.0 // Условное восточное смещение для центрального меридиана

            // Перевод широты и долготы в радианы
            const Lat = toRadians(point['lat'])
            const Lon = toRadians(point['lon'])

            // Вычисление переменных для преобразования
            const v = a * F * Math.pow(1 - e2 * Math.pow(Math.sin(Lat), 2), -0.5)
            const p = a * F * (1 - e2) * Math.pow(1 - e2 * Math.pow(Math.sin(Lat), 2), -1.5)
            const n2 = v / p - 1
            const M1 = (1 + n + (5 / 4) * Math.pow(n, 2) + (5 / 4) * Math.pow(n, 3)) * (Lat - Lat0)
            const M2 =
                (3 * n + 3 * Math.pow(n, 2) + (21 / 8) * Math.pow(n, 3)) *
                Math.sin(Lat - Lat0) *
                Math.cos(Lat + Lat0)
            const M3 =
                ((15 / 8) * Math.pow(n, 2) + (15 / 8) * Math.pow(n, 3)) *
                Math.sin(2 * (Lat - Lat0)) *
                Math.cos(2 * (Lat + Lat0))
            const M4 = (35 / 24) * Math.pow(n, 3) * Math.sin(3 * (Lat - Lat0)) * Math.cos(3 * (Lat + Lat0))
            const M = b * F * (M1 - M2 + M3 - M4)
            const I = M + N0
            const II = (v / 2) * Math.sin(Lat) * Math.cos(Lat)
            const III =
                (v / 24) *
                Math.sin(Lat) *
                Math.pow(Math.cos(Lat), 3) *
                (5 - Math.pow(Math.tan(Lat), 2) + 9 * n2)
            const IIIA =
                (v / 720) *
                Math.sin(Lat) *
                Math.pow(Math.cos(Lat), 5) *
                (61 - 58 * Math.pow(Math.tan(Lat), 2) + Math.pow(Math.tan(Lat), 4))
            const IV = v * Math.cos(Lat)
            const V = (v / 6) * Math.pow(Math.cos(Lat), 3) * (v / p - Math.pow(Math.tan(Lat), 2))
            const VI =
                (v / 120) *
                Math.pow(Math.cos(Lat), 5) *
                (5 -
                    18 * Math.pow(Math.tan(Lat), 2) +
                    Math.pow(Math.tan(Lat), 4) +
                    14 * n2 -
                    58 * Math.pow(Math.tan(Lat), 2) * n2)

            // Вычисление северного и восточного смещения (в метрах)
            const N =
                I +
                II * Math.pow(Lon - Lon0, 2) +
                III * Math.pow(Lon - Lon0, 4) +
                IIIA * Math.pow(Lon - Lon0, 6)
            const E = E0 + IV * (Lon - Lon0) + V * Math.pow(Lon - Lon0, 3) + VI * Math.pow(Lon - Lon0, 5)

            return { north: N, east: E }
        }
    })()
}
