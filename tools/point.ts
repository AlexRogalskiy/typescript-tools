import { Checkers, Errors } from '../src'
import checkNumber = Checkers.checkNumber
import valueError = Errors.valueError
import isFunction = Checkers.isFunction

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
        return `(x: ${this.x}, y: ${this.y})`
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
    equal(obj: any): boolean {
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
