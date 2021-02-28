import { Checkers, Errors, Maths, Matrices } from '../src'
import Helpers = Maths.Helpers
import valueError = Errors.valueError
import isArray = Checkers.isArray
import isNumber = Checkers.isNumber
import isIntNumber = Checkers.isIntNumber
import getSubMatrix = Matrices.getSubMatrix
import calculateDeterminant = Matrices.calculateDeterminant
import isFunction = Checkers.isFunction

export class Matrix {
    private readonly matrix: number[][]

    static isMatrix = (value: any): boolean => {
        return value instanceof Matrix
    }

    static from(rows: number, cols: number, values?: number[][]): Matrix {
        return new Matrix(rows, cols, values)
    }

    static fromMatrix(matrix: number[][]): Matrix {
        if (!isArray(matrix) || !isArray(matrix[0])) {
            throw valueError(`not matrix instance: < ${matrix} >`)
        }

        return new Matrix(matrix.length, matrix[0].length, matrix)
    }

    constructor(private readonly rows: number, private readonly cols: number, values?: number[][]) {
        this.rows = rows
        this.cols = cols

        this.matrix = Helpers.matrix(this.rows, this.cols, 0)

        if (values && isArray(values)) {
            for (let i = 0; i < values.length; i++) {
                for (let j = 0; isArray(values[i]) && j < values[i].length; j++) {
                    this.matrix[i][j] = values[i][j]
                }
            }
        }
    }

    multiply(matrix2: Matrix): Matrix {
        if (!Matrix.isMatrix(matrix2)) {
            throw valueError(`not matrix instance: < ${matrix2} >`)
        }

        const mi2 = matrix2.rows,
            mj2 = matrix2.cols
        const mi1 = this.rows,
            mj1 = this.cols

        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mj1 !== mi2) {
            throw valueError(`incorrect matrix size: matrix1=[${mi1}, ${mj1}], matrix2=[${mi2}, ${mj2}]`)
        }

        const result = Helpers.matrix(mi2, mj1, 0)
        for (let i = 0; i < mi2; i++) {
            for (let j = 0; j < mj1; j++) {
                for (let k = 0; k < mj1; k++) {
                    result[i][j] += this.matrix[i][k] * matrix2.matrix[k + 1][j + 1]
                }
            }
        }

