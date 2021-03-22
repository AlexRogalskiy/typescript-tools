import { Checkers } from './checkers'
import { Errors } from './errors'
import { Sorting } from './sorting'
import { Utils } from './utils'

import { Processor } from '../typings/function-types'

export namespace Maths {
    import valueError = Errors.valueError
    import typeError = Errors.typeError
    import Commons = Utils.Commons

    export const sqrt = Math.sqrt
    export const atan2 = Math.atan2
    export const pow = Math.pow
    export const abs = Math.abs
    export const PiBy180 = Math.PI / 180
    export const PiBy180Inv = 180 / Math.PI
    export const PiBy2 = Math.PI / 2
    export const invLog2 = 1 / Math.log(2)

    export const init = (() => {
        if (!Checkers.isFunction(Math['sign'])) {
            Commons.defineStaticProperty(Math, 'sign', {
                value(value: number): number {
                    value = +value // преобразуем в число
                    if (value === 0 || isNaN(value)) {
                        return value
                    }
                    return value > 0 ? 1 : -1
                },
            })
        }
    })()

    export namespace Helpers {
        import shellSort = Sorting.shellSort
        export const memoizer = (
            memo: number[],
            formula: (func: (num: number) => number, value: number) => number,
        ): ((num: number) => void) => {
            if (!Checkers.isArray(memo)) {
                throw valueError(`incorrect input parameter: initial array < ${memo} >`)
            }
            if (!Checkers.isFunction(formula)) {
                throw valueError(`incorrect formula function: function < ${formula} >`)
            }

            const recur = (num: number): number => {
                let result = memo[num]
                if (!Checkers.isNumber(result)) {
                    result = formula(recur, num)
                    memo[num] = result
                }
                return result
            }

            return recur
        }

        export const serial = (): { next: number } => {
            let $n = 0
            return {
                // Увеличение и возврат значения
                get next() {
                    return $n++
                },
                // Установка нового значения, 11 если оно больше текущего
                set next(n) {
                    if (n >= $n) {
                        $n = n
                    } else {
                        throw valueError(`invalid serial number: ${n}`)
                    }
                },
            }
        }

        export const toRadians = (value: number): number => {
            if (!Checkers.isNumber(value)) {
                throw typeError(`incorrect type of argument: degrees < ${value} >`)
            }

            return value * PiBy180
        }

        export const toDegrees = (value: number): number => {
            if (!Checkers.isNumber(value)) {
                throw typeError(`incorrect type of argument: radians < ${value} >`)
            }

            return value * PiBy180Inv
        }

        export const vector = <T>(dimension: number, initial: T): T[] => {
            if (!Checkers.isIntNumber(dimension) || dimension < 0) {
                throw valueError(`incorrect input values: array dimension < ${dimension} >`)
            }

            const arr: T[] = []
            for (let i = 0; i < dimension; i++) {
                arr[i] = initial
            }

            return arr
        }

        export const matrix = <T>(rows: number, columns: number, initial: T): T[][] => {
            if (!Checkers.isIntNumber(rows) || !Checkers.isIntNumber(columns) || rows < 0 || columns < 0) {
                throw valueError(
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

        export const arcsech = (value: number): number => {
            if (!Checkers.isNumber(value) || value > 1 || value <= 0) {
                throw valueError(`incorrect input value: x < ${value} >`)
            }

            return Math.log(1 / value + Math.sqrt(1 / (value * value) - 1))
        }

        export const summ = (x, n, m, ...args: number[]): number => {
            if (
                !Checkers.isNumber(x) ||
                !Checkers.isNumber(n) ||
                !Checkers.isNumber(m) ||
                !Checkers.isArray(args)
            ) {
                throw valueError(
                    `incorrect input values: x < ${x} >, power < ${n} >, step < ${m} >, array < ${args} >`,
                )
            }

            if (args.length === 0) {
                return 0
            }

            let sum = args[0] * Math.pow(x, n)
            for (let i = 1; i < args.length; i++) {
                sum += args[i] * Math.pow(x, n + i * m)
            }

            return sum
        }

        export const geomProgress = (a: number, n: number): number => {
            if (!Checkers.isNumber(a) || !Checkers.isNumber(n) || a < 0 || a === 1 || n < 0) {
                throw valueError(`incorrect input values: ratio < ${a} >, n < ${n} >`)
            }

            return (1 - Math.pow(a, n + 1)) / (1 - a)
        }

        export const residue = (a: number, d: number): number => {
            if (!Checkers.isNumber(a) || !Checkers.isNumber(d)) {
                throw valueError(`incorrect input values: numerator < ${a} >, denominator < ${d} >`)
            }

            let t = a / d
            t = t >= 0 ? Math.floor(t) : Math.floor(t) - 1

            return a - d * t
        }

        export const maxn = (n: number, ...args: number[]): number | null => {
            if (!Checkers.isArray(args) || !Checkers.isIntNumber(n) || n < 1 || n > args.length) {
                throw valueError(`incorrect input value: array < ${args} >, n-th maximum < ${n} >`)
            }

            const arr = shellSort(args).filter(function (e, i, c) {
                return c.indexOf(e) === i
            })

            if (arr.length < n) {
                return null
            }

            return arr[arr.length - 1 - (n - 1)]
        }

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

        export const EMPTY_NUMBER_VECTOR = vector<number>(0, 0)
        export const EMPTY_STRING_VECTOR = vector<string>(0, '')
        export const EMPTY_BOOLEAN_VECTOR = vector<boolean>(0, false)
    }

    export namespace Distances {
        import matrix = Helpers.matrix
        import getEmptyNumberVector = Helpers.getEmptyNumberVector

        export const levenshteinDistance2 = (
            a: string,
            b: string,
            ins: number,
            del: number,
            sub: number,
        ): number | null => {
            if (!Checkers.isString(a) || !Checkers.isString(b)) {
                throw valueError(`incorrect input values: string1 < ${a} >, string2 < ${b} >`)
            }

            if (a.length === 0 || b.length === 0) {
                return null
            }

            const insValue = ins == null ? 2 : Checkers.isNumber(ins) && ins >= 0 ? ins : null
            if (insValue == null) {
                throw valueError(`incorrect ins value: < ${insValue} >`)
            }

            const delValue = del == null ? 2 : Checkers.isNumber(del) && del >= 0 ? del : null
            if (delValue == null) {
                throw valueError(`incorrect del value: < ${delValue} >`)
            }

            const subValue = sub == null ? 1 : Checkers.isNumber(sub) && sub >= 0 ? sub : null
            if (subValue == null) {
                throw valueError(`incorrect sub value: < ${subValue} >`)
            }

            const d = matrix(b.length + 1, a.length + 1, 0)
            for (let i = 0; i <= a.length; i++) {
                d[0][i] = i * ins
            }
            for (let j = 1; j <= b.length; j++) {
                d[j][0] = j * del
            }
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    d[i][j] = Math.min(
                        d[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : sub),
                        d[i][j - 1] + ins,
                        d[i - 1][j] * del,
                    ) //Math.min(d[i-1, j] + 1/*insert*/, d[i, j-1] + 1/*delete*/, d[i-1, j-1] + cost/*replace*/);
                }
            }

            return d[b.length][a.length]
        }

        /**
         * @param {string} s1 Исходная строка
         * @param {string} s2 Сравниваемая строка
         * @param {object} [costs] Веса операций { [replace], [replaceCase], [insert], [remove] }
         * @return {number} Расстояние Левенштейна
         */
        export const levenshteinDistance3 = (s1: string, s2: string, costs: any): number => {
            if (!Checkers.isString(s1) || !Checkers.isString(s2)) {
                throw valueError(`incorrect input values: string1 < ${s1} >, string2 < ${s2} >`)
            }

            let i, j, flip, ch, chl, ii, ii2, cost
            const l1 = s1.length
            const l2 = s2.length

            costs = costs || {}
            const cr = costs.replace || 1
            const cri = costs.replaceCase || costs.replace || 1
            const ci = costs.insert || 1
            const cd = costs.remove || 1

            const cutHalf = (flip = Math.max(l1, l2))

            const minCost = Math.min(cd, ci, cr)
            const minD = Math.max(minCost, (l1 - l2) * cd)
            const minI = Math.max(minCost, (l2 - l1) * ci)
            const buf = new Array(cutHalf * 2 - 1)

            for (i = 0; i <= l2; ++i) {
                buf[i] = i * minD
            }

            for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
                ch = s1[i]
                chl = ch.toLowerCase()

                buf[flip] = (i + 1) * minI

                ii = flip
                ii2 = cutHalf - flip

                for (j = 0; j < l2; ++j, ++ii, ++ii2) {
                    cost = ch === s2[j] ? 0 : chl === s2[j].toLowerCase() ? cri : cr
                    buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost)
                }
            }

