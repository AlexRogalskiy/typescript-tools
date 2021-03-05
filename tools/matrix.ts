import { Checkers, Comparators, Errors, Maths, Matrices } from '../src'
import Helpers = Maths.Helpers
import valueError = Errors.valueError
import isArray = Checkers.isArray
import isNumber = Checkers.isNumber
import isIntNumber = Checkers.isIntNumber
import getSubMatrix = Matrices.getSubMatrix
import calculateDeterminant = Matrices.calculateDeterminant
import isFunction = Checkers.isFunction
import isBoolean = Checkers.isBoolean
import Comparator = Comparators.Comparator
import checkNumber = Checkers.checkNumber
import checkArray = Checkers.checkArray
import checkIntNumber = Checkers.checkIntNumber

type MatrixValueType = number

export class Matrix {
    private readonly matrix: MatrixValueType[][]

    static isMatrix = (value: any): boolean => {
        return value instanceof Matrix
    }

    static from(rows: number, cols: number, values?: MatrixValueType[][]): Matrix {
        return new Matrix(rows, cols, values)
    }

    static checkMatrix(value: Matrix): void {
        if (!Matrix.isMatrix(value)) {
            throw valueError(`not valid matrix instance: [ ${value} ]`)
        }
    }

    static fromMatrix(matrix: MatrixValueType[][]): Matrix {
        if (!isArray(matrix) || !isArray(matrix[0])) {
            throw valueError(`not matrix instance: < ${matrix} >`)
        }

        return new Matrix(matrix.length, matrix[0].length, matrix)
    }

    static swapRows<T>(matrix: T[][], col: number, row1: number, row2: number): void {
        const temp = matrix[row1][col]
        matrix[row1][col] = matrix[row2][col]
        matrix[row2][col] = temp
    }

    static swapCols<T>(matrix: T[][], row: number, col1: number, col2: number): void {
        const temp = matrix[row][col1]
        matrix[row][col1] = matrix[row][col2]
        matrix[row][col2] = temp
    }

    constructor(private readonly rows: number, private readonly cols: number, values?: MatrixValueType[][]) {
        this.matrix = Helpers.matrix(this.rows, this.cols, 0)

        if (values && isArray(values)) {
            for (let i = 0; i < values.length; i++) {
                for (let j = 0; isArray(values[i]) && j < values[i].length; j++) {
                    this.matrix[i][j] = values[i][j]
                }
            }
        }
    }

    multiply(matrix: Matrix): Matrix {
        Matrix.checkMatrix(matrix)

        const mi2 = matrix.getRows(),
            mj2 = matrix.getColumns()
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mj1 !== mi2) {
            throw valueError(`incorrect matrix size: matrix1=[${mi1}, ${mj1}], matrix2=[${mi2}, ${mj2}]`)
        }

        const result = Helpers.matrix(mi2, mj1, 0)
        for (let i = 0; i < mi2; i++) {
            for (let j = 0; j < mj1; j++) {
                for (let k = 0; k < mj1; k++) {
                    result[i][j] += this.matrix[i][k] * matrix.matrix[k + 1][j + 1]
                }
            }
        }

