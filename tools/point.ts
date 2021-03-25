import { Checkers, Errors, Numbers } from '../src'

import { NumberProcessor } from '../typings/function-types'

import checkNumber = Checkers.checkNumber
import valueError = Errors.valueError
import isFunction = Checkers.isFunction
import NumberOperations = Numbers.NumberOperations

export class Point {
    private static readonly operands: Point[] = []
    private readonly subscribers = {}

    static isPoint(value: any): boolean {
        return value instanceof Point
    }

    static from(x: number, y: number): Point {
        return new Point(x, y)
    }

    static fromPoint(value: Point): Point {
        return new Point(value.x, value.y)
    }

    static checkPoint(value: Point): void {
        if (!Point.isPoint(value)) {
            throw valueError(`not valid point instance: [ ${value} ]`)
        }
    }

    /**
     * Default {@link Point} constructor by input parameters
     * @param x initial input {@link Number} x
     * @param y initial input {@link Number} y
     */
    constructor(private x: number, private y: number) {
        this.x = x
        this.y = y

        if (!isFunction(Point.prototype['_'])) {
            Object.defineProperty(Point.prototype, '_', {
                set(value) {
                    const ops = Point.operands
                    let operator
                    if ((ops.length >= 2 && value === 3 * ops.length) || value === Math.pow(3, ops.length)) {
                        operator = this.addBy
                    } else if (ops.length === 2 && value === 0) {
                        operator = this.subtractBy
                    }

                    const result = operator.apply(this, ops)
                    ops.splice(0, ops.length)

                    return result
                },
                enumerable: true,
                configurable: true,
            })
        }
    }

    /**
     * Adds point value to this point
     * @param {Point} point:
     * @return {Point} thisArg
     * @chainable
     */
    add(point: Point): Point {
        Point.checkPoint(point)

        this.x += point.x
        this.y += point.y

        return this
    }

    /**
     * Subtracts value from this point
     * @param {Point} point
     * @return {Point} thisArg
     * @chainable
     */
    subtract(point: Point): Point {
        Point.checkPoint(point)

        this.x -= point.x
        this.y -= point.y

        return this
    }

    /**
     * Adds scalar value to this point
     * @param {Number} value
     * @return {Point} thisArg
     * @chainable
     */
    addScalar(value: number): Point {
        checkNumber(value)

        this.x += value
        this.y += value

        return this
    }

    /**
     * Scales this point by input value
     * @param {Number} value
     * @return {Point} thisArg
     * @chainable
     */
    scale(value: number): Point {
        checkNumber(value)

        this.x *= value
        this.y *= value

        return this
    }

    /**
     * Negate this point
     * @return {Point} thisArg
     * @chainable
     */
    negate(): Point {
        this.x = -this.x
        this.y = -this.y

        return this
    }

    /**
     * Computes the distance between this point and another point.
     * @param {Point} point The point to compute the distance with.
     * @returns {Number} The distance between the 2 points
     */
    distanceTo(point: Point): number {
        Point.checkPoint(point)

        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
    }