            return buf[l2 + cutHalf - flip]
        }

        export const hammingDistance = (a: string, b: string): number => {
            if (!Checkers.isString(a) || !Checkers.isString(b)) {
                throw valueError(`incorrect input values: string1 < ${a} >, string2 < ${b} >`)
            }

            if (!a.length) return b.length
            if (!b.length) return a.length

            return (
                Math.min(
                    hammingDistance(a.substr(1), b) + 1,
                    hammingDistance(a.substr(1), b) + 1,
                    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
                    hammingDistance(a.substr(1), b.substr(1)) + (a[0] !== b[0] ? 1 : 0),
                ) + 1
            )
        }

        export const levenshteinDistanceWeighted = (
            seq1: string,
            seq2: string,
            weighter: { insert: (v) => number; delete: (v) => number; replace: (v1, v2) => number },
        ): number => {
            if (!Checkers.isString(seq1) || !Checkers.isString(seq2)) {
                throw valueError(`incorrect input values: string1 < ${seq1} >, string2 < ${seq2} >`)
            }

            let len1 = seq1.length,
                len2 = seq2.length
            let dist = 0
            const column = getEmptyNumberVector()

            weighter = weighter || {
                insert: () => {
                    return 1.0
                },
                delete: () => {
                    return 0.5
                },
                replace: () => {
                    return 0.3
                },
            }

            /* don't swap the sequences, or this is gonna be painful */
            if (len1 === 0 || len2 === 0) {
                while (len1) {
                    dist += weighter['delete'](seq1[--len1])
                }
                while (len2) {
                    dist += weighter['insert'](seq2[--len2])
                }

                return dist
            }

            column[0] = 0
            for (let j = 1; j <= len2; ++j) {
                column[j] = column[j - 1] + weighter['insert'](seq2[j - 1])
            }

            let ic, dc, rc, last, old
            for (let i = 1; i <= len1; ++i) {
                last = column[0] /* m[i-1][0] */
                column[0] += weighter['delete'](seq1[i - 1]) /* m[i][0] */
                for (let j = 1; j <= len2; ++j) {
                    old = column[j]
                    if (seq1[i - 1] === seq2[j - 1]) {
                        column[j] = last /* m[i-1][j-1] */
                    } else {
                        ic = column[j - 1] + weighter['insert'](seq2[j - 1]) /* m[i][j-1] */
                        dc = column[j] + weighter['delete'](seq1[i - 1]) /* m[i-1][j] */
                        rc = last + weighter['replace'](seq1[i - 1], seq2[j - 1]) /* m[i-1][j-1] */
                        column[j] = ic < dc ? ic : dc < rc ? dc : rc
                    }
                    last = old
                }
            }

            dist = column[len2]

            return dist
        }

