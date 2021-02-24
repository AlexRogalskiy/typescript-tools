import { Exceptions } from './exceptions'
import { Checkers } from './checkers'
import { Comparators } from './comparators'
import { Maths } from './maths'
import { CalculationUtils } from './utils'
import { Arrays } from './arrays'
import { Numbers } from './numbers'
import { ValueOrUndef } from '../typings/standard-types'

export namespace Matrix {
    import typeException = Exceptions.typeException
    import isArray = Checkers.isArray
    import valueException = Exceptions.valueException
    import isIntNumber = Checkers.isIntNumber
    import comparator = Comparators.comparator
    import vector = Maths.vector
    import map = CalculationUtils.map
    import matrix = Maths.matrix
    import isNumber = Checkers.isNumber
    import isBoolean = Checkers.isBoolean
    import copyOfArray = Arrays.copyOfArray
    import isInteger = Numbers.isInteger
    import Comparator = Comparators.Comparator

    export type RowColumn = { row: number; column: number }
    export type Coordinate = {
        row: number
        column: number
        isCoordinate: <T>(value: T) => boolean
        inbounds: <T>(matrix: T[][]) => boolean
        isBefore: (coordinate: Coordinate) => boolean
        clone: () => Coordinate
        setToAverage: (min: Coordinate, max: Coordinate) => void
    }

