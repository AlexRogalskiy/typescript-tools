import { Checkers } from './checkers'
import { Errors } from './errors'
import { Processor } from '../typings/function-types'

export namespace Maths {
    import isIntNumber = Checkers.isIntNumber
    import isNumber = Checkers.isNumber
    import isString = Checkers.isString
    import isNull = Checkers.isNull
    import valueError = Errors.valueError
    import isFunction = Checkers.isFunction
    import isArray = Checkers.isArray
    import isRealNumber = Checkers.isRealNumber
    import typeError = Errors.typeError
    import isObject = Checkers.isObject

    export const sqrt = Math.sqrt
    export const atan2 = Math.atan2
    export const pow = Math.pow
    export const abs = Math.abs
    export const PiBy180 = Math.PI / 180
    export const PiBy180Inv = 180 / Math.PI
    export const PiBy2 = Math.PI / 2
    export const invLog2 = 1 / Math.log(2)

    export namespace Helpers {
        export const memoizer = (
            memo: number[],
            formula: (func: (num: number) => number, value: number) => number,
        ): ((num: number) => void) => {
            if (!isArray(memo)) {
                throw valueError(`incorrect input parameter: initial array < ${memo} >`)
            }
            if (!isFunction(formula)) {
                throw valueError(`incorrect formula function: function < ${formula} >`)
            }

            const recur = (num: number): number => {
                let result = memo[num]
                if (!isNumber(result)) {
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
            if (!isNumber(value)) {
                throw typeError(`incorrect type of argument: degrees < ${value} >`)
            }

            return value * PiBy180
        }

        export const toDegrees = (value: number): number => {
            if (!isNumber(value)) {
                throw typeError(`incorrect type of argument: radians < ${value} >`)
            }

            return value * PiBy180Inv
        }

        export const vector = <T>(dimension: number, initial: T): T[] => {
            if (!isIntNumber(dimension) || dimension < 0) {
                throw valueError(`incorrect input values: array dimension < ${dimension} >`)
            }

            const arr: T[] = []
            for (let i = 0; i < dimension; i++) {
                arr[i] = initial
            }

            return arr
        }

        export const matrix = <T>(rows: number, columns: number, initial: T): T[][] => {
            if (!isIntNumber(rows) || !isIntNumber(columns) || rows < 0 || columns < 0) {
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
            if (!isString(a) || !isString(b)) {
                throw valueError(`incorrect input values: string1 < ${a} >, string2 < ${b} >`)
            }

            if (a.length === 0 || b.length === 0) {
                return null
            }

            const insValue = ins == null ? 2 : isNumber(ins) && ins >= 0 ? ins : null
            if (insValue == null) {
                throw valueError(`incorrect ins value: < ${insValue} >`)
            }

            const delValue = del == null ? 2 : isNumber(del) && del >= 0 ? del : null
            if (delValue == null) {
                throw valueError(`incorrect del value: < ${delValue} >`)
            }

            const subValue = sub == null ? 1 : isNumber(sub) && sub >= 0 ? sub : null
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
            if (!isString(s1) || !isString(s2)) {
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
            if (!isString(a) || !isString(b)) {
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
            if (!isString(seq1) || !isString(seq2)) {
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
            if (!isString(a) || !isString(b)) {
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
                if (!isNumber(radius) || radius < 0) {
                    throw valueError(`incorrect radius value: radius < ${radius} >`)
                }

                return (Math.PI * radius * radius).toFixed(2)
            }

            export const squareArea = (a: number): string => {
                if (!isNumber(a) || a < 0) {
                    throw valueError(`incorrect side value: side < ${a} >`)
                }

                return (a * a).toFixed(2)
            }

            export const rectangularArea = (a: number, b: number): string => {
                if (!isNumber(a) || !isNumber(b) || a < 0 || b < 0) {
                    throw valueError(`incorrect side values: a < ${a} >, b < ${b} >`)
                }

                return (a * b).toFixed(2)
            }

            export const triangleArea = (a: number, b: number, c: number): string => {
                if (!isNumber(a) || !isNumber(b) || !isNumber(c) || a < 0 || b < 0 || c < 0) {
                    throw valueError(`incorrect side values: a < ${a} >, b < ${b} >, c < ${c} >`)
                }

                const s = (a + b + c) / 2
                return Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2)
            }

            export const trapeziumArea = (a: number, b: number, h: number): string => {
                if (!isNumber(a) || !isNumber(b) || !isNumber(h) || a < 0 || b < 0 || h < 0) {
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
        }

        export namespace Integrals {
            // Метод касательных (метод Ньютона)
            export const newton = (x0: number, x: number, e: number, func1, func2): number => {
                if (
                    !isNumber(x0) ||
                    !isNumber(x) ||
                    !isNumber(e) ||
                    !isFunction(func1) ||
                    !isFunction(func2)
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
                if (!isNumber(a) || !isNumber(b) || !isNumber(x) || !isNumber(e) || !isFunction(func)) {
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
                if (!isNumber(x0) || !isNumber(x) || !isNumber(e) || !isFunction(func)) {
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
                if (!isNumber(a) || !isNumber(b) || !isNumber(e) || !isFunction(func)) {
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
                if (!isNumber(a) || !isNumber(b) || !isFunction(func)) {
                    throw valueError(
                        `incorrect input values: lower border < ${a} >, upper border < ${b} >, function < ${func} >`,
                    )
                }

                const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
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
                if (!isArray(arrayX) || !isArray(arrayY) || !isNumber(x)) {
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

                const num = n == null ? 9 : isIntNumber(n) && n > 0 ? n : null
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

                if (!isNumber(value) || !isFunction(func)) {
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
                if (!isObject(polygon)) {
                    throw valueError(`incorrect input value: {polygon} not an object < ${polygon} >`)
                }

                if (
                    !Object.prototype.hasOwnProperty.call(polygon, 'arrayX') ||
                    !Object.prototype.hasOwnProperty.call(polygon, 'arrayY') ||
                    !isArray(polygon['arrayX']) ||
                    !isArray(polygon['arrayY'])
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

                if (!isObject(point)) {
                    throw valueError(`incorrect input values: {point} is not object < ${point} >`)
                }

                if (
                    !Object.prototype.hasOwnProperty.call(point, 'x') ||
                    !Object.prototype.hasOwnProperty.call(point, 'y') ||
                    !isNumber(point['x']) ||
                    !isNumber(point['arrayY'])
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
                if (!isObject(startCoords) || !isObject(destCoords)) {
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
                if (!isArray(arrayOfCoords)) {
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
                    if (!isObject(point)) {
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

                    if (!isNumber(point['lon']) || !isArray(point['lat'])) {
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

            export const getMedian = (array1, array2, left, right, n): number => {
                if (left > right) {
                    return getMedian(array2, array1, 0, n - 1, n)
                }
                const i = Math.floor(left + right) / 2
                const j = n - i - 1

                if (array1[i] > array2[j] && (j === n - 1 || array1[i] <= array2[j + 1])) {
                    if (i === 0 || array2[j] > array1[i - 1]) {
                        return (array1[i] + array2[j]) / 2
                    }
                    return (array1[i] + array1[i - 1]) / 2
                } else if (array1[i] > array2[j] && j !== n - 1 && array1[i] > array2[j + 1]) {
                    return getMedian(array1, array2, left, i - 1, n)
                }
                return getMedian(array1, array2, i + 1, right, n)
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
                    throw valueError(`incorrect input parameter: array < ${str} >`)
                }
                permute(str)

                return permArr
            }

            export const exp = (value: number, n: number): number => {
                if (!isNumber(value)) {
                    throw valueError(
                        `incorrect input values:  value< ${value} >, number of iterations < ${n} >`,
                    )
                }

                const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
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
                if (!isArray(array) || !isNumber(init)) {
                    throw valueError(`incorrect input values:  array < ${array} >, initial value < ${init} >`)
                }

                const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
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
                if (!isNumber(init) || !isFunction(func)) {
                    throw valueError(
                        `incorrect input values:  initial value < ${init} >, function < ${func} >`,
                    )
                }

                const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
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
                if (!isNumber(r) || !isNumber(h)) {
                    throw valueError(`incorrect input values:  r < ${r} >, h < ${h} >`)
                }

                const num = N == null ? 150 : isIntNumber(N) && N > 0 ? N : null
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
                    throw typeError(
                        `incorrect input argument: {number of points} is not positive integer number < ${num} >`,
                    )
                }

                if (!isFunction(func)) {
                    throw typeError(`incorrect input argument: not a function < ${func} >`)
                }

                if (!isNumber(low)) {
                    throw typeError(`incorrect input argument: {low} is not number < ${low} >`)
                }

                if (!isNumber(high)) {
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

            export const sinus = (a: number, b: number, h: number, eps: number): number[] => {
                if (!isNumber(a) || !isNumber(b) || !isNumber(h) || !isNumber(eps)) {
                    throw valueError(
                        `incorrect input values: lower border < ${a} >, upper border < ${b} >, step < ${h} >, precision < ${eps} >`,
                    )
                }

                const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
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
                if (!isNumber(x)) {
                    throw valueError(`incorrect input values: x < ${x} >`)
                }

                const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
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
                if (!isNumber(x) || !isRealNumber(e) || e <= 0 || e >= 1) {
                    throw valueError(`incorrect input values: x < ${x} >, precision < ${e} >`)
                }

                const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
                if (num === null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
                }

                const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
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
                if (!isNumber(x) || !isRealNumber(e) || e <= 0 || e >= 1) {
                    throw valueError(`incorrect input values: x < ${x} >, precision < ${e} >`)
                }

                const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
                if (num == null) {
                    throw valueError(`incorrect 'number of iterations' value: < ${num} >`)
                }

                const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
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
                const num = n == null ? 100 : isIntNumber(n) && n > 0 ? n : null
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
                if (!isNumber(a) || a < 0) {
                    throw valueError(`incorrect input value: expression < ${a} >`)
                }

                const precision = eps == null ? 0.0001 : isNumber(eps) && eps > 0 ? eps : null
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
                if (!isNumber(a) || a < 0) {
                    throw valueError(`incorrect input value: expression < ${a} >`)
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
                    throw valueError(`incorrect input value: z < ${z} >`)
                }

                let s = z,
                    g = z

                const num = n == null ? 100 : isIntNumber(n) && n >= 1 ? n : null
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
                if (!isNumber(z)) {
                    throw valueError(`incorrect input value: z < ${z} >`)
                }

                let s = 1,
                    g = 1

                const num = n == null ? 100 : isIntNumber(n) && n >= 1 ? n : null
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
        }
    }

    export namespace Factorials {
        import vector = Helpers.vector
        import memoizer = Helpers.memoizer

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
                throw valueError(`incorrect input parameter: factorial (n!) < ${num} >`)
            }

            let val = 1
            for (let i = num; i > 1; i--) {
                val *= i
            }

            return val
        }

        export const factorial3 = (num: number): number[] => {
            if (!isIntNumber(num) || num < 0) {
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
    }

    export namespace Vectors {
        import Algebra = Calculations.Algebra

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
            const sinValue = Algebra.sin(radians)
            const cosValue = Algebra.cos(radians)

            const x = vector.x * cosValue - vector.y * sinValue
            const y = vector.x * sinValue + vector.y * cosValue

            return { x, y }
        }

        export const rangeVector = (min: number, max: number, delta: number): number[] => {
            const res: number[] = []

            const minValue = isNumber(min) ? min : null
            if (isNull(minValue)) {
                throw valueError(`incorrect {min} value: < ${min} >`)
            }

            const maxValue = isNumber(max) ? max : null
            if (isNull(maxValue)) {
                throw valueError(`incorrect {max} value: < ${max} >`)
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (minValue > maxValue) {
                throw valueError(`incorrect range size: min < ${minValue} >, max < ${maxValue} >`)
            }

            const deltaValue = delta == null ? 1 : isNumber(delta) && delta > 0 ? delta : null
            if (isNull(deltaValue)) {
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
