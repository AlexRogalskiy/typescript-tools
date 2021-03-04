import { Checkers, Errors } from '../src'

import checkNumber = Checkers.checkNumber
import valueError = Errors.valueError

export class Point {
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

    /**
     * Default {@link Point} constructor by input parameters
     * @param x initial input {@link Number} x
     * @param y initial input {@link Number} y
     */
    constructor(private x: number, private y: number) {
        this.x = x
        this.y = y
    }

    /**
     * Adds point value to this point
     * @param {Point} point:
     * @return {Point} thisArg
     * @chainable
     */
    add(point: Point): Point {
        if (!Point.isPoint(point)) {
            throw valueError(`not valid point instance: < ${point} >`)
        }

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
        if (!Point.isPoint(point)) {
            throw valueError(`not valid point instance: < ${point} >`)
        }

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
        return `${this.x},${this.y}`
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
        this.x = point.x
        this.y = point.y

        return this
    }

    /**
     * Swaps x/y of this point and another point
     * @param point
     */
    swap(point: Point): void {
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
        if (!Point.isPoint(obj)) {
            throw valueError(`not point instance: < ${obj} >`)
        }

        return this.x === obj.x && this.y === obj.y
    }

    on(eventName: string, cb: any): void {
        const list: any[] = this.subscribers[eventName]
        if (list && list.indexOf(cb) === 0) {
            list.push(cb)
        } else {
            this.subscribers[eventName] = [cb]
        }
    }

    notify(eventName: string): void {
        const list: any[] = this.subscribers[eventName]
        if (list) {
            for (const cb of list) {
                cb()
            }
        }
    }
}