        // let myLDistance = var levenshteinDistance("слон", "море");
        /* number of operations to get <b> from <a>*/
        export const levenshteinDistance = (a: string, b: string): number[][] => {
            if (!Checkers.isString(a) || !Checkers.isString(b)) {
                throw valueError(`incorrect input values: string1 < ${a} >, string2 < ${b} >`)
            }

            const res = matrix(a.length + 1, b.length + 1, 0)
            let cost
            for (let i = 0; i <= a.length; i++) {
                res[i][0] = i
            }
            for (let j = 0; j <= b.length; j++) {
                res[0][j] = j
            }

            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    if (a.charAt(i - 1) === b.charAt(j - 1)) {
                        cost = 0
                    } else {
                        cost = 1
                    }
                    res[i][j] = Math.min(
                        res[i - 1][j] + 1 /*insert*/,
                        res[i][j - 1] + 1 /*delete*/,
                        res[i - 1][j - 1] + cost /*replace*/,
                    )
                }
            }

            return res
        }
    }

    export namespace Calculations {
        import vector = Helpers.vector
        import toRadians = Helpers.toRadians

        export namespace Trigonometry {
            import shellSort = Sorting.shellSort

            export const log10 = (value: number): number => {
                if (!Checkers.isNumber(value) || value <= 0) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return Math.ceil(Math.log(value) / Math.LN10)
            }

            export const log = (x: number, a: number): number => {
                if (!Checkers.isNumber(a) || !Checkers.isNumber(x) || x <= 0 || a <= 0 || a === 1) {
                    throw valueError(`incorrect input values: base < ${a} >, num < ${x} >`)
                }

                return Math.log(x) / Math.log(a)
            }

            export const pow = (base: number, exponent: number): number => {
                if (!Checkers.isNumber(base) || !Checkers.isNumber(exponent)) {
                    throw valueError(`incorrect input values: base < ${base} >, exponent < ${exponent} >`)
                }

                if (base === 0) return 0
                if (base === 1) return 1
                if (base === -1) return exponent % 2 === 0 ? 1 : -1

                let result = 1
                const flag = exponent < 0
                exponent = Math.abs(exponent)

                while (exponent > 0) {
                    if (exponent % 2) {
                        result *= base
                    }
                    base *= base
                    exponent = Math.floor(exponent / 2)
                }

                return flag ? 1 / result : result
            }

            export const triangleSide = (a: number, b: number): number => {
                if (!Checkers.isNumber(a) || !Checkers.isNumber(b)) {
                    throw valueError(`incorrect input values: a < ${a} >, b < ${b} >`)
                }

                const angleA = Math.atan(a / b),
                    angleB = Math.atan(b / a),
                    angleC = Math.PI - angleA - angleB
                const c = Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(angleC)

                return Math.sqrt(c)
            }

            export const cosec = (x: number): number => {
                if (!Checkers.isNumber(x)) {
                    throw valueError(`incorrect input value: x < ${x} >`)
                }

                return 1 / Math.sin(x)
            }

            export const sec = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return 1 / Math.cos(value)
            }

            export const sinh2 = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return (Math.exp(value) - Math.exp(-value)) / 2
            }

            export const cosh2 = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return (Math.exp(value) + Math.exp(-value)) / 2
            }

            export const tanh = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return sinh2(value) / cosh2(value)
            }

            export const cotanh = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return 1 / tanh(value)
            }

            export const cosech = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return 1 / sinh2(value)
            }

            export const sech = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return 1 / cosh2(value)
            }

            export const arcsinh = (value: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return Math.log(value + Math.sqrt(value * value + 1))
            }

            export const arccosh = (value: number): number => {
                if (!Checkers.isNumber(value) || value < 1) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return Math.log(value + Math.sqrt(value * value - 1))
            }

            export const arctanh = (value: number): number => {
                if (!Checkers.isNumber(value) || Math.abs(value) >= 1 || Math.abs(value) < 0) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return (1 / 2) * Math.log((1 + value) / (1 - value))
            }

            export const arcotanh = (value: number): number => {
                if (!Checkers.isNumber(value) || Math.abs(value) <= 1) {
                    throw valueError(`incorrect input value: x < ${value} >`)
                }

                return (1 / 2) * Math.log((value + 1) / (value - 1))
            }

            export const arccosech = (x: number): number => {
                if (!Checkers.isNumber(x) || x === 0) {
                    throw valueError(`incorrect input value: x < ${x} >`)
                }

                return x < 0
                    ? Math.log(1 / x - Math.sqrt(1 / (x * x) + 1))
                    : Math.log(1 / x + Math.sqrt(1 / (x * x) + 1))
            }

            export const inn = (n: number, ...args: number[]): number | null => {
                if (!Checkers.isArray(args) || !Checkers.isIntNumber(n) || n < 1 || n > args.length) {
                    throw valueError(`incorrect input value: array < ${args} >, n-th minimum < ${n} >`)
                }

                const arr = shellSort(args).filter((e, i, c) => {
                    return c.indexOf(e) === i
                })

                if (arr.length < n) {
                    return null
                }

                return arr[n - 1]
            }

            export const sinus = (a: number, b: number, h: number, eps: number): number[] => {
                if (
                    !Checkers.isNumber(a) ||
                    !Checkers.isNumber(b) ||
                    !Checkers.isNumber(h) ||
                    !Checkers.isNumber(eps)
                ) {
                    throw valueError(
                        `incorrect input values: lower border < ${a} >, upper border < ${b} >, step < ${h} >, precision < ${eps} >`,
                    )
                }

                const precision = eps == null ? 0.0001 : Checkers.isNumber(eps) && eps > 0 ? eps : null
                if (precision == null) {
                    throw valueError(`incorrect 'precision' value: < ${precision} >`)
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
                if (!Checkers.isNumber(x)) {
                    throw valueError(`incorrect input values: x < ${x} >`)
                }

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
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
                if (!Checkers.isNumber(x) || !Checkers.isRealNumber(e) || e <= 0 || e >= 1) {
                    throw valueError(`incorrect input values: x < ${x} >, precision < ${e} >`)
                }

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num === null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
                }

                const precision = eps == null ? 0.0001 : Checkers.isNumber(eps) && eps > 0 ? eps : null
                if (precision === null) {
                    throw valueError(`incorrect 'precision' value: < ${precision} >`)
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
                if (!Checkers.isNumber(x) || !Checkers.isRealNumber(e) || e <= 0 || e >= 1) {
                    throw valueError(`incorrect input values: x < ${x} >, precision < ${e} >`)
                }

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
                }

                const precision = eps == null ? 0.0001 : Checkers.isNumber(eps) && eps > 0 ? eps : null
                if (precision == null) {
                    throw valueError(`incorrect 'precision' value: < ${precision} >`)
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
                const num = n == null ? 100 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${n} >`)
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

            export const geron = (a: number, eps: number): number => {
                if (!Checkers.isNumber(a) || a < 0) {
                    throw valueError(`incorrect input value: expression < ${a} >`)
                }

                const precision = eps == null ? 0.0001 : Checkers.isNumber(eps) && eps > 0 ? eps : null
                if (precision == null) {
                    throw valueError(`incorrect 'precision' value: < ${precision} >`)
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
                if (!Checkers.isNumber(a) || a < 0) {
                    throw valueError(`incorrect input value: expression < ${a} >`)
                }
                let c = 0x8000,
                    g = 0x8000

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
                if (!Checkers.isNumber(z)) {
                    throw valueError(`incorrect input value: z < ${z} >`)
                }

                let s = z,
                    g = z

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n >= 1 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
                }

                for (let i = 1; i <= num; i++) {
                    g *= (z * z) / (2 * i) / (2 * i + 1)
                    s += g
                }

                return s
            }

            // http://en.wikipedia.org/wiki/Hyperbolic_function
            export const cosh = (z: number, n: number): number => {
                if (!Checkers.isNumber(z)) {
                    throw valueError(`incorrect input value: z < ${z} >`)
                }

                let s = 1,
                    g = 1

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n >= 1 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
                }

                for (let i = 1; i <= num; i++) {
                    g *= (z * z) / (2 * i - 1) / (2 * i)
                    s += g
                }

                return s
            }

            export const tabX = (low: number, i: number, h: number): number => {
                return low + i * h
            }

            export const tabUnevenX = (low: number, high: number, i: number, n: number): number => {
                return (low + high + (high - low) * Math.cos(((2 * i + 1) * Math.PI) / (2 * n))) / 2
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

                if (!Checkers.isIntNumber(high) || num < 1) {
                    throw typeError(
                        `incorrect input argument: {number of points} is not positive integer number < ${num} >`,
                    )
                }

                if (!Checkers.isFunction(func)) {
                    throw typeError(`incorrect input argument: not a function < ${func} >`)
                }

                if (!Checkers.isNumber(low)) {
                    throw typeError(`incorrect input argument: {low} is not number < ${low} >`)
                }

                if (!Checkers.isNumber(high)) {
                    throw typeError(`incorrect input argument: {high} is not number < ${high} >`)
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
        }

        export namespace Areas {
            export const squared = Object.defineProperties(
                {},
                {
                    x: { value: 1, writable: true, enumerable: true, configurable: true },
                    y: { value: 1, writable: true, enumerable: true, configurable: true },
                    r: {
                        get() {
                            return Math.sqrt(this.x * this.x + this.y * this.y)
                        },
                        enumerable: true,
                        configurable: true,
                    },
                },
            )

            export const circleArea = (radius: number): string => {
                if (!Checkers.isNumber(radius) || radius < 0) {
                    throw valueError(`incorrect radius value: radius < ${radius} >`)
                }

                return (Math.PI * radius * radius).toFixed(2)
            }

            export const squareArea = (a: number): string => {
                if (!Checkers.isNumber(a) || a < 0) {
                    throw valueError(`incorrect side value: side < ${a} >`)
                }

                return (a * a).toFixed(2)
            }

            export const rectangularArea = (a: number, b: number): string => {
                if (!Checkers.isNumber(a) || !Checkers.isNumber(b) || a < 0 || b < 0) {
                    throw valueError(`incorrect side values: a < ${a} >, b < ${b} >`)
                }

                return (a * b).toFixed(2)
            }

            export const triangleArea = (a: number, b: number, c: number): string => {
                if (
                    !Checkers.isNumber(a) ||
                    !Checkers.isNumber(b) ||
                    !Checkers.isNumber(c) ||
                    a < 0 ||
                    b < 0 ||
                    c < 0
                ) {
                    throw valueError(`incorrect side values: a < ${a} >, b < ${b} >, c < ${c} >`)
                }

                const s = (a + b + c) / 2
                return Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2)
            }

            export const trapeziumArea = (a: number, b: number, h: number): string => {
                if (
                    !Checkers.isNumber(a) ||
                    !Checkers.isNumber(b) ||
                    !Checkers.isNumber(h) ||
                    a < 0 ||
                    b < 0 ||
                    h < 0
                ) {
                    throw valueError(`incorrect side values: a < ${a} >, b < ${b} >, height < ${h} >`)
                }

                return (((a + b) * h) / 2).toFixed(2)
            }

            export const square = (): { r: number; readonly theta: number } => {
                let $x = 1
                let $y = 1
                return {
                    get r() {
                        return Math.sqrt($x * $x + $y * $y)
                    },
                    set r(value) {
                        const prevValue = Math.sqrt($x * $x + $y * $y)
                        const ratio = value / prevValue
                        $x *= ratio
                        $y *= ratio
                    },
                    get theta() {
                        return Math.atan2($y, $x)
                    },
                }
            }

            export const triangleSquare = (array: number[][]): number => {
                if (!Checkers.isArray(array) || !Checkers.isArray(array[0])) {
                    throw valueError(`incorrect array value: array < ${array} >`)
                }

                if (!Geometry.isTriangleSquared(array)) {
                    throw valueError(`incorrect squared triangle < ${JSON.stringify(array)} >`)
                }

                const left = (array[0][0] - array[2][0]) * (array[1][1] - array[2][1])
                const right = (array[0][1] - array[2][1]) * (array[1][0] - array[2][0])

                return Math.abs(left - right) / 2
            }
        }

        export namespace Integrals {
            // Метод касательных (метод Ньютона)
            export const newton = (x0: number, x: number, e: number, func1, func2): number => {
                if (
                    !Checkers.isNumber(x0) ||
                    !Checkers.isNumber(x) ||
                    !Checkers.isNumber(e) ||
                    !Checkers.isFunction(func1) ||
                    !Checkers.isFunction(func2)
                ) {
                    throw valueError(
                        `incorrect input values: x0 < ${x0} >, x < ${x} >, x < ${x} >, precision < ${e} >, function1 < ${func1} >, function2 < ${func2} >`,
                    )
                }

                let n = 0
                do {
                    x0 = x
                    x = x0 - func1(x0) / func2(x0)
                    n++
                } while (Math.abs(x0 - x) > e)

                return n
            }

            // Метод хорд
            export const xord = (
                a: number,
                b: number,
                x: number,
                e: number,
                func: Processor<number, number>,
            ): number | null => {
                if (
                    !Checkers.isNumber(a) ||
                    !Checkers.isNumber(b) ||
                    !Checkers.isNumber(x) ||
                    !Checkers.isNumber(e) ||
                    !Checkers.isFunction(func)
                ) {
                    throw valueError(
                        `incorrect input values: lower border < ${a} >, upper border < ${b} >, x < ${x} >, precision < ${e} >, function < ${func} >`,
                    )
                }

                let fa = func(a),
                    fb = func(b),
                    fx,
                    x0 = x,
                    n = 0
                if (func(a) * func(b) > 0) {
                    return null
                }

                x = a - (fa * (b - a)) / (fb - fa)
                do {
                    n++
                    x0 = x
                    fx = func(x)
                    if (fx * fb < 0) {
                        a = x
                        fa = fx
                        x = a - (fa * (b - a)) / (fb - fa)
                    }
                    if (fx * fa < 0) {
                        b = x
                        fb = fx
                        x = b - (fb * (b - a)) / (fb - fa)
                    }
                } while (Math.abs(x0 - x) > e)

                return n
            }

            // Метод простой итерации
            export const simple = (x0: number, x: number, e: number, func): number => {
                if (
                    !Checkers.isNumber(x0) ||
                    !Checkers.isNumber(x) ||
                    !Checkers.isNumber(e) ||
                    !Checkers.isFunction(func)
                ) {
                    throw valueError(
                        `incorrect input values: x0 < ${x0} >, x < ${x} >, precision < ${e} >, function < ${func} >`,
                    )
                }

                let n = 0
                do {
                    x = func((x0 = x))
                    n++
                } while (Math.abs(x0 - x) > e && n < 32000)

                return n
            }

            // let xx = var hdiv(-17, 17, 1, function(v) {
            //	return v * v * v;
            // });
            // метод половинного деления
            export const hdiv = (a: number, b: number, e: number, func): number | null => {
                if (
                    !Checkers.isNumber(a) ||
                    !Checkers.isNumber(b) ||
                    !Checkers.isNumber(e) ||
                    !Checkers.isFunction(func)
                ) {
                    throw valueError(
                        `incorrect input values: lower border < ${a} >, upper border < ${b} >, precision < ${e} >, function < ${func} >`,
                    )
                }

                let n = 0,
                    x,
                    y
                if (func(a) * func(b) > 0) {
                    return null
                }

                while (Math.abs(a - b) / 2 > e) {
                    x = (a + b) / 2
                    n++
                    y = func(x)
                    if (y === 0) break
                    if (func(a) * y < 0) {
                        b = x
                    } else {
                        a = x
                    }
                }

                return n
            }

            // let xx = getFuncMinimum(-0.3, 0.5, function(v) {
            //	return v * Math.pow(v - 1, 2) * Math.pow(v - 1, 3)
            // }, 1e-7)
            // document.writeln("let getFuncMinimum: " + xx.xmin + ' ' + xx.ymin)
            export const getFuncMinimum = (a: number, b: number, func, eps: number): { xmin; ymin } => {
                if (!Checkers.isNumber(a) || !Checkers.isNumber(b) || !Checkers.isFunction(func)) {
                    throw valueError(
                        `incorrect input values: lower border < ${a} >, upper border < ${b} >, function < ${func} >`,
                    )
                }

                const precision = eps == null ? 0.0001 : Checkers.isNumber(eps) && eps > 0 ? eps : null
                if (precision == null) {
                    throw valueError(`incorrect 'precision' value: < ${precision} >`)
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

            // let arX = [], arY= [];
            // for(var i=0; i<9; i++) {
            //	arX.push(i);
            //	arY.push(i * (i - 9/3) * (i - 9 + 1) + 0.001 * (Math.random() % 100 - 50));
            //	document.writeln(' ' + arX[i] + ' > ' + arY[i]);
            // };
            // var res = var interpolation(9, 0.1, arX, arY);
            // document.writeln("interpolation: " + res);
            export const interpolate = (arrayX: number[], arrayY: number[], x: number, n: number): number => {
                if (!Checkers.isArray(arrayX) || !Checkers.isArray(arrayY) || !Checkers.isNumber(x)) {
                    throw valueError(
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

                const num = n == null ? 9 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
                }

                if (x < 0 || x > num) {
                    throw valueError(`incorrect input value: x < ${x} > is out of range [0, ${num}]`)
                }

                return lagr(x)
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

                if (!Checkers.isNumber(value) || !Checkers.isFunction(func)) {
                    throw valueError(`incorrect input values: x < ${value} >, function < ${func} >`)
                }

                if (func(-1) === func(1)) {
                    makeCos(value)
                    return sumCos(value)
                }

                makeCosSin(value)
                return sumCosSin(value)
            }
        }

        export namespace Geometry {
            import toDegrees = Helpers.toDegrees

            export const intersection = (obj1, obj2): boolean => {
                if (!Checkers.isObject(obj1)) {
                    throw valueError(`incorrect input argument: {obj1} is not an object < ${obj1} >`)
                }
                if (!Checkers.isObject(obj2)) {
                    throw valueError(`incorrect input argument: {obj2} is not an object < ${obj2} >`)
                }

                const x =
                    (obj1.x.max -
                        obj1.x.min +
                        obj2.x.max -
                        obj2.x.min -
                        Math.abs(obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min)) /
                    2
                const y =
                    (obj1.y.max -
                        obj1.jy.min +
                        obj2.y.max -
                        obj2.y.min -
                        Math.abs(obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min)) /
                    2

                return x > 0 && y > 0
            }

            export const penetration = (
                obj1,
                obj2,
            ): { x: number; y: number; direction: { x: number; y: number } } | null => {
                if (!Checkers.isObject(obj1)) {
                    throw valueError(`incorrect input argument: {obj1} is not an object < ${obj1} >`)
                }
                if (!Checkers.isObject(obj2)) {
                    throw valueError(`incorrect input argument: {obj2} is not an object < ${obj2} >`)
                }

                const dx = obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min,
                    dy = obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min,
                    x = (obj1.x.max - obj1.x.min + obj2.x.max - obj2.x.min - Math.abs(dx)) / 2,
                    y = (obj1.y.max - obj1.y.min + obj2.y.max - obj2.y.min - Math.abs(dy)) / 2

                return x > 0 && y > 0
                    ? { x, y, direction: { x: dx / Math.abs(dx), y: dy / Math.abs(dy) } }
                    : null
            }

            export const direction = (obj1, obj2): { x: number; y: number } => {
                if (!Checkers.isObject(obj1)) {
                    throw valueError(`incorrect input argument: {obj1} is not an object < ${obj1} >`)
                }
                if (!Checkers.isObject(obj2)) {
                    throw valueError(`incorrect input argument: {obj2} is not an object < ${obj2} >`)
                }

                const x = obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min,
                    y = obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min

                return { x: x / Math.abs(x), y: y / Math.abs(y) }
            }

            export const distance = (obj1, obj2): number => {
                if (!Checkers.isObject(obj1)) {
                    throw valueError(`incorrect input argument: {obj1} is not an object < ${obj1} >`)
                }
                if (!Checkers.isObject(obj2)) {
                    throw valueError(`incorrect input argument: {obj2} is not an object < ${obj2} >`)
                }

                const x = Math.abs(obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min),
                    y = Math.abs(obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min)

                return Math.sqrt(x * x + y * y)
            }

            export const calculateDistance = (
                lat1: number,
                lon1: number,
                lat2: number,
                lon2: number,
                radius: number,
            ): number => {
                if (!Checkers.isNumber(lat1) || !Checkers.isNumber(lon1)) {
                    throw valueError(
                        `incorrect input arguments: start point latitude < ${lat1} > and longitude < ${lon1} >`,
                    )
                }

                if (!Checkers.isNumber(lat2) || !Checkers.isNumber(lon2)) {
                    throw valueError(
                        `incorrect input arguments: start point latitude < ${lat2} > and longitude < ${lon2} >`,
                    )
                }

                const radius_ =
                    radius == null ? 6378.135 : Checkers.isNumber(radius) && radius > 0 ? radius : null
                if (radius_ == null) {
                    throw valueError(`incorrect {radius} value: < ${radius_} >`)
                }

                const rad = toRadians(Math.PI / 180)
                lat1 = toRadians(lat1) * rad
                lon1 = toRadians(lon1) * rad
                lat2 = toRadians(lat2) * rad
                lon2 = toRadians(lon2) * rad

                const theta = lon2 - lon1
                let dist = Math.acos(
                    Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(theta),
                )
                if (dist < 0) {
                    dist += Math.PI
                }

                return dist * radius
            }

            export const calculateBearing = (
                lat1: number,
                lon1: number,
                lat2: number,
                lon2: number,
            ): number => {
                const value = Math.atan2(
                    Math.sin(lon2 - lon1) * Math.cos(lat2),
                    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1),
                )

                return toDegrees(value)
            }

            export const getInnerCircleRadius = (a: number, b: number, c: number): number => {
                if (isTriangle(a, b, c)) {
                    const perim = a + b + c
                    const p = perim / 2
                    const square = Math.sqrt(p * (p - a) * (p - b) * (p - c))

                    return parseInt(((2 * square) / perim).toFixed(3))
                }

                return 0
            }

            export const getOuterCircleRadius = (a: number, b: number, c: number): number => {
                if (isTriangle(a, b, c)) {
                    const p = (a + b + c) / 2
                    const square = Math.sqrt(p * (p - a) * (p - b) * (p - c))

                    return parseInt(((a * b * c) / 4 / square).toFixed(3))
                }

                return 0
            }

            export const isTriangle = (a, b, c): boolean => {
                if (
                    !Checkers.isNumber(a) ||
                    !Checkers.isNumber(b) ||
                    !Checkers.isNumber(c) ||
                    a < 0 ||
                    b < 0 ||
                    c < 0
                ) {
                    throw valueError(`incorrect input parameters: a < ${a} >, b < ${b} >, c < ${c} >`)
                }

                return !!(Math.max(a + b, c) && Math.max(a + c, b) && Math.max(b + c, a))
            }

            export const isTriangleSquared = (array: number[][]): boolean => {
                if (!Checkers.isArray(array) || !Checkers.isArray(array[0])) {
                    throw valueError(`incorrect array value: array < ${array} >`)
                }

                const a = Math.pow(array[0][0] - array[1][0], 2) + Math.pow(array[0][1] - array[1][1], 2)
                const b = Math.pow(array[1][0] - array[2][0], 2) + Math.pow(array[1][1] - array[2][1], 2)
                const c = Math.pow(array[0][0] - array[2][0], 2) + Math.pow(array[0][1] - array[2][1], 2)

                const hipot = a > b ? (a > c ? a : c) : b > c ? b : c

                return hipot === (hipot === a ? b + c : hipot === b ? a + c : a + b)
            }

            export const crossLines = (line1, line2): { x0: number; y0: number } | string => {
                if (!Checkers.isObject(line1) || !Checkers.isObject(line2)) {
                    throw valueError(`incorrect input values: line1 < ${line1} >, line2 < ${line2} >`)
                }

                if (line1.a * line2.b === line1.b * line2.a) {
                    if (line1.a * line2.c !== line1.c * line2.a) {
                        return 'parallel lines'
                    }
                    return 'coincided lines'
                }

                const x0 = (line1.b * line2.c - line2.b * line1.c) / (line1.a * line2.b - line1.b * line2.a)
                const y0 = (line1.a * line2.c - line1.c * line2.a) / (line1.b * line2.a - line2.b * line1.a)

                return { x0, y0 }
            }

            export const randomPointOnCircle = (radius: number): { x; y } => {
                const angle = Math.random() * 2 * Math.PI

                return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
            }

            // Пересекающиеся прямоугольники
            export const computeLength = (arr: any[], prop = 'y1'): number => {
                let len = arr.length
                if (len === 0) {
                    return 0
                }

                arr.sort((a, b) => {
                    return a[prop] - b[prop]
                })

                let i = 0,
                    left = 0,
                    right = 0
                while (i++ < len) {
                    const l = arr[i - 1],
                        r = arr[i]
                    if (l > right) {
                        len += right - left
                        left = l
                        right = r
                    } else if (r > right) {
                        right = r
                    }
                }

                return len + (right - left)
            }

            // let rect = [{'x1': 0, 'x2': 2, 'y1': 14, 'y2': 15}, {'x1': 1, 'x2': 33, 'y1': 1, 'y2': 2}];
            // let rect = [{'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}, {'x1': 1, 'x2': 3, 'y1': 1, 'y2': 2}, {'x1': 1.5, 'x2': 3.5, 'y1': 1, 'y2': 2}];
            // let rect = [{'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}, {'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}, {'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}];
            export const computeArea = (
                rect: { x1: number; x2: number; y1: number; y2: number }[],
            ): number => {
                const queue: { x: number; status: boolean; size: { y1: number; y2: number } }[] = []

                let area = 0,
                    index
                rect.map(item => {
                    queue.push({
                        x: item['x1'],
                        status: true,
                        size: { y1: item['y1'], y2: item['y2'] },
                    })
                    queue.push({
                        x: item['x2'],
                        status: false,
                        size: { y1: item['y1'], y2: item['y2'] },
                    })
                })

                queue.sort((a, b) => {
                    return a['x'] - b['x']
                })

                const segments: { y1: number; y2: number }[] = []
                let last = queue[0]['x']
                queue.map(item => {
                    area += (item['x'] - last) * computeLength(segments)
                    last = item['x']
                    if (item['status']) {
                        segments.push(item['size'])
                    } else {
                        index = segments.indexOf(item['size'])
                        if (index > -1) {
                            segments.splice(index, 1)
                        }
                    }
                })

                return area
            }

            // polygon = {arrayX: [-73,-33,7,-33], arrayY: [-85,-126,-85,-45]};
            // point = {x: -40, y: -60};
            export const inPolygon = (
                polygon: { arrayX: number[]; arrayY: number[] },
                point: { x: number; y: number },
            ): boolean => {
                if (!Checkers.isObject(polygon)) {
                    throw valueError(`incorrect input value: {polygon} not an object < ${polygon} >`)
                }

                if (
                    !Object.prototype.hasOwnProperty.call(polygon, 'arrayX') ||
                    !Object.prototype.hasOwnProperty.call(polygon, 'arrayY') ||
                    !Checkers.isArray(polygon['arrayX']) ||
                    !Checkers.isArray(polygon['arrayY'])
                ) {
                    throw valueError(
                        `incorrect input value: {polygon} is invalid {'arrayX': array, 'arrayY': array} < ${polygon} >`,
                    )
                }

                if (polygon['arrayX'].length !== polygon['arrayY'].length) {
                    throw valueError(
                        `incorrect input value: {polygon} length of {arrayX} is not equal to {arrayY} in < ${polygon} >`,
                    )
                }

                if (!Checkers.isObject(point)) {
                    throw valueError(`incorrect input values: {point} is not object < ${point} >`)
                }

                if (
                    !Object.prototype.hasOwnProperty.call(point, 'x') ||
                    !Object.prototype.hasOwnProperty.call(point, 'y') ||
                    !Checkers.isNumber(point['x']) ||
                    !Checkers.isNumber(point['arrayY'])
                ) {
                    throw valueError(
                        `incorrect input value: {point} is invalid {'x': number, 'y': number} < ${point} >`,
                    )
                }

                let flag = false
                for (let i = 0, len = polygon['arrayX'].length, j = len - 1; i < len; i++) {
                    const inArray =
                        (polygon['arrayY'][i] <= point['y'] && point['y'] < polygon['arrayY'][j]) ||
                        (polygon['arrayY'][j] <= point['y'] && point['y'] < polygon['arrayY'][i])

                    const f1 =
                        (polygon['arrayX'][j] - polygon['arrayX'][i]) * (point['y'] - polygon['arrayY'][i])
                    const f2 = polygon['arrayY'][j] - polygon['arrayY'][i] + polygon['arrayX'][i]
                    const inArray2 = point['x'] > f1 / f2

                    if (inArray && inArray2) {
                        flag = !flag
                    }
                    j = i
                }

                return flag
            }

            /* Сферический закон косинуса */
            export const getSphericalDistance = (
                startCoords: { longitude: number; latitude: number },
                destCoords: { longitude: number; latitude: number },
            ): number => {
                if (!Checkers.isObject(startCoords) || !Checkers.isObject(destCoords)) {
                    throw valueError('incorrect initialization value: [not an object]')
                }
                if (
                    !Object.prototype.hasOwnProperty.call(startCoords, 'latitude') ||
                    !Object.prototype.hasOwnProperty.call(startCoords, 'longitude')
                ) {
                    throw valueError(
                        "incorrect initialization value 'start coordinates': {'latitude': [number], 'longitude': [number]}",
                    )
                }

                if (
                    !Object.prototype.hasOwnProperty.call(destCoords, 'latitude') ||
                    !Object.prototype.hasOwnProperty.call(destCoords, 'longitude')
                ) {
                    throw valueError(
                        "incorrect initialization value 'destination coordinates': {'latitude': [number], 'longitude': [number]}",
                    )
                }

                const startLatRads = toRadians(startCoords.latitude),
                    startLongRads = toRadians(startCoords.longitude)
                const destLatRads = toRadians(destCoords.latitude),
                    destLongRads = toRadians(destCoords.longitude)

                const f1 = Math.sin(startLatRads) * Math.sin(destLatRads)
                const f2 =
                    Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads)

                return Math.acos(f1 + f2)
            }

            /* Найти ближайшую к заданной точке (широта, долгота) локацию */
            export const findClosestLocation = (
                coords: { longitude; latitude },
                arrayOfCoords: { longitude; latitude }[],
            ): void => {
                if (!Checkers.isArray(arrayOfCoords)) {
                    throw valueError(`incorrect array value: < ${arrayOfCoords} >`)
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
                    if (!Checkers.isObject(point)) {
                        throw valueError(`incorrect input value: <point> not an object < ${point} >`)
                    }

                    if (
                        !Object.prototype.hasOwnProperty.call(point, 'lon') ||
                        !Object.prototype.hasOwnProperty.call(point, 'lat')
                    ) {
                        throw valueError(
                            `incorrect input value: {point} is invalid {'lon': number, 'lat': number} < ${point} >`,
                        )
                    }

                    if (!Checkers.isNumber(point['lon']) || !Checkers.isArray(point['lat'])) {
                        throw valueError(
                            `incorrect type value: not a number {'lon': ${point['lon']}, 'lat': ${point['lat']}}`,
                        )
                    }

                    // Номер зоны Гаусса-Крюгера (если точка рассматривается в системе
                    // координат соседней зоны, то номер зоны следует присвоить вручную)
                    const zone = parseInt(String(point['lon'] / 6 + 1))

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
                    const M4 =
                        (35 / 24) * Math.pow(n, 3) * Math.sin(3 * (Lat - Lat0)) * Math.cos(3 * (Lat + Lat0))
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
                    const E =
                        E0 + IV * (Lon - Lon0) + V * Math.pow(Lon - Lon0, 3) + VI * Math.pow(Lon - Lon0, 5)

                    return { north: N, east: E }
                }
            })()

            export const calcVectorAngle = (ux: number, uy: number, vx: number, vy: number): number => {
                const ta = Math.atan2(uy, ux)
                const tb = Math.atan2(vy, vx)

                return tb >= ta ? tb - ta : 2 * Math.PI - (ta - tb)
            }
        }

        export namespace Algebra {
            export const getNumOnesInBinary = (num: number): number => {
                let numOnes = 0
                while (num !== 0) {
                    if ((num & 1) === 1) {
                        numOnes++
                    }
                    // num = num & (num - 1);
                    num >>>= 1
                }
                return numOnes
            }

            export const isArmStrongNumber = (num: number): boolean => {
                if (!Checkers.isNumber(num)) {
                    throw valueError(`incorrect input value: num < ${num} >`)
                }

                const splitNum: number[] = []
                let res = 0
                while (num > 0) {
                    splitNum.push(num % 10)
                    num = Math.floor(num / 10)
                }

                const pw = splitNum.length
                for (let i = 0; i < pw; i++) {
                    res += Math.pow(splitNum[i], pw)
                }

                return res === num
            }

            export const isLatinSquare = (array: number[][]): boolean => {
                if (!Checkers.isArray(array)) {
                    throw valueError(`incorrect array value: < ${array} >`)
                }

                const w = array.length ? array.length : 0,
                    h = array[0] && Checkers.isArray(array[0]) ? array[0].length : 0
                if (h === 0 || w === 0 || h !== w) {
                    throw valueError(`incorrect matrix size width=${w}, height=${h}`)
                }

                for (let i = 0; i < h; i++) {
                    for (let j = 0; j < h; j++) {
                        if (array[i][j] < 1 || array[i][j] > w) {
                            return false
                        }
                    }
                }

                for (let i = 0; i < h; i++) {
                    for (let j = 0; j < h; j++) {
                        for (let k = j + 1; k < h; k++) {
                            if (array[i][j] === array[i][k]) {
                                return false
                            }
                        }
                    }
                }
                for (let i = 0; i < h; i++) {
                    for (let j = 0; j < h; j++) {
                        for (let k = j + 1; k < h; k++) {
                            if (array[i][j] === array[k][j]) {
                                return false
                            }
                        }
                    }
                }

                return false
            }

            export const denom = (num: number): number[] => {
                if (!Checkers.isIntNumber(num)) {
                    throw valueError(`incorrect input value: num < ${num} >`)
                }

                let i = 2,
                    temp = num
                const result: number[] = []
                while (temp > 1 && i <= num) {
                    if (temp % i === 0) {
                        result.push(i)
                        temp /= i
                    }
                    i++
                }

                return result
            }

            export const denom2 = (num: number): number[] => {
                if (!Checkers.isIntNumber(num)) {
                    throw valueError(`incorrect input value: num < ${num} >`)
                }

                let i = 1
                const result: number[] = []
                while (i <= num) {
                    if (num % i === 0) {
                        result.push(i)
                    }
                    i++
                }

                return result
            }

            export const sumNum = (num: number): number => {
                if (!Checkers.isNumber(num)) {
                    throw valueError(`incorrect input value: num < ${num} >`)
                }

                let sum = 0
                num = Math.abs(num)
                while (num > 0) {
                    sum += num % 10
                    num = Math.floor(num / 10)
                }

                return sum
            }

            export const prefixAverages = (array: number[]): number[] => {
                if (!Checkers.isArray(array)) {
                    throw valueError(`incorrect array value: < ${array} >`)
                }

                let sum = 0
                const result: number[] = []
                for (let i = 0; i < array.length; i++) {
                    sum += array[i]
                    result[i] = sum / (i + 1)
                }

                return result
            }

            export const gcd = (i: number, j: number): number => {
                if (!Checkers.isNumber(i) || !Checkers.isNumber(j)) {
                    throw valueError(`incorrect input values: x < ${i} >, y < ${j} >`)
                }

                i = Math.floor(Math.abs(i))
                j = Math.floor(Math.abs(j))
                while (i !== j) {
                    if (i > j) {
                        i -= j
                    } else {
                        j -= i
                    }
                }

                return i
            }

            export const gcd2 = (i: number, j: number): number => {
                if (!Checkers.isNumber(i) || !Checkers.isNumber(j)) {
                    throw valueError(`incorrect input values: x < ${i} >, y < ${j} >`)
                }

                let temp
                i = Math.floor(Math.abs(i))
                j = Math.floor(Math.abs(j))
                while (j !== 0) {
                    temp = j
                    j = i % j
                    i = temp
                }

                return i
            }

            export const gcd3 = (x: number, y: number): number => {
                if (!Checkers.isNumber(x) || !Checkers.isNumber(y)) {
                    throw valueError(`incorrect input values: x < ${x} >, y < ${y} >`)
                }

                let temp,
                    temp2 = 0
                if (x === 0) return y
                if (y === 0) return x

                while (((x | y) & 1) === 0) {
                    x >>= 1
                    y >>= 1
                    ++temp2
                }

                while ((x & 1) === 0) x >>= 1
                while (y) {
                    while ((y & 1) === 0) y >>= 1
                    temp = y
                    if (x > y) {
                        y = x - y
                    } else {
                        y = y - x
                    }
                    x = temp
                }

                return x << temp2
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
                if (!Checkers.isArray(str)) {
                    throw valueError(`incorrect input parameter: array < ${str} >`)
                }
                permute(str)

                return permArr
            }

            export const exp = (value: number, n: number): number => {
                if (!Checkers.isNumber(value)) {
                    throw valueError(
                        `incorrect input values:  value< ${value} >, number of iterations < ${n} >`,
                    )
                }

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
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

            export const power = (base: number, exponent: number): number => {
                let result = 1
                for (let count = 0; count < exponent; count++) {
                    result *= base
                }

                return result
            }

            // let res = polinom([1, -10, 27, -18], 0, 10);
            // document.writeln("<p>" + res + "</p>");
            // Метод Ньютона-Рафсона
            export const polinom = (array: number[], init: number, n: number): number => {
                if (!Checkers.isArray(array) || !Checkers.isNumber(init)) {
                    throw valueError(`incorrect input values:  array < ${array} >, initial value < ${init} >`)
                }

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
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
                if (!Checkers.isNumber(init) || !Checkers.isFunction(func)) {
                    throw valueError(
                        `incorrect input values:  initial value < ${init} >, function < ${func} >`,
                    )
                }

                const num = n == null ? 100 : Checkers.isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
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
                if (!Checkers.isNumber(r) || !Checkers.isNumber(h)) {
                    throw valueError(`incorrect input values:  r < ${r} >, h < ${h} >`)
                }

                const num = N == null ? 150 : Checkers.isIntNumber(N) && N > 0 ? N : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
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
        }
    }

    export namespace Numerals {
        import vector = Helpers.vector
        import memoizer = Helpers.memoizer

        export const fibonacci = memoizer([0, 1], (recur, n) => {
            return recur(n - 1 + recur(n - 2))
        })

        export const fibonacci2 = (() => {
            const memo = [0, 1]

            const fib = (num: number): number => {
                let result = memo[num]
                if (!Checkers.isNumber(result)) {
                    result = fib(num - 1) + fib(num - 2)
                    memo[num] = result
                }
                return result
            }

            return fib
        })()

        export const fibonacci3 = (num: number): number[] => {
            if (!Checkers.isIntNumber(num) || num < 0) {
                throw valueError(`incorrect input value: count < ${num} >`)
            }

            const res: number[] = []
            let next,
                n = 0,
                a = 0,
                b = 1

            const nextFibonacci = (): number => {
                next = a + b
                return (b = ((a = b), next))
            }

            while (n++ < num) {
                res.push(nextFibonacci())
            }

            return res
        }

        export const fibonacci4 = (num: number): number[] => {
            if (!Checkers.isIntNumber(num) || num < 0) {
                throw valueError(`incorrect input string: value < ${num} >`)
            }

            const res = [0, 1]
            for (let i = 2; i < num; res.push(res[i - 1] + res[i - 2]), i++) {
                // empty
            }

            return res
        }

        export const fibonacci5 = (() => {
            const map = [
                '0',
                '1',
                '1',
                '2',
                '3',
                '5',
                '8',
                '13',
                '21',
                '34',
                '55',
                '89',
                '144',
                '233',
                '377',
                '610',
                '987',
                '1597',
                '2584',
                '4181',
                '6765',
                '10946',
                '17711',
                '28657',
                '46368',
                '75025',
                '121393',
                '196418',
                '317811',
                '514229',
                '832040',
                '1346269',
                '2178309',
                '3524578',
                '5702887',
                '9227465',
                '14930352',
                '24157817',
                '39088169',
                '63245986',
                '102334155',
                '165580141',
                '267914296',
                '433494437',
                '701408733',
                '1134903170',
                '1836311903',
                '2971215073',
                '4807526976',
                '7778742049',
                '12586269025',
                '20365011074',
                '32951280099',
                '53316291173',
                '86267571272',
                '139583862445',
                '225851433717',
                '365435296162',
                '591286729879',
                '956722026041',
                '1548008755920',
                '2504730781961',
                '4052739537881',
                '6557470319842',
                '10610209857723',
                '17167680177565',
                '27777890035288',
                '44945570212853',
                '72723460248141',
                '117669030460994',
                '190392490709135',
                '308061521170129',
                '498454011879264',
                '806515533049393',
                '1304969544928657',
                '2111485077978050',
                '3416454622906707',
                '5527939700884757',
                '8944394323791464',
                '14472334024676221',
                '23416728348467685',
                '37889062373143906',
                '61305790721611591',
                '99194853094755497',
                '160500643816367088',
                '259695496911122585',
                '420196140727489673',
                '679891637638612258',
                '1100087778366101931',
                '1779979416004714189',
                '2880067194370816120',
                '4660046610375530309',
                '7540113804746346429',
                '12200160415121876738',
                '19740274219868223167',
                '31940434634990099905',
                '51680708854858323072',
                '83621143489848422977',
                '135301852344706746049',
                '218922995834555169026',
                '354224848179261915075',
            ]

            return (n: number) => {
                if (!Checkers.isIntNumber(n)) {
                    throw valueError(`incorrect input argument: fibonacci sequence number < ${n} >`)
                }

                if (n < 0 || n >= map.length) {
                    throw valueError(
                        `incorrect input value: fibonacci sequence number < ${n} > is out of range [0, ${map.length}]`,
                    )
                }

                return map[n]
            }
        })()

        export const factorial = memoizer([1, 1], (recur, n) => {
            return n * recur(n - 1)
        })

        export const factorial2 = (num: number): number => {
            if (!Checkers.isIntNumber(num) || num < 0) {
                throw valueError(`incorrect input parameter: factorial (n!) < ${num} >`)
            }

            let val = 1
            for (let i = num; i > 1; i--) {
                val *= i
            }

            return val
        }

        export const factorial3 = (num: number): number[] => {
            if (!Checkers.isIntNumber(num) || num < 0) {
                throw valueError(`incorrect input parameters: max number < ${num} >`)
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

        export const factorial5 = (num: number): number => {
            const cache = {
                0: 1,
                1: 1,
            }

            const factorial_ = (num: number): number => {
                if (!cache[num]) {
                    cache[num] = num * factorial_(num - 1)
                }
                return cache[num]
            }

            return factorial_(num)
        }

        export const factfact = (value: number): number => {
            if (!Checkers.isIntNumber(value) || value < 0) {
                throw valueError(`incorrect input value: num < ${value} >`)
            }

            let res = 1
            if (value === 0 || value === 1) {
                return res
            }

            for (let i = value; i > 0; i -= 1) {
                res *= i
            }

            return res
        }
    }

    export namespace Vectors {
        import Trigonometry = Calculations.Trigonometry

        export type Vector2D = { x: number; y: number }
        export type Vector3D = { x: number; y: number; z: number }

        /**
         * Point class
         */
        export class Point2D {
            constructor(public x = 0, public y = 0) {
                this.x = x
                this.y = y
            }

            static overlap(a: Point2D, b: Point2D): boolean {
                return a.x <= b.x && a.y >= b.y && a.x >= b.x && a.y <= b.y
            }
        }

        /**
         * Point intersection class
         */
        export class Intersection {
            constructor(private status = '', private readonly points: Point2D[] = []) {
                this.status = status
                this.points = points
            }

            /**
             * Appends a point to intersection
             * @param {Point2D} point
             * @return {Intersection} thisArg
             * @chainable
             */
            appendPoint(point: Point2D): this {
                this.points.push(point)
                return this
            }

            /**
             * Appends points to intersection
             * @return {Intersection} thisArg
             * @chainable
             * @param points
             */
            appendPoints(points: Point2D[]): this {
                this.points.concat(...points)
                return this
            }

            /**
             * Returns {@link Array} of {@link Point2D}s
             */
            getPoints(): Point2D[] {
                return [...this.points]
            }

            /**
             * Returns {@link string} status
             */
            getStatus(): string {
                return this.status
            }

            /**
             * Update {@link string} status
             */
            setStatus(status: string): void {
                this.status = status
            }

            /**
             * Checks if one line intersects another by input collection of {@link Point2D}s
             * @static
             * @param a1 initial input {@link {Point2D}
             * @param a2 initial input {@link {Point2D}
             * @param b1 initial input {@link {Point2D}
             * @param b2 initial input {@link {Point2D}
             * @return {@link Intersection}
             */
            static intersectLineLine(a1: Point2D, a2: Point2D, b1: Point2D, b2: Point2D): Intersection {
                let result

                const uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)
                const ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)
                const uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y)

                if (uB !== 0) {
                    const ua = uaT / uB,
                        ub = ubT / uB
                    if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                        result = new Intersection('Intersection')
                        result.appendPoint(new Point2D(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)))
                    } else {
                        result = new Intersection()
                    }
                } else {
                    if (uaT === 0 || ubT === 0) {
                        result = new Intersection('Coincident')
                    } else {
                        result = new Intersection('Parallel')
                    }
                }

                return result
            }

            /**
             * Checks if line intersects polygon by input collection of {@link Point2D}s
             * fix detection of coincident
             * @static
             * @param a1 initial input {@link {Point2D}
             * @param a2 initial input {@link {Point2D}
             * @param points input {@link Array} of {@link Point2D}s
             * @return {@link Intersection}
             */
            static intersectLinePolygon(a1: Point2D, a2: Point2D, points: Point2D[]): Intersection {
                const result = new Intersection()
                const length = points.length

                for (let i = 0; i < length; i++) {
                    const b1: Point2D = points[i]
                    const b2: Point2D = points[(i + 1) % length]
                    const inter = Intersection.intersectLineLine(a1, a2, b1, b2)

                    result.appendPoints(inter.points)
                }

                if (result.points.length > 0) {
                    result.status = 'Intersection'
                }

                return result
            }

            /**
             * Checks if polygon intersects another polygon
             * @static
             * @param points1 input {@link Array} of {@link Point2D}s
             * @param points2 input {@link Array} of {@link Point2D}s
             * @return {@link Intersection}
             */
            static intersectPolygonPolygon(points1: Point2D[], points2: Point2D[]): Intersection {
                const result = new Intersection()
                const length = points1.length

                for (let i = 0; i < length; i++) {
                    const a1 = points1[i]
                    const a2 = points1[(i + 1) % length]
                    const inter = Intersection.intersectLinePolygon(a1, a2, points2)

                    result.appendPoints(inter.points)
                }
                if (result.points.length > 0) {
                    result.status = 'Intersection'
                }

                return result
            }

            // /**
            //  * Checks if polygon intersects rectangle
            //  * @static
            //  * @param r1 {@link Point2D}
            //  * @param r2 {@link Point2D}
            //  * @param points {@link Array} of {@link Point2D}s
            //  * @return {@link Intersection}
            //  */
            // intersectPolygonRectangle(r1: Point2D, r2: Point2D, ...points: Point2D[]): Intersection {
            //     const min = r1.min(r2)
            //     const max = r1.max(r2)
            //     const topRight = new Point2D(max.x, min.y)
            //     const bottomLeft = new Point2D(min.x, max.y)
            //     const inter1 = Intersection.intersectLinePolygon(min, topRight, points)
            //     const inter2 = Intersection.intersectLinePolygon(topRight, max, points)
            //     const inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points)
            //     const inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points)
            //     const result = new Intersection()
            //
            //     result.appendPoints(inter1.points)
            //     result.appendPoints(inter2.points)
            //     result.appendPoints(inter3.points)
            //     result.appendPoints(inter4.points)
            //
            //     if (result.points.length > 0) {
            //         result.status = 'Intersection'
            //     }
            //
            //     return result
            // }
        }

        /**
         * Rotates `vector` with `radians`
         * @param {Object} vector The vector to rotate (x and y)
         * @param {Number} radians The radians of the angle for the rotation
         * @return {Object} The new rotated point
         */
        export const rotateVector = (vector: Vector2D, radians: number): Vector2D => {
            const sinValue = Trigonometry.sin(radians)
            const cosValue = Trigonometry.cos(radians)

            const x = vector.x * cosValue - vector.y * sinValue
            const y = vector.x * sinValue + vector.y * cosValue

            return { x, y }
        }

        export const rangeVector = (min: number, max: number, delta: number): number[] => {
            const res: number[] = []

            const minValue = Checkers.isNumber(min) ? min : null
            if (Checkers.isNull(minValue)) {
                throw valueError(`incorrect {min} value: < ${min} >`)
            }

            const maxValue = Checkers.isNumber(max) ? max : null
            if (Checkers.isNull(maxValue)) {
                throw valueError(`incorrect {max} value: < ${max} >`)
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (minValue > maxValue) {
                throw valueError(`incorrect range size: min < ${minValue} >, max < ${maxValue} >`)
            }

            const deltaValue = delta == null ? 1 : Checkers.isNumber(delta) && delta > 0 ? delta : null
            if (Checkers.isNull(deltaValue)) {
                throw valueError(`incorrect {delta} value: < ${delta} >`)
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
    }
}
