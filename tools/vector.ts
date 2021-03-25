import { Checkers, Errors } from '../src'

import checkNumber = Checkers.checkNumber
import valueError = Errors.valueError

export class Vector {
    private readonly subscribers = {}

    static minus(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    }

    static plus(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }

    static dot(v1: Vector, v2: Vector): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
    }

    static mag(v: Vector): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
    }

    static norm(v: Vector): Vector {
        const mag = Vector.mag(v)
        const div = mag === 0 ? Infinity : 1.0 / mag

        return Vector.times(div, v)
    }

    static cross(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x)
    }

    static times(k: number, v: Vector): Vector {
        return new Vector(k * v.x, k * v.y, k * v.z)
    }

    static isVector(value: any): boolean {
        return value instanceof Vector
    }

    static from(x: number, y: number, z: number): Vector {
        return new Vector(x, y, z)
    }

    static fromVector(value: Vector): Vector {
        return new Vector(value.x, value.y, value.z)
    }

    static checkVector(value: Vector): void {
        if (!Vector.isVector(value)) {
            throw valueError(`not vector instance: [ ${value} ]`)
        }
    }

    /**
     * Default {@link Point} constructor by input parameters
     * @param x initial input {@link Number} x
     * @param y initial input {@link Number} y
     * @param z initial input {@link Number} z
     */
    constructor(protected x: number, protected y: number, protected z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    scale(scale: number): Vector {
        checkNumber(scale)

        this.x *= scale
        this.y *= scale
        this.z *= scale

        return this
    }

    scaleAll(scaleX: number, scaleY: number, scaleZ: number): Vector {
        checkNumber(scaleX)
        checkNumber(scaleY)
        checkNumber(scaleZ)

        this.x *= scaleX
        this.y *= scaleY
        this.z *= scaleZ

        return this
    }

    add(vector: Vector): Vector {
        Vector.checkVector(vector)

        this.x += vector.getX()
        this.y += vector.getY()
        this.z += vector.getZ()

        return this
    }

    sub(vector: Vector): Vector {
        Vector.checkVector(vector)

        this.x -= vector.getX()
        this.y -= vector.getY()
        this.z -= vector.getZ()

        return this
    }

    negate(): Vector {
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z

        return this
    }

    length(): number {
        return Math.sqrt(this.lengthSquared())
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    normalize(): Vector {
        const len = this.length()

        if (len === 0) {
            throw valueError(`incorrect vector3d length: < ${len} >`)
        }

        this.x /= len
        this.y /= len
        this.z /= len

        return this
    }

    rotate(angle: number): Vector {
        checkNumber(angle)

        const phi = Math.acos(this.z / this.length())
        const xy = this.x === 0 && this.y >= 0 ? Math.PI / 2 : (3 * Math.PI) / 2
        const yx = Math.PI + Math.atan2(this.y, this.x)
        const theta = this.x > 0 ? Math.atan2(this.y, this.x) : this.x < 0 ? yx : xy

        let cosVal = Math.cos(theta)
        let sinVal = Math.sin(theta)

        this.x = this.x * cosVal + this.y * sinVal
        this.y = -this.x * sinVal + this.y * cosVal

        cosVal = Math.cos(phi)
        sinVal = Math.sin(phi)
        this.x = this.x * cosVal - this.z * sinVal
        this.z = this.x * sinVal + this.z * cosVal

        this.rotateZ(angle)
        this.rotateZ(theta)
        this.rotateY(phi)

        return this
    }

    rotateX(angle: number): Vector {
        checkNumber(angle)

        const vyy = this.y,
            vzz = this.z,
            cosVal = Math.cos(angle),
            sinVal = Math.sin(angle)
        this.y = vyy * cosVal - vzz * sinVal
        this.z = vyy * sinVal + vzz * cosVal

        return this
    }

    rotateY(angle: number): Vector {
        checkNumber(angle)

        const vxx = this.x,
            vzz = this.z,
            cosVal = Math.cos(angle),
            sinVal = Math.sin(angle)
        this.x = vxx * cosVal + vzz * sinVal
        this.z - vxx * sinVal + vzz * cosVal

        return this
    }

    rotateZ(angle: number): Vector {
        checkNumber(angle)

        const vxx = this.x,
            vyy = this.y,
            cosVal = Math.cos(angle),
            sinVal = Math.sin(angle)
        this.x = vxx * cosVal - vyy * sinVal
        this.y = vxx * sinVal + vyy * cosVal

        return this
    }

    shift(deltaX: number, deltaY: number, deltaZ: number): Vector {
        checkNumber(deltaX)
        checkNumber(deltaY)
        checkNumber(deltaZ)

        this.x += deltaX
        this.y += deltaY
        this.z += deltaZ

        return this
    }

    toString(): string {
        return `(x: ${this.x.toFixed(3)}, y: ${this.y.toFixed(3)}, z: ${this.z.toFixed(3)})`
    }

    vectorMultiply(vector: Vector): Vector {
        Vector.checkVector(vector)

        const vxx = this.x * vector.getZ() - this.z * vector.getY()
        const vyy = this.z * vector.getX() - this.x * vector.getZ()
        const vzz = this.x * vector.getY() - this.y * vector.getX()

        return Vector.from(vxx, vyy, vzz)
    }

    scalarMultiply(vector: Vector): number {
        Vector.checkVector(vector)

        return this.x * vector.getX() + this.y * vector.getY() + this.z * vector.getZ()
    }

    distance(vector: Vector): number {
        Vector.checkVector(vector)

        const resX = (this.x - vector.getX()) * (this.x - vector.getX())
        const resY = (this.y - vector.getY()) * (this.y - vector.getY())
        const resZ = (this.z - vector.getZ()) * (this.z - vector.getZ())
        const res = resX + resY + resZ

        return res > 0 ? Math.sqrt(res) : 0
    }

    angle(vector: Vector): number {
        Vector.checkVector(vector)

        return Math.acos(this.scalarMultiply(vector) / (this.length() * vector.length()))
    }

    equals(vector: Vector): boolean {
        Vector.checkVector(vector)

        return this.x === vector.getX() && this.y === vector.getY() && this.z === vector.getZ()
    }

    toArray(): number[] {
        return [this.x, this.y, this.z]
    }

    toSphereCoordinates(): { r: number; psi: number; phi: number } {
        const r = this.length(),
            psi = Math.asin(this.z / r),
            phi = this.y / Math.sqrt(this.x * this.x + this.y * this.y)
        return { r, psi, phi }
    }

    getX(): number {
        return this.x
    }

    getY(): number {
        return this.y
    }

    getZ(): number {
        return this.z
    }

    setX(value: number): Vector {
        checkNumber(value)

        this.x = value

        return this
    }

    setY(value: number): Vector {
        checkNumber(value)

        this.y = value

        return this
    }

    setZ(value: number): Vector {
        checkNumber(value)

        this.z = value

        return this
    }

    clone(): Vector {
        return Vector.from(this.x, this.y, this.z)
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