    /**
     * Computes the squared distance between this point and another point.
     * Useful for optimizing things like comparing distances.
     * @param {Point} point The point to compute the squared distance with.
     * @returns {Number} The squared distance between the 2 points
     */
    squaredDistanceTo(point: Point): number {
        Point.checkPoint(point)

        return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)
    }

    /**
     * Rotates the point around the specified pivot
     * From http://stackoverflow.com/questions/4465931/rotate-rectangle-around-a-point
     * @function
     * @param degrees degress to rotate around the pivot.
     * @param {Point} [pivot=(0,0)] Point around which to rotate.
     * Defaults to the origin.
     * @returns {Point}. A new point representing the point rotated around the specified pivot
     */
    rotate(degrees: number, pivot: Point): Point {
        pivot = pivot || new Point(0, 0)

        let cos, sin
        // Avoid float computations when possible
        if (degrees % 90 === 0) {
            const d = NumberOperations.positiveModulo(degrees, 360)
            if (d === 0) {
                cos = 1
                sin = 0
            } else if (d === 90) {
                cos = 0
                sin = 1
            } else if (d === 180) {
                cos = -1
                sin = 0
            } else if (d === 270) {
                cos = 0
                sin = -1
            }
        } else {
            const angle = (degrees * Math.PI) / 180.0
            cos = Math.cos(angle)
            sin = Math.sin(angle)
        }

        const x = cos * (this.x - pivot.x) - sin * (this.y - pivot.y) + pivot.x
        const y = sin * (this.x - pivot.x) + cos * (this.y - pivot.y) + pivot.y

        return new Point(x, y)
    }

    /**
     * Applies a function to each coordinate of this point and return a new point.
     * @param {function} func The function to apply to each coordinate.
     * @returns {Point} A new point with the coordinates computed
     * by the specified function
     */
    apply(func: NumberProcessor<number>): Point {
        return new Point(func(this.x), func(this.y))
    }

    /**
     * Divides this point by a value
     * @param {Number} value
     * @return {Point} thisArg
     * @chainable
     */
    divide(value: number): Point {
        checkNumber(value)

        if (value === 0) {
            throw valueError(`Invalid input value=${value}, should not be equal to zero`)
        }

        this.x /= value
        this.y /= value

        return this
    }

    /**
     * Returns true if this point is less than another one
     * @return {Boolean}
     * @param point
     */
    lt(point: Point): boolean {
        return this.x < point.x && this.y < point.y
    }

    /**
     * Returns true if this point is less than or equal to another one
     * @return {Boolean}
     * @param point
     */
    lte(point: Point): boolean {
        return this.x <= point.x && this.y <= point.y
    }

    /**
     * Returns true if this point is greater another one
     * @return {Boolean}
     * @param point
     */
    gt(point: Point): boolean {
        return this.x > point.x && this.y > point.y
    }

    /**
     * Returns true if this point is greater than or equal to another one
     * @return {Boolean}
     * @param point
     */
    gte(point: Point): boolean {
        return this.x >= point.x && this.y >= point.y
    }

    /**
     * Returns new point which is the result of linear interpolation with this one and another one
     * @param point
     * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
     * @return {Point}
     */
    lerp(point: Point, t = 0.5): Point {
        t = Math.max(Math.min(1, t), 0)

        return Point.from(this.x + (point.x - this.x) * t, this.y + (point.y - this.y) * t)
    }

    distanceFrom(point: Point): number {
        const dx = this.x - point.x
        const dy = this.y - point.y

        return Math.sqrt(dx * dx + dy * dy)
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    /**
     * Returns the point between this point and another one
     * @return {Point}
     * @param point
     */
    midPointFrom(point: Point): Point {
        return this.lerp(point)
    }

    /**
     * Returns a new point which is the min of this and another one
     * @return {Point}
     * @param point
     */
    min(point: Point): Point {
        return Point.from(Math.min(this.x, point.x), Math.min(this.y, point.y))
    }

    /**
     * Returns a new point which is the max of this and another one
     * @return {Point}
     * @param point
     */
    max(point: Point): Point {
        return Point.from(Math.max(this.x, point.x), Math.max(this.y, point.y))
    }

    /**
     * Returns string representation of this point
     * @return {String}
     */
    toString(): string {
        return `(x: ${Math.round(this.x * 100) / 100}, y: ${Math.round(this.y * 100) / 100})`
    }

    /**
     * Sets x/y of this point
     * @param {Number} x
     * @param {Number} y
     * @chainable
     */
    setXY(x: number, y: number): Point {
        this.x = x
        this.y = y

        return this
    }

    /**
     * Sets x of this point
     * @param {Number} x
     * @chainable
     */
    setX(x: number): Point {
        this.x = x

        return this
    }

    /**
     * Sets y of this point
     * @param {Number} y
     * @chainable
     */
    setY(y: number): Point {
        this.y = y

        return this
    }

    /**
     * Sets x/y of this point from another point
     * @chainable
     * @param point
     */
    setFromPoint(point: Point): Point {
        Point.checkPoint(point)

        this.x = point.x
        this.y = point.y

        return this
    }

    /**
     * Swaps x/y of this point and another point
     * @param point
     */
    swap(point: Point): void {
        Point.checkPoint(point)

        const x = this.x
        const y = this.y

        this.x = point.x
        this.y = point.y

        point.x = x
        point.y = y
    }

    /**
     * return a cloned instance of the point
     * @return {Point}
     */
    clone(): Point {
        return Point.from(this.x, this.y)
    }

    /**
     * Returns true if this point is equal to another one
     * @return {Boolean}
     * @param obj
     */
    equals(obj: any): boolean {
        Point.checkPoint(obj)

        return this.x === obj.x && this.y === obj.y
    }

    multiplyBy(...args: Point[]): Point {
        for (const item of args) {
            this.x *= item.x
            this.y *= item.y
        }

        return this
    }

    divideBy(...args: Point[]): Point {
        for (const item of args) {
            this.x /= item.x
            this.y /= item.y
        }

        return this
    }

    addBy(...args: Point[]): Point {
        for (const item of args) {
            this.x += item.x
            this.y += item.y
        }

        return this
    }

    subtractBy(...args: Point[]): Point {
        for (const item of args) {
            this.x -= item.x
            this.y -= item.y
        }

        return this
    }

    getX(): number {
        return this.x
    }

    getY(): number {
        return this.y
    }

    valueOf(): number {
        Point.operands.push(this)
        return 3
    }

    on(event: string, cb: any): void {
        const list: any[] = this.subscribers[event]
        if (list && list.indexOf(cb) === 0) {
            list.push(cb)
        } else {
            this.subscribers[event] = [cb]
        }
    }

    notify(event: string): void {
        const list: any[] = this.subscribers[event]
        if (list) {
            for (const cb of list) {
                cb()
            }
        }
    }
}