        return Matrix.fromMatrix(result)
    }

    sum(matrix: Matrix): Matrix {
        Matrix.checkMatrix(matrix)

        const mi2 = matrix.getRows(),
            mj2 = matrix.getColumns()
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) {
            throw valueError(`incorrect matrix size: matrix1=[${mi1}, ${mj1}], matrix2=[${mi2}, ${mj2}]`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                this.matrix[i][j] += matrix.matrix[i + 1][j + 1]
            }
        }

        return this
    }

    diff(matrix: Matrix): Matrix {
        Matrix.checkMatrix(matrix)

        const mi2 = this.getRows(),
            mj2 = matrix.getRows()
        const mi1 = this.getColumns(),
            mj1 = this.getColumns()

        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) {
            throw valueError(`incorrect matrix size: matrix1=[${mi1}, ${mj1}], matrix2=[${mi2}, ${mj2}]`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                this.matrix[i][j] -= matrix.matrix[i + 1][j + 1]
            }
        }

        return this
    }

    multiplyScalar(value: number): Matrix {
        checkNumber(value)

        for (let i = 0; i < this.getRows(); i++) {
            for (let j = 0; j < this.getColumns(); j++) {
                this.matrix[i][j] *= value
            }
        }

        return this
    }

    divide(value: number): Matrix {
        checkNumber(value)

        if (value === 0) {
            throw valueError(`incorrect input value: divider < ${value} >`)
        }

        for (let i = 0; i < this.getRows(); i++) {
            for (let j = 0; j < this.getColumns(); j++) {
                this.matrix[i][j] /= value
            }
        }

        return this
    }

    det(): number {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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

        const result = new Matrix(this.getRows(), this.getColumns())
        for (let i = 0; i < result.getRows(); i++) {
            for (let j = 0; j < result.getColumns(); j++) {
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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const result = this.nativeCopy()
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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const result = new Matrix(mi1, mj1)
        for (let i = 0; i < mj1; i++) {
            result.matrix[i][i] = 1
        }

        return result
    }

    equals(matrix: Matrix): boolean {
        Matrix.checkMatrix(matrix)

        const mi2 = matrix.getRows(),
            mj2 = matrix.getColumns()
        const mi1 = this.getRows(),
            mj1 = this.getColumns()
        if (mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) {
            throw valueError(`incorrect matrix size: matrix1<${mi1}, ${mj1}>, matrix2<${mi2}, ${mj2}>`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                if (this.matrix[i][j] !== matrix.matrix[i + 1][j + 1]) {
                    return false
                }
            }
        }

        return true
    }

    getRows(): number {
        return this.matrix.length
    }

    getColumns(): number {
        return isArray(this.matrix[0]) ? this.matrix[0].length : 0
    }

    getElementAt(row: number, col: number): number {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isIntNumber(row) || !isIntNumber(col) || row < 1 || col < 1 || row > mi1 || col > mj1) {
            throw valueError(`incorrect input values: row < ${row} >, column <${col} >`)
        }

        return this.matrix[row - 1][col - 1]
    }

    setElementAt(row: number, col: number, value: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (
            !isIntNumber(row) ||
            !isIntNumber(col) ||
            !isNumber(value) ||
            row < 1 ||
            col < 1 ||
            row > mi1 ||
            col > mj1
        ) {
            throw valueError(`incorrect input values: row < ${row} >, column <${col} >, value < ${value} >`)
        }

        this.matrix[row - 1][col - 1] = value

        return this
    }

    isRowsInEqual(): boolean {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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

        return false
    }

    sumGDiagonal(): number {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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

    subMatrix(row: number, col: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isIntNumber(row) || !isIntNumber(col) || row < 1 /*|| i > mi1 */ || col < 1 /*|| j > mj1*/) {
            throw valueError(`incorrect input values: row < ${row} >, column < ${col} >`)
        }

        row = (row - 1) % mi1
        col = (col - 1) % mj1

        const subMatrix: MatrixValueType[][] = []
        for (let ii = 0; ii < mi1; ii++) {
            if (ii === row) continue
            const tmp: MatrixValueType[] = []
            for (let jj = 0; jj < mj1; jj++) {
                if (jj === col) continue
                tmp.push(this.matrix[ii][jj])
            }
            subMatrix.push(tmp)
        }

        return Matrix.fromMatrix(subMatrix)
    }

    each(func): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

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

    shiftColumns(shift: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const shiftValue = shift == null ? 1 : isIntNumber(shift) ? shift % mj1 : null
        if (shiftValue == null) {
            throw valueError(`incorrect shift value < ${shiftValue} >`)
        }

        let index = Math.abs(shift),
            temp
        const sign = shift > 0 ? 1 : 0
        for (let i = 0; i < mi1; i++) {
            while (index > 0) {
                if (sign) {
                    temp = this.matrix[i][mj1 - 1]
                    for (let j = mj1 - 1; j > 0; j--) {
                        this.matrix[i][j] = this.matrix[i][j - 1]
                    }
                    this.matrix[i][0] = temp
                } else {
                    temp = this.matrix[i][0]
                    for (let j = 1; j < mj1; j++) {
                        this.matrix[i][j - 1] = this.matrix[i][j]
                    }
                    this.matrix[i][mj1 - 1] = temp
                }
                index--
            }
        }

        return this
    }

    swapRows(row1: number, row2: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isIntNumber(row1) || !isIntNumber(row2) || row1 < 1 || row2 < 1) {
            throw valueError(`incorrect input value: row1 < ${row1} >, row2 < ${row2} >`)
        }

        if (row1 === row2) {
            return this
        }

        row1 = (row1 - 1) % mi1
        row2 = (row2 - 1) % mi1

        for (let j = 0; j < mj1; j++) {
            Matrix.swapRows(this.matrix, j, row1, row2)
        }

        return this
    }

    swapColumns(col1: number, col2: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        if (!isIntNumber(col1) || !isIntNumber(col2) || col1 < 1 || col2 < 1) {
            throw valueError(`incorrect input value: column1 < ${col1} >, column2 < ${col2} >`)
        }

        if (col1 === col2) {
            return this
        }

        col1 = (col1 - 1) % mj1
        col2 = (col2 - 1) % mj1

        for (let i = 0; i < mi1; i++) {
            Matrix.swapCols(this.matrix, i, col1, col2)
        }

        return this
    }

    sumRows(): MatrixValueType[] {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const sumRow = Helpers.vector(mi1, 0)
        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                sumRow[i] += this.matrix[i][j]
            }
        }

        return sumRow
    }

    sumColumns(): MatrixValueType[] {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const sumColumn = Helpers.vector(mj1, 0)
        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                sumColumn[j] += this.matrix[i][j]
            }
        }

        return sumColumn
    }

    addRow(row: MatrixValueType[] | string[], index: number): Matrix {
        checkArray(row)

        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const ind = index == null ? mi1 : isIntNumber(index) && index >= 1 && index <= mi1 ? index : null
        if (ind == null) {
            throw valueError(`incorrect row index: < ${ind} >`)
        }

        const items: MatrixValueType[] = []
        for (const item of row) {
            items.push(item && typeof item === 'number' ? Number(item) : parseInt(item.toString()))
        }
        this.matrix.splice(ind, 0, items)

        return this
    }

    addColumn(column: MatrixValueType[] | string[], index: number): Matrix {
        checkArray(column)

        const mi1 = this.getRows(),
            mj1 = this.getColumns()
        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const ind = index == null ? mi1 : isIntNumber(index) && index >= 1 && index <= mj1 ? index : null
        if (ind == null) {
            throw valueError(`incorrect column index: < ${ind} >`)
        }

        for (let i = 0; i < mi1; i++) {
            const items: number =
                column[i] && typeof column[i] === 'number'
                    ? Number(column[i])
                    : parseInt(column[i].toString())
            this.matrix[i].splice(ind, 0, items)
        }

        return this
    }

    deleteRow(index: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const ind = index == null ? mi1 : isIntNumber(index) && index >= 1 && index <= mi1 ? index : null
        if (ind == null) {
            throw valueError(`incorrect row index: < ${ind} >`)
        }

        this.matrix.splice(ind - 1, 1)

        return this
    }

    deleteColumn(index: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const ind = index == null ? mi1 : isIntNumber(index) && index >= 1 && index <= mj1 ? index : null
        if (ind == null) {
            throw valueError(`incorrect column index: < ${ind} >`)
        }

        for (let i = 0; i < mi1; i++) {
            this.matrix[i].splice(ind - 1, 1)
        }

        return this
    }

    hasNullRow(): boolean {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        let n = 0
        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                if (this.matrix[i][j] === 0) {
                    n++
                }
            }

            if (n === mj1) return true
        }

        return false
    }

    hasNullColumn(): boolean {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const nullColumns = Helpers.vector(mj1, 0)
        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                if (this.matrix[i][j] === 0) {
                    nullColumns[j]++
                }
            }
        }

        return nullColumns.includes(mi1)
    }

    getMin(): MatrixValueType {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        let min = Number.POSITIVE_INFINITY
        for (let i = 0; i < mi1; i++) {
            min = Math.min(Math.min(...this.matrix[i]), min)
        }

        return min
    }

    getMax(): MatrixValueType {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        let max = Number.NEGATIVE_INFINITY
        for (let i = 0; i < mi1; i++) {
            max = Math.max(Math.max(...this.matrix[i]), max)
        }

        return max
    }

    clone(): Matrix {
        return Matrix.fromMatrix(this.matrix)
    }

    nativeCopy(): MatrixValueType[][] {
        const res: MatrixValueType[][] = []

        for (const item of this.matrix) {
            isArray(item) ? res.push(item.slice(0)) : res.push(item)
        }

        return res
    }

    toString(): string {
        let res = ''

        for (const item of this.matrix) {
            res += item.join(' ').concat('\n')
        }

        return res
    }

    getGauss(): MatrixValueType[] {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0 || mi1 + 1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const tempMatrix = this.clone()
        // Прямой ход
        for (let k = 1; k <= mi1 - 1; k++) {
            for (let i = k + 1; i <= mi1; i++) {
                let rowIndex = 1
                while (tempMatrix.getElementAt(k, k) === 0 && k + rowIndex <= mi1) {
                    tempMatrix.swapRows(k, k + rowIndex)
                    rowIndex++
                }
                const m = tempMatrix.getElementAt(i, k) / tempMatrix.getElementAt(k, k)
                tempMatrix.setElementAt(i, k, 0)
                for (let j = k + 1; j <= mi1; j++) {
                    tempMatrix.setElementAt(
                        i,
                        j,
                        tempMatrix.getElementAt(i, j) - m * tempMatrix.getElementAt(k, j),
                    )
                }
            }
        }

        // Обратный ход
        const arrayX = Helpers.vector(mi1 - 1, 0)
        arrayX[mi1 - 1] = tempMatrix.getElementAt(mi1, mj1) / tempMatrix.getElementAt(mi1, mi1)
        for (let k = mi1 - 1; k >= 1; k--) {
            let sum = 0
            for (let j = k + 1; j <= mi1; j++) {
                sum += tempMatrix.getElementAt(k, j) * arrayX[j - 1]
            }
            arrayX[k - 1] = (tempMatrix.getElementAt(k, mj1) - sum) / tempMatrix.getElementAt(k, k)
        }

        return arrayX
    }

    getDeijkstraPath(start, end): { path: MatrixValueType[]; length: number } {
        checkIntNumber(start)
        checkIntNumber(end)

        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }
        if (start === end || start < 1 || end < 1 || start > mi1 || end > mi1) {
            throw valueError(
                `incorrect input values: start vertex < ${start} >, end vertex < ${end} >, number of vertices < ${mi1} >`,
            )
        }
        // initialization step
        const state = { PASSED: 1, NOTPASSED: 0 }
        const a = Helpers.vector(mi1, state.NOTPASSED)
        const b = this.matrix[start - 1].slice(0)
        const c = Helpers.vector(mi1, start)
        a[start - 1] = state.PASSED
        c[start - 1] = 0

        // general step
        let minVertex, minIndex
        while (a.includes(state.NOTPASSED)) {
            minVertex = Number.POSITIVE_INFINITY
            minIndex = -1
            for (let i = 0; i < mi1; i++) {
                //b.length
                if (b[i] < minVertex && a[i] === state.NOTPASSED) {
                    minVertex = b[i]
                    minIndex = i
                }
            }
            a[minIndex] = state.PASSED
            for (let m = 0; m < mi1; m++) {
                //a.length
                if (a[m] === state.NOTPASSED && minVertex + this.matrix[minIndex][m] < b[m]) {
                    b[m] = minVertex + this.matrix[minIndex][m]
                    c[m] = minIndex + 1
                }
            }
        }

        // output step
        const len = b[end - 1]
        const res: MatrixValueType[] = []

        let z = c[end - 1]
        res.push(end)
        while (z !== 0) {
            res.push(z)
            z = c[z - 1]
        }

        return { path: res.reverse(), length: len }
    }

    getShortestPaths(num: number): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1 || num > mi1 || num > mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const dist = this.nativeCopy()
        for (let k = 0; k < num; k++) {
            for (let i = 0; i < num; i++) {
                for (let j = 0; j < num; j++) {
                    dist[i][j] = Math.min(this.matrix[i][j], this.matrix[i][k] + this.matrix[k][j])
                }
            }
        }

        return Matrix.fromMatrix(dist)
    }

    getMinWeightedPath(num: number, weightedMatrix: Matrix): number {
        Matrix.checkMatrix(weightedMatrix)

        const res = this.getShortestPaths(num)

        return weightedMatrix.multiply(res).getMin()
    }

    getMaxWeightedPath(num: number, weightedMatrix: Matrix): number {
        Matrix.checkMatrix(weightedMatrix)

        const res = this.getShortestPaths(num)

        return weightedMatrix.multiply(res).getMax()
    }

    adductionOnRows(isNullDiagonal: boolean): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const isDiagonal = isNullDiagonal == null ? true : isBoolean(isNullDiagonal) ? isNullDiagonal : null
        if (isDiagonal == null)
            throw valueError(`incorrect parameter: diagonal values included < ${isDiagonal} >`)

        const copy = this.nativeCopy()
        for (let i = 0; i < mi1; i++) {
            const min = isNullDiagonal
                ? Math.min(...copy[i].slice(0, i).concat(copy[i].slice(i + 1)))
                : Math.min(...copy[i])
            for (let j = 0; j < mj1; j++) {
                if (isDiagonal && i === j) continue
                copy[i][j] -= min
            }
        }

        return Matrix.fromMatrix(copy)
    }

    adductionOnColumns(isNullDiagonal: boolean): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0 /* || mi1 !== mj1*/) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const isDiagonal = isNullDiagonal == null ? true : isBoolean(isNullDiagonal) ? isNullDiagonal : null
        if (isDiagonal == null) {
            throw valueError(`incorrect parameter: diagonal values included < ${isDiagonal} >`)
        }

        const copy = this.transpose().nativeCopy()
        for (let i = 0; i < mj1; i++) {
            const min = isNullDiagonal
                ? Math.min(...copy[i].slice(0, i).concat(copy[i].slice(i + 1)))
                : Math.min(...copy[i])
            for (let j = 0; j < mi1; j++) {
                if (isDiagonal && i === j) continue
                copy[i][j] -= min
            }
        }

        return Matrix.fromMatrix(copy).transpose()
    }

    getVertexPath(start: number): MatrixValueType[] {
        checkIntNumber(start)

        const mi1 = this.getRows(),
            mj1 = this.getColumns()
        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }
        if (start < 1 || start > mi1) {
            throw valueError(`incorrect start vertex: < ${start} >`)
        }

        // initialization step
        const state = { PASSED: true, NOTPASSED: false }
        const res = Helpers.vector(mi1, -1)
        const q = Helpers.vector(mi1, 0)
        const r = Helpers.vector(mi1, state.NOTPASSED)

        let a = 0,
            z = 0 // start/end of q
        q[a] = start

        // general step
        do {
            for (let j = 0; j < mi1; j++) {
                if (this.matrix[q[a] - 1][j] !== 0 && r[j] === state.NOTPASSED) {
                    //matrix1[q[a] - 1].indexOf(1) !== -1
                    z++
                    q[z] = j + 1
                    res[j] = q[a]
                    r[j] = state.PASSED
                }
            }
            a++
        } while (a <= z)

        // output step
        return res
    }

    getMaxPairsMatching(): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        // initialization step
        const vertex: MatrixValueType[] = []
        const orientGraph = Helpers.matrix(mi1 + mj1, mi1 + mj1, 0)
        const vertexStatus = { CONNECTED: 1, DISCONNECTED: 0 }
        const state = { SATURATED: 4, NOTSATURATED: 3 }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                if (this.matrix[i][j] === vertexStatus.DISCONNECTED) continue
                if (
                    this.matrix[i][j] === vertexStatus.CONNECTED &&
                    !vertex.includes(i) &&
                    !vertex.includes(j + mi1)
                ) {
                    vertex.push(i)
                    vertex.push(j + mi1)
                    orientGraph[j + mi1][j] = state.SATURATED
                } else {
                    orientGraph[i][j + mi1] = state.NOTSATURATED
                }
            }
        }

        // general step
        let i = 0
        while (++i <= mi1) {
            if (vertex.includes(i - 1)) continue
            const orientPath = this.getVertexPath(i)
            let s = 0,
                ns = 0
            for (let k = 0; k < orientPath.length; k++) {
                if (orientPath[k] !== -1) {
                    orientGraph[orientPath[k] - 1][k] === state.SATURATED ? s++ : ns++
                }
            }
            if (ns > s && ns * s) {
                for (let k = 0; k < orientPath.length; k++) {
                    if (orientPath[k] !== -1) {
                        orientGraph[k][orientPath[k] - 1] =
                            orientGraph[orientPath[k] - 1][k] === state.SATURATED
                                ? state.NOTSATURATED
                                : state.SATURATED
                        orientGraph[orientPath[k] - 1][k] = 0
                    }
                }
                i = 0
            }
        }

        // output step
        const pairsGraph = Helpers.matrix(mi1, mj1, 0)
        for (let i = 0; i < mi1; i++) {
            for (let j = mi1; j < mi1 + mj1; j++) {
                pairsGraph[i][j % mi1] = orientGraph[i][j] === state.SATURATED ? 1 : 0 //orientGraph[i].indexOf(state.SATURATED);
            }
        }
        for (let i = mi1; i < mi1 + mj1; i++) {
            for (let j = 0; j < mi1; j++) {
                pairsGraph[j][i % mi1] = orientGraph[i][j] === state.SATURATED ? 1 : 0 //orientGraph[i].indexOf(state.SATURATED);
            }
        }

        return Matrix.fromMatrix(pairsGraph)
    }

    getMinInRows(func: Comparator<MatrixValueType>): MatrixValueType[] {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0 /* || mi1 !== mj1*/) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const res = Helpers.vector(mi1, 0)
        for (let i = 0; i < mi1; i++) {
            let jm = 0
            for (let j = 1; j < mj1; j++) {
                if (
                    isFunction(func)
                        ? func(this.matrix[i][j], this.matrix[jm][j]) < 0
                        : this.matrix[i][j] < this.matrix[i][jm]
                ) {
                    //(jsar.toolset.isFunction(func)) ? func(matrix1[i][j], matrix1[i][jm]) : (matrix1[i][j] < matrix1[i][jm]);
                    jm = j
                }
            }
            res[i] = this.matrix[i][jm]
        }

        return res
    }

    getMinInColumns(func: Comparator<MatrixValueType>): MatrixValueType[] {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const res = Helpers.vector(mj1, 0)
        for (let j = 0; j < mj1; j++) {
            let jm = 0
            for (let i = 1; i < mi1; i++) {
                if (
                    isFunction(func)
                        ? func(this.matrix[i][j], this.matrix[jm][j]) < 0
                        : this.matrix[i][j] < this.matrix[jm][j]
                ) {
                    jm = i
                }
            }
            res[j] = this.matrix[j][jm]
        }

        return res
    }

    sortByRowsSum(): Matrix {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const sum = Helpers.vector(mi1, 0)
        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                sum[i] += this.matrix[i][j]
            }
        }
        let nmin, temp, buf
        for (let i = 0; i < mi1 - 1; i++) {
            nmin = i
            for (let j = i + 1; j < mi1; j++) {
                if (sum[j] < sum[nmin]) nmin = j
            }

            temp = sum[i]
            sum[i] = sum[nmin]
            sum[nmin] = temp

            for (let j = 0; j < mj1; j++) {
                buf = this.matrix[i][j]
                this.matrix[i][j] = this.matrix[nmin][j]
                this.matrix[nmin][j] = buf
            }
        }

        return this
    }

    getMinMax(): { row: number; column: number }[] {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        const rows = Helpers.matrix(mi1, mj1, 0)
        const res: { row: number; column: number }[] = []

        let temp, min, max
        for (let i = 0; i < mi1; i++) {
            min = Math.min(...this.matrix[i])
            temp = []
            let ind = -1
            while ((ind = this.matrix[i].indexOf(min, ind + 1)) !== -1) {
                temp.push(ind)
            }
            rows[i] = temp
        }

        const columns = this.transpose().nativeCopy()
        for (let j = 0; j < mj1; j++) {
            max = Math.max(...columns[j])
            let ind = -1
            while ((ind = columns[j].indexOf(max, ind + 1)) !== -1) {
                if (rows[ind].includes(j)) {
                    res.push({ row: ind, column: j })
                }
            }
        }

        return res
    }

    isSymmetric(): boolean {
        const mi1 = this.getRows(),
            mj1 = this.getColumns()

        if (mi1 === 0 || mj1 === 0 || mi1 !== mj1) {
            throw valueError(`incorrect matrix size: rows < ${mi1} >, columns < ${mj1} >`)
        }

        for (let i = 0; i < mi1; i++) {
            for (let j = 0; j < mj1; j++) {
                if (this.matrix[i][j] !== this.matrix[j][i]) {
                    return false
                }
            }
        }

        return true
    }
}
