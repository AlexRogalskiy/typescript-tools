import { Checkers, Errors, Maths } from '../src'
import Helpers = Maths.Helpers
import valueError = Errors.valueError
import isArray = Checkers.isArray
import isNumber = Checkers.isNumber

export class Matrix {
    private readonly matrix: number[][]

    static isMatrix = (value: any): boolean => {
        return value instanceof Matrix
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

        return new Matrix(mi2, mj1, result)
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
}