        return Matrix.fromMatrix(result)
    }

    sum(matrix2: Matrix): Matrix {
        if (!Matrix.isMatrix(matrix2)) {
            throw valueError(`not matrix instance: < ${matrix2} >`)
        }

        const mi2 = matrix2.rows,
            mj2 = matrix2.cols
        const mi1 = this.rows,
            mj1 = this.cols

        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) {
            throw valueError(`incorrect matrix size: matrix1=[${mi1}, ${mj1}], matrix2=[${mi2}, ${mj2}]`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                this.matrix[i][j] += matrix2.matrix[i + 1][j + 1]
            }
        }

        return this
    }

    diff(matrix2: Matrix): Matrix {
        if (!Matrix.isMatrix(matrix2)) {
            throw valueError(`not matrix instance: < ${matrix2} >`)
        }

        const mi2 = this.rows,
            mj2 = matrix2.rows
        const mi1 = this.cols,
            mj1 = this.cols

        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) {
            throw valueError(`incorrect matrix size: matrix1=[${mi1}, ${mj1}], matrix2=[${mi2}, ${mj2}]`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                this.matrix[i][j] -= matrix2.matrix[i + 1][j + 1]
            }
        }

        return this
    }

    multiplyScalar(value: number): Matrix {
        if (!isNumber(value)) {
            throw valueError(`incorrect input scalar value < ${value} >`)
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= value
            }
        }

        return this
    }

    div(value: number): Matrix {
        if (!isNumber(value) || value === 0) {
            throw valueError(`incorrect input value: divider < ${value} >`)
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] /= value
            }
        }

        return this
    }

    det(): number {
        const mi1 = this.rows,
            mj1 = this.cols

        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const i = 1
        let result = 0
        for (let j = 0; j < mj1; j++) {
            result +=
                Math.pow(-1, i + j + 1) *
                this.matrix[i - 1][j] *
                calculateDeterminant(getSubMatrix(i - 1, j, this.matrix))
        }

        return result
    }

    normalize(): Matrix {
        const det = this.det()
        if (det === 0) {
            throw valueError(`incorrect matrix determinant: < ${det} >`)
        }

        const result = new Matrix(this.rows, this.cols)
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.matrix[i][j] = this.matrix[i][j] / det
            }
        }

        return result
    }

    nullMatrix(): Matrix {
        const result = this.transpose()

        let k1,
            k2,
            s1 = result[0][1],
            s2 = result[result.rows - 1][result[result.rows - 1].length - 2],
            j1 = 1,
            j2 = result[result.rows - 1].length - 2
        for (let i = 0; i < result.rows; i++) {
            k1 = k2 = 0
            for (let j = 0; j < result[i].length; j++) {
                if (j > i) {
                    k1 += result[i][j]
                } else {
                    if (j < i) {
                        k2 += result[i][j]
                    }
                }
            }
            if (s1 < k1) {
                s1 = k1
                j1 = i
            }
            if (s2 > k2 && i < result[i].length - 1) {
                s2 = k2
                j2 = i
            }
        }
        for (let i = 0; i < result.rows; i++) {
            if (i < j1) {
                result[j1][i] = 0
            }
            if (i > j2) {
                result[j2][i] = 0
            }
        }

        return result.transpose()
    }

    transpose(): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const result = new Matrix(mj1, mi1)
        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                //for(var i=1; i<mi1; i++) {
                //	for(var j=0; j<i; j++) {
                //let temp = matrix1[i][j];
                //matrix1[i][j] = matrix1[j][i];
                //matrix1[j][i] = temp;
                result.matrix[i][j] = this.matrix[j][i]
            }
        }

        return result
    }

    sort(): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const result = this.nativeCopy() //this.matrix.slice(0)
        let mi, mj, temp
        for (let i = 0; i < mi1 * mj1; i++) {
            for (let j = 0; j < mi1 * mj1; j++) {
                mi = Math.floor(i / mj1)
                mj = Math.floor(j / mj1)
                if (result[mi][i % mj1] < result[mj][j % mj1]) {
                    temp = result[mi][i % mj1]
                    result[mi][i % mj1] = result[mj][j % mj1]
                    result[mj][j % mj1] = temp
                }
            }
        }

        return Matrix.fromMatrix(result)
    }

    identity(): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const result = new Matrix(mi1, mj1)
        for (let i = 0; i < mj1; i++) {
            result.matrix[i][i] = 1
        }

        return result
    }

    equals(matrix2: Matrix): boolean {
        if (!Matrix.isMatrix(matrix2)) {
            throw valueError(`not matrix instance: < ${matrix2} >`)
        }

        const mi2 = matrix2.rows,
            mj2 = matrix2.cols
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) {
            throw valueError(`incorrect matrix size: matrix1<${mi1}, ${mj1}>, matrix2<${mi2}, ${mj2}>`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                if (this.matrix[i][j] !== matrix2.matrix[i + 1][j + 1]) {
                    return false
                }
            }
        }

        return true
    }

    getRows(): number {
        return this.matrix.length
    }

    getColumnsNum(): number {
        return isArray(this.matrix[0]) ? this.matrix[0].length : 0
    }

    getElementAt(i, j): number {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isIntNumber(i) || !isIntNumber(j) || i < 1 || j < 1 || i > mi1 || j > mj1) {
            throw valueError(`incorrect input values: row < ${i} >, column <${j} >`)
        }

        return this.matrix[i - 1][j - 1]
    }

    setElementAt(i: number, j: number, value: number): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isIntNumber(i) || !isIntNumber(j) || !isNumber(value) || i < 1 || j < 1 || i > mi1 || j > mj1) {
            throw valueError(`incorrect input values: row < ${i} >, column <${j} >, value < ${value} >`)
        }

        this.matrix[i - 1][j - 1] = value

        return this
    }

    isRowsInEqual(): boolean {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                for (let k = j + 1; j < mj1; j++) {
                    if (this.matrix[i][j] === this.matrix[i][k]) {
                        return false
                    }
                }
            }
        }

        return true
    }

    isColumnsInEqual(): boolean {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                for (let k = j + 1; j < mi1; j++) {
                    if (this.matrix[i][j] === this.matrix[k][j]) {
                        return false
                    }
                }
            }
        }

        return true
    }

    isLatinSquare(): boolean {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        for (let i = 0; i < mj1; i++) {
            for (let j = 0; j < mj1; j++) {
                if (this.matrix[i][j] < 1 || this.matrix[i][j] > mi1) {
                    return false
                }
            }
        }
        for (let i = 0; i < mj1; i++) {
            for (let j = 0; j < mj1; j++) {
                for (let k = j + 1; k < mj1; k++) {
                    if (this.matrix[i][j] === this.matrix[i][k]) {
                        return false
                    }
                }
            }
        }
        for (let i = 0; i < mj1; i++) {
            for (let j = 0; j < mj1; j++) {
                for (let k = j + 1; k < mj1; k++) {
                    if (this.matrix[i][j] === this.matrix[k][j]) {
                        return false
                    }
                }
            }
        }
    }

    sumGDiagonal(): number {
        const mi1 = this.rows,
            mj1 = this.cols

        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        let sum = 0
        for (let i = 0; i < mj1; i++) {
            sum += this.matrix[i][i]
        }

        return sum
    }

    prodADiagonal(): number {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        let prod = 1
        for (let i = 0; i < mj1; i++) {
            prod *= this.matrix[i][mj1 - i - 1]
        }

        return prod
    }

    invert(): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const det = this.det()
        if (det === 0) {
            throw valueError(`incorrect matrix determinant: < ${det} >`)
        }

        const result = new Matrix(mi1, mj1)
        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; i++) {
                result[i][j] =
                    (Math.pow(-1, i + j) * calculateDeterminant(getSubMatrix(i, j, this.matrix))) / det
            }
        }

        return result
    }

    subMatrix(i: number, j: number): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isIntNumber(i) || !isIntNumber(j) || i < 1 /*|| i > mi1 */ || j < 1 /*|| j > mj1*/) {
            throw valueError(`incorrect input values: row < ${i} >, column < ${j} >`)
        }

        i = (i - 1) % mi1
        j = (j - 1) % mj1

        const subMatrix: number[][] = []
        for (let ii = 0; ii < mi1; ii++) {
            if (ii === i) continue
            const tmp: number[] = []
            for (let jj = 0; jj < mj1; jj++) {
                if (jj === j) continue
                tmp.push(this.matrix[ii][jj])
            }
            subMatrix.push(tmp)
        }

        return Matrix.fromMatrix(subMatrix)
    }

    each(func): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isFunction(func)) {
            throw valueError(`incorrect function value < ${func} >`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; i++) {
                this.matrix[i][j] = func(this.matrix[i][j])
            }
        }

        return this
    }

    shiftRows(shift: number): Matrix {
        const mi1 = this.rows,
            mj1 = this.cols

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const shiftValue = shift == null ? 1 : isIntNumber(shift) ? shift % mi1 : null
        if (shiftValue == null) {
            throw valueError(`incorrect shift value < ${shiftValue} >`)
        }

        const sign = shift > 0 ? 1 : 0
        let index = Math.abs(shiftValue)
        while (index > 0) {
            if (sign) {
                const temp = this.matrix[mi1 - 1]
                for (let i = mi1 - 1; i > 0; i--) {
                    this.matrix[i] = this.matrix[i - 1]
                }
                this.matrix[0] = temp
            } else {
                const temp = this.matrix[0]
                for (let i = 1; i < mi1; i++) {
                    this.matrix[i - 1] = this.matrix[i]
                }
                this.matrix[mi1 - 1] = temp
            }
            index--
        }

        return this
    }
}