    /** @public
     * @module matrix
     * @param {Array} data Input matrix.
     * @param {Number} col1 Index of a column to swap by.
     * @param {Number} col2 Index of a column to swap with.
     */
    export const swapCols = <T>(data: T[][], col1: number, col2: number): void => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: not array < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
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
            data[i][col2_] = [data[i][col1_], (data[i][col1_] = data[i][col2_])][0]
        }
    }

    /** @public
     * @module matrix
     * @param {Array} data Input matrix.
     * @param {Number} row1 Index of a row to swap by.
     * @param {Number} row2 Index of a row to swap with.
     */
    export const swapRows = <T>(data: T[][], row1: number, row2: number): void => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: not array < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const row_1 = isIntNumber(row1) && row1 >= 0 && row1 < rows ? row1 : null
        if (row_1 == null) {
            throw valueException(`incorrect {row1} value: < ${row_1} >`)
        }

        const row_2 = isIntNumber(row2) && row2 >= 0 && row2 < rows ? row2 : null
        if (row_2 == null) {
            throw valueException(`incorrect {row2} value: < ${row_2} >`)
        }

        // matrix[row_2] = [matrix[row_1], matrix[row_1] = matrix[row_2]][0];
        for (let j = 0; j < cols; j++) {
            data[row2][j] = [data[row1][j], (data[row1][j] = data[row2][j])][0]
        }
    }

    /** @public
     * @module matrix
     * @param {Array} data Input matrix.
     * @param {Number} col Index of a column to swap with.
     */
    export const sortByCol = <T>(data: T[][], col: number): T[][] => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: not array < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const sortCol = isIntNumber(col) && col >= 0 && col < cols ? col : null
        if (sortCol == null) {
            throw valueException(`incorrect {colIndex} value: < ${sortCol} >`)
        }

        data.sort(comparator(sortCol))

        return data
    }

    /** @public
     * @module matrix
     * @param {Array} data Input array.
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
    export const getMinMax = (data: number[][]): RowColumn[] => {
        if (!isArray(data)) {
            throw valueException(`incorrect input parameter: array < ${data} >`)
        }

        let temp, min, max
        const rows: number[][] = vector(data.length, [])
        const res: RowColumn[] = []

        for (let i = 0; i < data.length; i++) {
            min = Math.min(...data[i])
            temp = vector(0, 0)
            let ind = -1
            while ((ind = data[i].indexOf(min, ind + 1)) !== -1) {
                temp.push(ind)
            }
            rows[i] = temp
        }

        const columns = transpose(data)
        for (let j = 0; j < data[0].length; j++) {
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

    /**  @public
     * @module matrix
     * @param {Array} rows Input rows array.
     * @param {Array} columns Input columns array.
     * @return {String} multiplication order.
     *
     * @example
     * var s = globals.algorithms.multiplicationOrder([10, 20, 50, 1], [20, 50, 1, 100]);
     * document.writeln(s);
     * var ss = globals.algorithms.multiplicationOrder([3, 5], [4, 2]);
     * document.writeln(ss);
     * var sss = globals.algorithms.multiplicationOrder([3, 5, 4], [4, 2, 5]);
     * document.writeln(sss);
     */
    export const multiplicationOrder = (() => {
        const cache = map()
        const subProblems = map()

        const getOps = (rows: number[], columns: number[], i: number, j: number): number => {
            if (i === j) {
                return 0
            }

            if (cache.has([i, j])) {
                return cache.get([i, j])
            }

            let minOps = Number.MAX_VALUE,
                minK,
                k
            for (k = i; k < j; k++) {
                const ops =
                    getOps(rows, columns, i, k) +
                    rows[i - 1] * columns[k - 1] * columns[j - 1] +
                    getOps(rows, columns, k + 1, j)
                if (ops < minOps) {
                    minOps = ops
                    minK = k
                }
            }

            subProblems.put([i, j], minK)
            cache.put([i, j], minOps)
            return minOps
        }

        const matrixMultiplication = (i: number, j: number): string => {
            if (!isIntNumber(i) || !isIntNumber(j) || i <= 0 || j <= 0) {
                throw valueException(
                    `incorrect input parameters: number of rows < ${i} >, number of columns < ${j} >`,
                )
            }
            if (i === j) {
                return i.toString()
            } else {
                const k = subProblems.get([i, j])
                let s1 = matrixMultiplication(i, k)
                if (s1.length > 1) {
                    s1 = `( ${s1} )`
                }
                let s2 = matrixMultiplication(k + 1, j)
                if (s2.length > 1) {
                    s2 = `( ${s2} )`
                }

                return `${s1} * ${s2}`
            }
        }

        return (rows: number[], columns: number[]): string => {
            if (!isArray(rows) || !isArray(columns) || rows.length !== columns.length) {
                throw valueException(`incorrect input parameters: array1 < ${rows} >, array2 < ${columns} >`)
            }

            if (getOps(rows, columns, 1, rows.length) === Number.MAX_VALUE) {
                throw valueException(`invalid input parameter values, rows=${rows}, columns=${columns}`)
            }

            return matrixMultiplication(1, rows.length)
        }
    })()

    /** @public
     * @module matrix
     * @param {Array} data Input matrix.
     * @return {Array} Current sorted matrix.
     */
    export const sort = <T>(data: T[][]): T[][] => {
        if (!isArray(data)) {
            throw valueException(`incorrect matrix value: matrix < ${data} >`)
        }

        const rows = data.length ? data.length : 0
        const cols = isArray(data[0]) ? data[0].length : 0
        let i, j, mi, mj, temp

        for (i = 0; i < rows * cols; i++) {
            for (j = 0; j < rows * cols; j++) {
                mi = Math.floor(i / cols)
                mj = Math.floor(j / cols)
                if (data[mi][i % cols] < data[mj][j % cols]) {
                    temp = data[mi][i % cols]
                    data[mi][i % cols] = data[mj][j % cols]
                    data[mj][j % cols] = temp
                }
            }
        }

        return data
    }

    /** @public
     * @module matrix
     * @param {Array} data Input matrix.
     * @return {Array} Transposed matrix.
     */
    export const transpose = <T>(data: T[][]): T[][] => {
        if (!isArray(data)) {
            throw valueException(`incorrect matrix value: matrix < ${data} >`)
        }

        return data[0].map((_, i) => {
            return data.map(row => {
                return row[i]
            })
        })
    }

    /** @public
     * @module matrix
     * @param {Array} data1 Input matrix.
     * @param {Array} data2 Input matrix to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    export const multMatrix = (data1: number[][], data2: number[][]): number[][] => {
        if (!isArray(data1) || !isArray(data2)) {
            throw typeException(`incorrect input arguments: matrix1 < ${data1} >, matrix2 < ${data2} >`)
        }

        const rows2 = data2.length
        const cols1 = isArray(data1[0]) ? data1[0].length : 0
        if (rows2 !== cols1) {
            throw valueException(`incorrect input arguments: rows < ${rows2} >, cols < ${cols1} >`)
        }

        const rows1 = data1.length
        const cols2 = isArray(data2[0]) ? data2[0].length : 0
        const result = matrix(rows1, cols2, 0)
        for (let i = 0; i < rows1; i++) {
            for (let j = 0; j < cols2; j++) {
                for (let k = 0; k < rows2; k++) {
                    result[i][j] += data1[i][k] * data2[k][j]
                }
            }
        }

        return result
    }

    /** @public
     * @module matrix
     * @param {Array} data Input matrix.
     * @param {Number} num Input number to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    export const multNumber = (data: number[][], num: number): number[][] => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: {matrix} is not valid array < ${data} >`)
        }
        if (!isNumber(num)) {
            throw typeException(`incorrect input argument: {num} is not number < ${num} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const res = matrix(rows, cols, 0)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                res[i][j] = data[i][j] * num
            }
        }

        return res
    }

    /** @public
     * @module matrix
     * @param {Array} data1 Input matrix.
     * @param {Array} data2 Input matrix to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    export const sumMatrix = (data1: number[][], data2: number[][]): number[][] => {
        if (!isArray(data1) || !isArray(data2)) {
            throw valueException(`incorrect input arguments: matrix1 < ${data1} >, matrix2 < ${data2} >`)
        }

        const rows1 = data1.length
        const rows2 = data2.length
        const cols1 = isArray(data1[0]) ? data1[0].length : 0,
            cols2 = isArray(data2[0]) ? data2[0].length : 0

        if (rows1 === 0 || cols1 === 0 || rows1 !== rows2 || cols1 !== cols2) {
            throw valueException(`incorrect matrix size: rows < ${rows1} >, columns < ${cols1} >`)
        }

        const res = matrix(rows1, cols1, 0)
        for (let i = 0; i < rows1; i++) {
            for (let j = 0; j < cols1; j++) {
                res[i][j] = data1[i][j] + data2[i][j]
            }
        }

        return res
    }

    /** @public
     * @module matrix
     * @param {Array} data Input matrix.
     * @param {Number} num Input number to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    export const matrixPow = (data: number[][], num: number): number[][] => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: {matrix} is not array < ${data} >`)
        }
        if (!isIntNumber(num) || num < 1) {
            throw typeException(`incorrect input argument: {num} is not positive integer number < ${num} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0 || rows !== cols) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        return num === 1 ? data : multMatrix(data, matrixPow(data, num - 1))
    }

    /**
     * @public
     * @module matrix
     * @param {Array} data Input array.
     * @param {Boolean} isNullDiagonal Boolean flag.
     * @return {Array} Matrix
     *
     * @example
     * var distance = [[0, 7, 3, 7, 1],
     *                [1, 0, 8, 6, 3],
     *                [1, 1, 0, 0, 1],
     *                [0, 5, 0, 0, 0],
     *                [1, 23, 1, 1, 0]];
     * document.writeln(globals.matrix.addOnColumns(distance));
     */
    export const addOnColumns = (data: number[][], isNullDiagonal: boolean): number[][] => {
        if (!isArray(data)) {
            throw valueException(`incorrect vertex order matrix < ${data} >`)
        }

        //var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
        //if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
        //											name: 'MatrixSizeError',
        //												message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
        //											};
        //}

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const nullDiagonal = isNullDiagonal == null ? true : isBoolean(isNullDiagonal) ? isNullDiagonal : null
        if (nullDiagonal == null) {
            throw valueException(`incorrect parameter: diagonal values included < ${nullDiagonal} >`)
        }

        const copy: number[][] = transpose(data)
        for (let i = 0; i < rows; i++) {
            const min = isNullDiagonal
                ? arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1)))
                : arrayMin(copy[i])
            for (let j = 0; j < cols; j++) {
                if (isNullDiagonal && i === j) {
                    continue
                }
                copy[i][j] -= min
            }
        }

        return transpose(copy)
    }

    /**
     * @public
     * @module matrix
     * @param {Array} data Input array.
     * @param {Boolean} isNullDiagonal Boolean flag.
     * @return {Array} Matrix
     *
     * @example
     * var distance = [[0, 7, 3, 7, 1],
     *                [1, 0, 8, 6, 3],
     *                [1, 1, 0, 0, 1],
     *                [0, 5, 0, 0, 0],
     *                [1, 23, 1, 1, 0]];
     * document.writeln(globals.matrix.addOnRows(distance));
     */
    export const addOnRows = (data: number[][], isNullDiagonal: boolean): number[][] => {
        if (!isArray(data)) {
            throw valueException(`incorrect vertex order matrix < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const nullDiagonal = isNullDiagonal == null ? true : isBoolean(isNullDiagonal) ? isNullDiagonal : null
        if (nullDiagonal == null) {
            throw valueException(`incorrect parameter: diagonal values included < ${nullDiagonal} >`)
        }

        const copy = copyOfArray(data)
        for (let i = 0; i < rows; i++) {
            const min = isNullDiagonal
                ? arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1)))
                : arrayMin(copy[i])
            for (let j = 0; j < cols; j++) {
                if (isNullDiagonal && i === j) continue
                copy[i][j] -= min
            }
        }

        return copy
    }

    /**
     * @public
     * @module matrix
     * @param {Integer} num Matrix rang.
     * @return {Array} Matrix.
     *
     * @example
     * var myMatrixIdentity = globals.toolset.identity(4);
     */
    export const identity = (num: number): number[][] => {
        if (!isInteger(num) || num < 0) {
            throw valueException(`incorrect input value: matrix size is not positive integer < ${num} >`)
        }

        const mat = matrix(num, num, 0)
        for (let i = 0; i < num; i++) {
            mat[i][i] = 1
        }
        return mat
    }

    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Object} {row: row, col: col, squareSize: squareSize}.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var mySquare = globals.toolset.findSquare(matrix);
     */
    export const findSquare = (() => {
        const subSquare = (row: number, col: number, squareSize: number): { row; col; squareSize } => {
            return { row, col, squareSize }
        }

        const findSquareWithSize = (
            matrix: number[][],
            squareSize: number,
        ): { row; col; squareSize } | null => {
            const count = matrix.length - squareSize + 1
            for (let row = 0; row < count; row++) {
                for (let col = 0; col < count; col++) {
                    if (isSquare(matrix, row, col, squareSize)) {
                        return subSquare(row, col, squareSize)
                    }
                }
            }

            return null
        }

        const isSquare = (data: number[][], row: number, col: number, size: number): boolean => {
            for (let j = 0; j < size; j++) {
                if (data[row][col + j] === 1 || data[row + size - 1][col + j] === 1) {
                    return false
                }
            }

            for (let i = 1; i < size - 1; i++) {
                if (data[row + i][col] === 1 || data[row + i][col + size - 1] === 1) {
                    return false
                }
            }

            return true
        }

        return (matrix: number[][]): { row; col; squareSize } | null => {
            if (!isArray(matrix)) {
                throw valueException(`incorrect vertex order matrix < ${matrix} >`)
            }

            const rows = matrix.length
            const cols = isArray(matrix[0]) ? matrix[0].length : 0
            if (rows === 0 || cols === 0 || rows !== cols) {
                throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
            }

            for (let i = matrix.length; i >= 1; i--) {
                const square = findSquareWithSize(matrix, i)
                if (square != null) {
                    return square
                }
            }

            return null
        }
    })()

    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Object} {row: row, col: col, squareSize: squareSize}.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var mySquare = globals.toolset.findSquare(matrix);
     */
    export const findSquare2 = (() => {
        const squareCell = (zerosRight = 0, zerosBelow = 0): { zerosRight; zerosBelow } => {
            return { zerosRight, zerosBelow }
        }

        const subSquare = (row: number, col: number, squareSize: number): { row; col; squareSize } => {
            return { row, col, squareSize }
        }

        const findSquareWithSize = (
            processed: { zerosRight; zerosBelow }[][],
            squareSize: number,
        ): { row; col; squareSize } | null => {
            const count = processed.length - squareSize + 1
            for (let row = 0; row < count; row++) {
                for (let col = 0; col < count; col++) {
                    if (isSquare(processed, row, col, squareSize)) {
                        return subSquare(row, col, squareSize)
                    }
                }
            }

            return null
        }

        const isSquare = (
            matrix: { zerosRight; zerosBelow }[][],
            row: number,
            col: number,
            size: number,
        ): boolean => {
            const topLeft = matrix[row][col]
            const topRight = matrix[row][col + size - 1]
            const bottomRight = matrix[row + size - 1][col]

            if (topLeft.zerosRight < size) {
                return false
            }
            if (topLeft.zerosBelow < size) {
                return false
            }
            if (topRight.zerosBelow < size) {
                return false
            }

            return bottomRight.zerosRight >= size
        }

        const processSquare = (data: number[][]): { zerosRight; zerosBelow }[][] => {
            const processed = matrix(data.length, data.length, squareCell())
            let previous: { zerosRight; zerosBelow } | null = null

            for (let r = data.length - 1; r >= 0; r--) {
                for (let c = data.length - 1; c >= 0; c--) {
                    let rightZeros = 0,
                        belowZeros = 0
                    if (data[r][c] === 0) {
                        rightZeros++
                        belowZeros++

                        if (c + 1 < data.length) {
                            previous = processed[r][c + 1]
                            rightZeros += previous.zerosRight
                        }
                        if (r + 1 < data.length) {
                            previous = processed[r + 1][c]
                            belowZeros += previous.zerosBelow
                        }
                    }
                    processed[r][c] = squareCell(rightZeros, belowZeros)
                }
            }

            return processed
        }

        return (matrix: number[][]): { row; col; squareSize } | null => {
            if (!isArray(matrix)) {
                throw valueException(`incorrect vertex order matrix < ${matrix} >`)
            }

            const rows = matrix.length
            const cols = isArray(matrix[0]) ? matrix[0].length : 0

            if (rows === 0 || cols === 0 || rows !== cols) {
                throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
            }

            const processed = processSquare(matrix)
            for (let i = matrix.length; i >= 1; i--) {
                const square = findSquareWithSize(processed, i)
                if (square != null) {
                    return square
                }
            }

            return null
        }
    })()

    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Integer} maximum sum of submatrix elements.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var maxSubmatrixSum = globals.toolset.getMaxSubMatrix(matrix);
     */
    export const getMaxSubMatrix = (() => {
        const precomputeMatrix = (data: number[][]): number[][] => {
            const sumMatrix = matrix(data.length, data[0].length, 0)
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[0].length; j++) {
                    if (i === 0 && j === 0) {
                        sumMatrix[i][j] = data[i][j]
                    } else if (j === 0) {
                        sumMatrix[i][j] = sumMatrix[i - 1][j] + data[i][j]
                    } else if (i === 0) {
                        sumMatrix[i][j] = sumMatrix[i][j - 1] + data[i][j]
                    } else {
                        sumMatrix[i][j] =
                            sumMatrix[i - 1][j] + sumMatrix[i][j - 1] - sumMatrix[i - 1][j - 1] + data[i][j]
                    }
                }
            }

            return sumMatrix
        }

        const computeSum = (
            sumMatrix: number[][],
            i1: number,
            i2: number,
            j1: number,
            j2: number,
        ): number => {
            if (i1 === 0 && j1 === 0) {
                return sumMatrix[i2][j2]
            } else if (i1 === 0) {
                return sumMatrix[i2][j2] - sumMatrix[i2][j1 - 1]
            } else if (j1 === 0) {
                return sumMatrix[i2][j2] - sumMatrix[i1 - 1][j2]
            }

            return (
                sumMatrix[i2][j2] - sumMatrix[i2][j1 - 1] - sumMatrix[i1 - 1][j2] + sumMatrix[i1 - 1][j1 - 1]
            )
        }

        return (matrix: number[][]): number => {
            if (!isArray(matrix)) {
                throw valueException(`incorrect vertex order matrix < ${matrix} >`)
            }

            const rows = matrix.length
            const cols = isArray(matrix[0]) ? matrix[0].length : 0
            if (rows === 0 || cols === 0 || rows !== cols) {
                throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
            }

            let maxArea = Number.MIN_VALUE
            const matrixCompute = precomputeMatrix(matrix)
            for (let row1 = 0; row1 < rows; row1++) {
                for (let row2 = row1; row2 < rows; row2++) {
                    for (let col1 = 0; col1 < cols; col1++) {
                        for (let col2 = col1; col2 < cols; col2++) {
                            maxArea = Math.max(maxArea, computeSum(matrixCompute, row1, row2, col1, col2))
                        }
                    }
                }
            }

            return maxArea
        }
    })()

    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Integer} maximum sum of submatrix elements.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var maxSubmatrixSum = globals.toolset.getMaxSubMatrix(matrix);
     */
    export const getMaxSubMatrix2 = (() => {
        const clearArray = (array: number[]): void => {
            for (let i = 0; i < array.length; i++) {
                array[i] = 0
            }
        }

        const maxSubArray = (array: number[], num: number): number => {
            let maxSum = 0
            let runningSum = 0

            for (let i = 0; i < num; i++) {
                runningSum += array[i]
                maxSum = Math.max(maxSum, runningSum)

                if (runningSum < 0) {
                    runningSum = 0
                }
            }
            return maxSum
        }

        return (matrix: number[][]): number => {
            if (!isArray(matrix)) {
                throw valueException(`incorrect vertex order matrix < ${matrix} >`)
            }

            const rows = matrix.length
            const cols = isArray(matrix[0]) ? matrix[0].length : 0

            if (rows === 0 || cols === 0 || rows !== cols) {
                throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
            }

            const partialSum = vector(cols, 0)
            let maxSum = 0,
                tempMaxSum

            for (let rowStart = 0; rowStart < rows; rowStart++) {
                clearArray(partialSum)
                for (let rowEnd = rowStart; rowEnd < rows; rowEnd++) {
                    for (let i = 0; i < cols; i++) {
                        partialSum[i] += matrix[rowEnd][i]
                    }

                    tempMaxSum = maxSubArray(partialSum, cols)
                    maxSum = Math.max(maxSum, tempMaxSum)
                }
            }

            return maxSum
        }
    })()

    export const checkPattern = (() => {
        const EMPTY = 0

        return (matrix: number[][]): number => {
            if (!isArray(matrix)) {
                throw valueException(`incorrect matrix < ${matrix} >`)
            }

            const rows = matrix.length
            const cols = isArray(matrix[0]) ? matrix[0].length : 0

            if (cols === 0 || cols === 0 || cols !== cols) {
                throw valueException(`incorrect matrix size: rows < ${cols} >, columns < ${cols} >`)
            }

            let row: number,
                col = 0
            for (row = 0; row < rows; row++) {
                if (matrix[row][0] !== EMPTY) {
                    for (col = 1; col < cols; col++) {
                        if (matrix[row][col] !== matrix[row][col - 1]) break
                    }
                    if (col === cols) {
                        return matrix[row][0]
                    }
                }
            }
            for (col = 0; col < cols; col++) {
                if (matrix[0][col] !== EMPTY) {
                    for (row = 1; row < rows; row++) {
                        if (matrix[row][col] !== matrix[row - 1][col]) break
                    }
                    if (row === rows) {
                        return matrix[0][col]
                    }
                }
            }

            if (matrix[0][0] !== EMPTY) {
                for (row = 1; row < rows; row++) {
                    if (matrix[row][row] !== matrix[row - 1][row - 1]) break
                }
                if (row === rows) {
                    return matrix[0][0]
                }
            }

            if (matrix[rows - 1][0] !== EMPTY) {
                for (row = 1; row < rows; row++) {
                    if (matrix[rows - row - 1][row] !== matrix[rows - row][row - 1]) break
                }
                if (row === rows) {
                    return matrix[rows - 1][0]
                }
            }

            return EMPTY
        }
    })()

    export const findElement = (matrix: number[][], elem: number): boolean => {
        if (!isNumber(elem)) {
            throw valueException(`incorrect input parameter: elem < ${elem} >`)
        }
        if (!isArray(matrix)) {
            throw valueException(`incorrect vertex order matrix < ${matrix} >`)
        }

        const rows = matrix.length
        const cols = isArray(matrix[0]) ? matrix[0].length : 0
        if (rows === 0 || cols === 0 || rows !== cols) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        let row = 0,
            col = cols - 1
        while (row < rows && col >= 0) {
            if (matrix[row][col] === elem) {
                return true
            } else if (matrix[row][col] > elem) {
                col--
            } else {
                row++
            }
        }

        return false
    }

    export const findElement2 = (() => {
        const coordinate = (row: number, column: number): Coordinate => {
            const that = Object.create(coordinate)
            that.prototype = coordinate

            const isCoordinate = <T>(value: T): boolean => {
                return value instanceof coordinate
            }

            const init = (): void => {
                if (!isIntNumber(row) || !isIntNumber(column)) {
                    throw valueException(
                        `incorrect initialization values: row < ${row} >, column < ${column} >`,
                    )
                }

                that.row = row
                that.column = column
            }

            that.inbounds = (data: number[][]): boolean => {
                if (!isArray(data)) {
                    throw valueException(`incorrect vertex order matrix < ${data} >`)
                }

                const rows = data.length
                const cols = isArray(data[0]) ? data[0].length : 0

                return row >= 0 && column >= 0 && row < rows && column < cols
            }

            that.isBefore = (coordinate: Coordinate): boolean => {
                if (!isCoordinate(coordinate)) {
                    throw valueException(`incorrect coordinate object < ${coordinate} >`)
                }

                return row <= coordinate.row && column <= coordinate.column
            }

            that.clone = (): Coordinate => {
                return coordinate(row, column)
            }

            that.setToAverage = (min: Coordinate, max: Coordinate): void => {
                if (!isCoordinate(min) || !isCoordinate(max)) {
                    throw valueException(`incorrect coordinate objects: min < ${min} >, max < ${max} >`)
                }
                row = Math.floor((min.row + max.row) / 2)
                column = Math.floor((min.column + max.column) / 2)
            }

            init()
            return that
        }

        const partitionAndSearch = <T>(
            data: ValueOrUndef<T>[][],
            origin: Coordinate,
            dest: Coordinate,
            pivot: Coordinate,
            elem: T,
            cmp: Comparator<ValueOrUndef<T>>,
        ): Coordinate | null => {
            const lowerLeftOrigin = coordinate(pivot.row, origin.column)
            const lowerLeftDest = coordinate(dest.row, pivot.column - 1)
            const upperRightOrigin = coordinate(origin.row, pivot.column)
            const upperRightDest = coordinate(pivot.row - 1, dest.column)

            const lowerLeft = findElemement_(data, lowerLeftOrigin, lowerLeftDest, elem, cmp)
            if (lowerLeft == null) {
                return findElemement_(data, upperRightOrigin, upperRightDest, elem, cmp)
            }

            return lowerLeft
        }

        const findElemement_ = <T>(
            data: ValueOrUndef<T>[][],
            origin: Coordinate,
            dest: Coordinate,
            elem: T,
            cmp: Comparator<ValueOrUndef<T>>,
        ): Coordinate | null => {
            if (!origin.inbounds(data) || !dest.inbounds(data)) {
                return null
            }

            if (data[origin.row][origin.column] === elem) {
                return origin
            } else if (!origin.isBefore(dest)) {
                return null
            }

            const start = origin.clone()
            const diagDist = Math.min(dest.row - origin.row, dest.column - origin.column)
            const end = coordinate(start.row + diagDist, start.column + diagDist)
            const coord = coordinate(0, 0)

            while (start.isBefore(end)) {
                coord.setToAverage(start, end)
                if (cmp(elem, data[coord.row][coord.column]) > 0) {
                    start.row = coord.row + 1
                    start.column = coord.column + 1
                } else {
                    end.row = coord.row - 1
                    end.column = coord.column - 1
                }
            }

            return partitionAndSearch(data, origin, dest, start, elem, cmp)
        }

        return <T>(data: ValueOrUndef<T>[][], elem: T): Coordinate | null => {
            if (!isNumber(elem)) {
                throw valueException(`incorrect input parameter: elem < ${elem} >`)
            }

            if (!isArray(data)) {
                throw valueException(`incorrect vertex order matrix < ${data} >`)
            }

            const rows = data.length
            const cols = isArray(data[0]) ? data[0].length : 0
            if (rows === 0 || cols === 0 || rows !== cols) {
                throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
            }

            const origin = coordinate(0, 0)
            const dest = coordinate(rows - 1, cols - 1)

            return findElemement_(data, origin, dest, elem)
        }
    })()

    export const setZeros = (data: number[][]): void => {
        if (!isArray(data)) {
            throw valueException(`incorrect input parameter: array < ${matrix} >`)
        }

        const rows = data.length
        const cols = isArray(matrix[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const row = vector(rows, false)
        const column = vector(cols, false)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (data[i][j] === 0) {
                    row[i] = true
                    column[j] = true
                }
            }
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (row[i] || column[j]) {
                    data[i][j] = 0
                }
            }
        }
    }

    export const rotate = <T>(matrix: ValueOrUndef<T>[][], n: number): void => {
        if (!isArray(matrix)) {
            throw valueException(`incorrect input parameter: array < ${matrix} >`)
        }

        const rows = matrix.length
        const cols = isArray(matrix[0]) ? matrix[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const num = Math.floor(n / 2)
        for (let i = 0; i < num; ++i) {
            const first = i
            const last = n - 1 - i
            for (let j = first; j < last; ++j) {
                const offset = j - first
                const temp = matrix[first][j]
                matrix[first][j] = matrix[last - offset][first]
                matrix[last - offset][first] = matrix[last][last - offset]
                matrix[last][last - offset] = matrix[j][last]
                matrix[j][last] = temp
            }
        }
    }

    export const vectorToMatrix = <T>(vec: ValueOrUndef<T>[], rang: number): ValueOrUndef<T>[][] => {
        if (!isArray(vec)) {
            throw typeException(`incorrect input argument: {array} not an array < ${vec} >`)
        }
        if (!isIntNumber(rang)) {
            throw typeException(`incorrect input argument: {rang} not an integer number < ${rang} >`)
        }

        if (rang <= 0 || rang >= vec.length) {
            throw valueException(`incorrect input argument: {rang} is out of bounds {1, ${vec.length}}`)
        }
        const mat: ValueOrUndef<T>[][] = matrix(rang, rang, null)
        for (let k = 0, i, j; k < vec.length; k++) {
            i = Math.floor(k / rang)
            j = k - Math.floor(k / rang) * rang
            mat[i][j] = vec[k]
        }

        return mat
    }

    export const matrixToVector = <T>(mat: ValueOrUndef<T>[][]): ValueOrUndef<T>[] => {
        if (!isArray(mat)) {
            throw typeException(`incorrect input argument: {mat} not a matrix < ${mat} >`)
        }
        const n = mat.length
        const nn = isArray(mat[0]) ? mat[0].length : 0

        if (n === 0 || nn === 0) {
            throw valueException(`incorrect matrix size: rows < ${n} >, columns < ${nn} >`)
        }

        const vec: ValueOrUndef<T>[] = vector(n * nn, null)
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < nn; j++) {
                vec[i * nn + j] = mat[i][j]
            }
        }

        return vec
    }

    export const matrixToVector2 = <T>(mat: ValueOrUndef<T>[][]): ValueOrUndef<T>[] => {
        if (!isArray(mat)) {
            throw typeException(`incorrect input argument: {mat} not a matrix < ${mat} >`)
        }

        const n = mat.length
        const nn = isArray(mat[0]) ? mat[0].length : 0

        if (n === 0 || nn === 0 || n !== nn) {
            throw valueException(`incorrect matrix size: rows < ${n} >, columns < ${nn} >`)
        }

        let k = 0
        const vec: ValueOrUndef<T>[] = vector((n * (n + 1)) / 2, null)
        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                vec[k++] = mat[i][j]
            }
        }

        return vec
    }

    export const norm = (matrix: number[][]): number => {
        if (!isArray(matrix)) {
            throw valueException(`incorrect input parameter: array < ${matrix} >`)
        }

        const rows = matrix.length
        const cols = isArray(matrix[0]) ? matrix[0].length : 0

        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        let s = 0,
            norm = -1
        for (let i = 0; i < rows; i++) {
            s = 0
            for (let j = 0; j < cols; j++) {
                s += Math.abs(matrix[i][j])
            }
            if (s > norm) norm = s
        }

        return norm
    }

    export const spiral = <T>(matrix: T[][]): ValueOrUndef<T>[] => {
        if (!isArray(matrix)) {
            throw typeException(`incorrect input argument: not array < ${matrix} >`)
        }

        const rows = matrix.length
        const cols = isArray(matrix[0]) ? matrix[0].length : 0
        if (rows === 0 || cols === 0 || rows !== cols) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const res: ValueOrUndef<T>[] = vector(0, null)
        for (let sh = rows; sh > 1; sh--) {
            let j, i
            for (j = rows - sh; j < sh; j++) {
                res.push(matrix[rows - sh][j])
            }
            --j
            for (i = rows - sh + 1; i < sh; i++) {
                res.push(matrix[i][j])
            }
            --i
            for (j = sh - 1 - 1; j >= rows - sh; j--) {
                res.push(matrix[i][j])
            }
            ++j
            for (i = sh - 1 - 1; i > rows - sh; i--) {
                res.push(matrix[i][j])
            }
        }

        return res
    }

    export const sortByMaxColumn = (data: number[][]): void => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: not array < ${data} >`)
        }

        const n = data.length
        const nn = isArray(data[0]) ? data[0].length : 0

        if (n === 0 || nn === 0) {
            throw valueException(`incorrect matrix size: rows < ${n} >, columns < ${nn} >`)
        }

        let maxSum, sum
        for (let j = 0; j < nn - 1; j++) {
            maxSum = 0
            for (let i = 0; i < n; i++) {
                maxSum += data[i][j]
            }
            for (let jj = j + 1; jj < nn; jj++) {
                sum = 0
                for (let i = 0; i < n; i++) {
                    sum += data[i][jj]
                }

                if (maxSum < sum) {
                    maxSum = sum
                    swapCols(data, j, jj)
                }
            }
        }
    }

    // Используется алгоритм Барейса, сложность O(n^3)
    export const determinant = (data: number[][]): number => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: not array < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const matrix2: number[][] = matrix(rows, cols, 0)
        let exchanges = 0,
            denom = 1
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                matrix2[i][j] = data[i][j]
            }
        }

        for (let i = 0; i < rows - 1; i++) {
            let maxN = i,
                maxValue = Math.abs(matrix2[i][i])
            for (let j = i + 1; j < cols; j++) {
                const value = Math.abs(matrix2[j][i])
                if (value > maxValue) {
                    maxN = j
                    maxValue = value
                }
            }
            if (maxN > i) {
                swapRows(matrix2, i, maxN)
                exchanges++
            } else {
                if (maxValue === 0) {
                    return maxValue
                }
            }

            const value1 = matrix2[i][i]
            for (let j = i + 1; j < rows; j++) {
                const value2 = matrix2[j][i]
                matrix2[j][i] = 0
                for (let k = i + 1; k < cols; k++) {
                    matrix2[j][k] = Math.floor((matrix2[j][k] * value1 - matrix2[i][k] * value2) / denom)
                }
            }
            denom = value1
        }

        return exchanges % 2 ? -matrix2[rows - 1][cols - 1] : matrix2[rows - 1][cols - 1]
    }

    export const adjugateMatrix = (data: number[][]): number[][] => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: not array < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const res: number[][] = matrix(rows, cols, 0)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const temp: number[][] = []
                const sign = (i + j) % 2 === 0 ? 1 : -1
                for (let m = 0; m < j; m++) {
                    temp[m] = []
                    for (let c = 0; c < i; c++) {
                        temp[m][c] = data[m][c]
                    }
                    for (let c = i + 1; c < cols; c++) {
                        temp[m][c - 1] = data[m][c]
                    }
                }
                for (let m = j + 1; m < rows; m++) {
                    temp[m - 1] = []
                    for (let c = 0; c < i; c++) {
                        temp[m - 1][c] = data[m][c]
                    }
                    for (let c = i + 1; c < cols; c++) {
                        temp[m - 1][c - 1] = data[m][c]
                    }
                }
                res[i][j] = sign * determinant(temp)
            }
        }

        return res
    }

    export const inverseMatrix = (matrix: number[][]): number[][] => {
        if (!isArray(matrix)) {
            throw typeException(`incorrect input argument: not array < ${matrix} >`)
        }

        const n = matrix.length
        const nn = isArray(matrix[0]) ? matrix[0].length : 0

        if (n === 0 || nn === 0) {
            throw valueException(`incorrect matrix size: rows < ${n} >, columns < ${nn} >`)
        }

        const det = determinant(matrix)
        if (det === 0) {
            throw valueException(`Invalid determinant ${det}`)
        }

        const res = adjugateMatrix(matrix)
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < nn; j++) {
                res[i][j] = Math.floor(res[i][j] / det)
            }
        }

        return res
    }

    export const matrixRank = (data: number[][]): number => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: not array < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0

        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const k = rows < cols ? rows : cols

        let r = 1
        let rank = 0
        while (r <= k) {
            const temp: number[][] = matrix(r, r, 0)
            for (let a = 0; a < rows - r + 1; a++) {
                for (let b = 0; b < cols - r + 1; b++) {
                    for (let c = 0; c < r; c++) {
                        for (let d = 0; d < r; d++) {
                            temp[c][d] = data[a + c][b + d]
                        }
                    }
                    if (determinant(temp) !== 0) {
                        rank = r
                    }
                }
            }
            r++
        }

        return rank
    }

    export const maxInRows = (data: number[][]): number[] => {
        if (!isArray(data)) {
            throw typeException(`incorrect matrix size: data < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(rows[0]) ? rows[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        return data.map(row => {
            return row.reduce((max, cell) => {
                return Math.max(max, cell)
            }, 0)
        })
    }

    export const maxInCols = (data: number[][]): number[] => {
        if (!isArray(data)) {
            throw typeException(`incorrect matrix size: data < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        return data[0].map((_, i) => {
            return data.reduce(function (max, row) {
                return Math.max(max, row[i])
            }, 0)
        })
    }

    export type MagicSquare = 1 | 2 | 3 | 4

    /**
     *    Функция отдаёт число, обозначающее:
     *    1 - не магический квадрат
     *    2 - полумагический (только строки и столбцы)
     *    3 - диагональный магический квадрат (только диагонали!)
     *    4 - магический квадрат (строки, столбцы, диагонали)
     */
    export const isMagicSquare = (matrix: number[][]): number => {
        if (!isArray(matrix)) {
            throw typeException(`incorrect input argument: <matrix> is not array < ${matrix} >`)
        }

        const rows = matrix.length
        const cols = isArray(matrix[0]) ? matrix[0].length : 0
        if (rows === 0 || cols === 0 || rows !== cols) {
            throw valueException(`incorrect matrix size: rows < ${rows} >, columns < ${cols} >`)
        }

        const m = (rows * (rows * rows + 1)) / 2
        let type = 2
        let leftDiagonal = 0
        let rightDiagonal = 0

        for (let i = 0; i < rows; i++) {
            let row = 0
            let col = 0

            for (let j = 1; j <= cols; j++) {
                row += matrix[i][j]
                col += matrix[j][i]
                rightDiagonal += i === j ? matrix[i][i] : 0
                leftDiagonal += rows - i === j - 1 ? matrix[i][j] : 0
            }
            if (row !== m || col !== m) {
                type = 1
            }
        }
        if (leftDiagonal === m && rightDiagonal === m) {
            type += 2
        }

        return type
    }

    export const createMagicSquare = (n: number): number[][] => {
        if (!isInteger(n) || n < 0 || n % 2 === 0) {
            throw valueException(`incorrect matrix argument: n is not odd number < ${n} >`)
        }

        const res = matrix(n, n, 0)
        for (let i = 0, nn = 1, ss = (n - 1) / 2; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const x = (-ss + i + j + n) % n
                const y = (ss + i - j + n) % n
                res[x][y] = nn++
            }
        }

        return res
    }

    export const createMagicSquareTerraces = (n: number): ValueOrUndef<number>[][] => {
        if (!isInteger(n) || n < 0 || n % 2 === 0) {
            throw typeException(`incorrect input argument: dimension {n} is not odd number < ${n} >`)
        }

        const res: ValueOrUndef<number>[][] = matrix(n, n, null)

        let num = 1
        let glob_i = Math.round(n / 2)
        let glob_j = 2 - glob_i

        while (num < n * n) {
            let i = glob_i
            let j = glob_j

            while (i + 1 !== glob_j) {
                res[i--][j++] = num++
            }

            glob_i++
            glob_j++
        }

        // заполнение левой части квадрата, относительно
        // левой диагонали (саму диагональ не трогаем)
        glob_i = 1
        glob_j = n

        while (glob_i <= n - 1 && glob_j >= 2) {
            for (let j = 1; j <= glob_j; j++) {
                if (res[glob_i][j] == null) {
                    if (res[glob_i + n][j] != null) {
                        res[glob_i][j] = res[glob_i + n][j]
                        res[glob_i + n][j] = null
                    } else {
                        res[glob_i][j] = res[glob_i][j + n]
                        res[glob_i][j + n] = null
                    }
                }
            }
            glob_i++
            glob_j--
        }

        // заполнение правой части квадрата, относительно
        // левой диагонали (саму диагональ не трогаем)
        glob_j = n - 2
        for (let i = n; i >= 2; i--) {
            for (let j = n; j >= n - glob_j; j--) {
                if (res[i][j] == null) {
                    if (res[i - n][j] != null) {
                        res[i][j] = res[i - n][j]
                        res[i - n][j] = null
                    } else {
                        res[i][j] = res[i][j - n]
                        res[i][j - n] = null
                    }
                }
            }
            glob_j--
        }

        for (let item of res) {
            const temp = item.every(elem => elem == null)
            if (temp) {
                //res.splice(i, 1);
                item = []
            }
        }

        return res
    }

    /**
     * Multiply matrix A by matrix B to nest transformations
     * @static
     * @memberOf fabric.util
     * @param  {Array} a First transformMatrix
     * @param  {Array} b Second transformMatrix
     * @param  {Boolean} is2x2 flag to multiply matrices as 2x2 matrices
     * @return {Array} The product of the two transform matrices
     */
    export const multiplyTransformMatrices = (a: number[], b: number[], is2x2: boolean): number[] => {
        return [
            a[0] * b[0] + a[2] * b[1],
            a[1] * b[0] + a[3] * b[1],
            a[0] * b[2] + a[2] * b[3],
            a[1] * b[2] + a[3] * b[3],
            is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
            is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5],
        ]
    }

    export const choleskyDecomposition = (data: number[][]): number[][] => {
        if (!isArray(data)) {
            throw typeException(`incorrect input argument: {matrix} is not array < ${data} >`)
        }

        const rows = data.length
        const cols = isArray(data[0]) ? data[0].length : 0
        if (rows === 0 || cols === 0 || rows !== cols) {
            throw valueException(`incorrect matrix size: {rows} < ${rows} >, {cols} < ${cols} >`)
        }

        const res = vector(rows, [])
        for (let i = 0; i < data.length; i++) {
            //L - треугольная матрица, поэтому в i-ой строке i+1 элементов
            res[i] = vector(i + 1, 0)

            // Сначала вычисляем значения элементов слева от диагонального элемента,
            // так как эти значения используются при вычислении диагонального элемента.
            for (let j = 0; j < i; j++) {
                let temp = 0
                for (let k = 0; k < j; k++) {
                    temp += data[i][k] * data[j][k]
                }

                data[i][j] = (data[i][j] - temp) / data[j][j]
            }

            // Находим значение диагонального элемента
            let temp = data[i][i]
            for (let k = 0; k < i; k++) {
                temp -= data[i][k] * data[i][k]
            }
            res[i][i] = Math.sqrt(temp)
        }

        return res
    }

    export const rank = (data: number[][]): number => {
        const rows = data.length
        const cols = data[0].length
        const k = rows < cols ? rows : cols
        let r = 1
        let rank = 0

        while (r <= k) {
            const temp: number[][] = []
            for (let i = 0; i < r; i++) {
                temp[i] = []
            }

            for (let a = 0; a < rows - r + 1; a++) {
                for (let b = 0; b < cols - r + 1; b++) {
                    for (let c = 0; c < r; c++) {
                        for (let d = 0; d < r; d++) {
                            temp[c][d] = data[a + c][b + d]
                        }
                    }
                    if (determinant(temp) !== 0) {
                        rank = r
                    }
                }
            }
            r++
        }

        return rank
    }
}
