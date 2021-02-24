import { Exceptions } from './exceptions'
import { Checkers } from './checkers'
import { Comparators } from './comparators'
import { Maths } from './maths'

export namespace Matrix {
    import typeException = Exceptions.typeException
    import isArray = Checkers.isArray
    import valueException = Exceptions.valueException
    import isIntNumber = Checkers.isIntNumber
    import comparator = Comparators.comparator
    import vector = Maths.vector

    export type RowColumn = { row: number; column: number }

    /** @public
     * @module matrix
     * @param {Array} matrix Input matrix.
     * @param {Number} col1 Index of a column to swap by.
     * @param {Number} col2 Index of a column to swap with.
     */
    export const swapColumns = <T>(matrix: T[][], col1: number, col2: number): void => {
        if (!isArray(matrix)) {
            throw typeException(`incorrect input argument: not array < ${matrix} >`)
        }

        const rows = matrix.length
        const cols = isArray(matrix[0]) ? matrix[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const col1_ = isIntNumber(col1) && col1 >= 0 && col1 < cols ? col1 : null
        if (col1_ == null) {
            throw valueException(`incorrect {column1} value: < ${col1} >`)
        }

        const col2_ = isIntNumber(col2) && col2 >= 0 && col2 < cols ? col2 : null
        if (col2_ == null) {
            throw valueException(`incorrect {column2} value: < ${col2} >`)
        }

        for (let i = 0; i < rows; i++) {
            matrix[i][col2_] = [matrix[i][col1_], (matrix[i][col1_] = matrix[i][col2_])][0]
        }
    }

    /** @public
     * @module matrix
     * @param {Array} matrix Input matrix.
     * @param {Number} row1 Index of a row to swap by.
     * @param {Number} row2 Index of a row to swap with.
     */
    export const swapRows = <T>(matrix: T[][], row1: number, row2: number): void => {
        if (!isArray(matrix)) {
            throw typeException(`incorrect input argument: not array < ${matrix} >`)
        }

        const n = matrix.length
        const nn = isArray(matrix[0]) ? matrix[0].length : 0
        if (n === 0 || nn === 0) {
            throw valueException(`incorrect matrix size: rows < ${n} >, columns < ${nn} >`)
        }

        const row_1 = isIntNumber(row1) && row1 >= 0 && row1 < n ? row1 : null
        if (row_1 == null) {
            throw valueException(`incorrect {row1} value: < ${row_1} >`)
        }

        const row_2 = isIntNumber(row2) && row2 >= 0 && row2 < n ? row2 : null
        if (row_2 == null) {
            throw valueException(`incorrect {row2} value: < ${row_2} >`)
        }

        // matrix[row_2] = [matrix[row_1], matrix[row_1] = matrix[row_2]][0];
        for (let j = 0; j < nn; j++) {
            matrix[row2][j] = [matrix[row1][j], (matrix[row1][j] = matrix[row2][j])][0]
        }
    }

    /** @public
     * @module matrix
     * @param {Array} matrix Input matrix.
     * @param {Number} col Index of a column to swap with.
     */
    export const sortByColumn = <T>(matrix: T[][], col: number): T[][] => {
        if (!isArray(matrix)) {
            throw typeException(`incorrect input argument: not array < ${matrix} >`)
        }

        const n = matrix.length
        const nn = isArray(matrix[0]) ? matrix[0].length : 0
        if (n === 0 || nn === 0) {
            throw valueException(`incorrect matrix size: rows < ${n} >, columns < ${nn} >`)
        }

        const col_ = isIntNumber(col) && col >= 0 && col < nn ? col : null
        if (col_ == null) {
            throw valueException(`incorrect {colIndex} value: < ${col_} >`)
        }

        matrix.sort(comparator(col_))

        return matrix
    }

    /** @public
     * @module matrix
     * @param {Array} matrix Input array.
     * @return {Array} min-max array.
     *
     * @example
     * var distance = [[1, 1, 2, 6, 0, 1],
     *                [4, 0, 3, 8, 3, 1],
     *                [8, 0, 1, 5, 0, 9],
     *                [3, 1, 4, 8, 8, 3],
     *                [2, 2, 9, 5, 2, 4],
     *                [3, 2, 3, 6, 7, 3]];
     * document.writeln(globals.matrix.getMinMax(distance)[0].row);
     */
    export const getMinMax = <T extends number>(matrix: T[][]): RowColumn[] => {
        if (!isArray(matrix)) {
            throw valueException(`incorrect input parameter: array < ${matrix} >`)
        }

        let temp, min, max
        const rows: number[][] = vector(matrix.length, [])
        const res: RowColumn[] = []

        for (let i = 0; i < matrix.length; i++) {
            min = Math.min(...matrix[i])
            temp = vector(0, 0)
            let ind = -1
            while ((ind = matrix[i].indexOf(min, ind + 1)) !== -1) {
                temp.push(ind)
            }
            rows[i] = temp
        }

        const columns = transpose(matrix)
        for (let j = 0; j < matrix[0].length; j++) {
            max = columns[j].max()
            let ind = -1
            while ((ind = columns[j].indexOf(max, ind + 1)) !== -1) {
                if (rows[ind].includes(j)) {
                    res.push({ row: ind, column: j })
                }
            }
        }

        return res
    }
}
