import { Checkers } from './checkers'
import { Exceptions } from './exceptions'
import { Supplier } from '../typings/function-types'
import { NumberOrUndef, StringOrUndef, ValueOrUndef } from '../typings/standard-types'

export namespace Maths {
    import isIntNumber = Checkers.isIntNumber
    import exception = Exceptions.exception
    import isNumber = Checkers.isNumber
    import isString = Checkers.isString
    import isNull = Checkers.isNull

    type Vector2D = { x: number; y: number }
    //type Vector3D = { x: number; y: number; z: number }

    // const sqrt = Math.sqrt
    // const atan2 = Math.atan2
    // const pow = Math.pow
    // const abs = Math.abs
    // const PiBy180 = Math.PI / 180
    // const PiBy180Inv = 180 / Math.PI
    const PiBy2 = Math.PI / 2
    const invLog2 = 1 / Math.log(2)

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

    // let myArray = vector(10, 0);
    export const vector = <T>(dimension = 0, initial: null): ValueOrUndef<T>[] => {
        if (!isIntNumber(dimension) || dimension < 0) {
            throw exception('ValueError', `incorrect input values: array dimension < ${dimension} >`)
        }

        const arr: ValueOrUndef<T>[] = []
        for (let i = 0; i < dimension; i++) {
            arr[i] = initial
        }

        return arr
    }

    // let myMatrix = globals.toolset.matrix(4, 4, 0);
    export const matrix = <T>(rows: number, columns: number, initial: T): T[][] => {
        if (!isIntNumber(rows) || !isIntNumber(columns) || rows < 0 || columns < 0) {
            throw exception(
                'ValueError',
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
            throw exception('ValueError', `incorrect {min} value: < ${min} >`)
        }

        const maxValue = isNumber(max) ? max : null
        if (isNull(maxValue)) {
            throw exception('ValueError', `incorrect {max} value: < ${max} >`)
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (minValue > maxValue) {
            throw exception('ValueError', `incorrect range size: min < ${minValue} >, max < ${maxValue} >`)
        }

        const deltaValue = delta == null ? 1 : isNumber(delta) && delta > 0 ? delta : null
        if (isNull(deltaValue)) {
            throw exception('Error', `incorrect {delta} value: < ${delta} >`)
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
            throw exception('ValueError', `incorrect prefix value: < ${prefixValue} >`)
        }

        let seqValue = seq == null ? 0 : isNumber(seq) ? seq : null
        if (isNull(seqValue)) {
            throw exception('ValueError', `incorrect sequence value: < ${seqValue} >`)
        }

        return {
            gensym: () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return prefixValue + seqValue++
            },
        }
    }
}
