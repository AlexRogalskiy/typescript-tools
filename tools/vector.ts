import { Checkers, Errors } from '../src'

import checkNumber = Checkers.checkNumber
import valueError = Errors.valueError
import isNumber = Checkers.isNumber

export class Vector {
    private readonly subscribers = {}

    static isVector(value: any): boolean {
        return value instanceof Vector
    }

    static from(x: number, y: number, z: number): Vector {
        return new Vector(x, y, z)
    }

    static fromVector(value: Vector): Vector {
        return new Vector(value.x, value.y, value.z)
    }

    /**
     * Default {@link Point} constructor by input parameters
     * @param x initial input {@link Number} x
     * @param y initial input {@link Number} y
     * @param z initial input {@link Number} z
     */
    constructor(private x: number, private y: number, private z: number) {
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
        if (!Vector.isVector(vector)) {
            throw valueError(`not Vector instance: < ${vector} >`)
        }

        this.x += vector.getCoordX()
        this.y += vector.getCoordY()
        this.z += vector.getCoordZ()

        return this
    }

    sub(vector: Vector): Vector {
        if (!Vector.isVector(vector)) {
            throw valueError(`not Vector instance: < ${vector} >`)
        }

        this.x -= vector.getCoordX()
        this.y -= vector.getCoordY()
        this.z -= vector.getCoordZ()

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
        if (!isNumber(angle)) {
            throw valueError(`incorrect input value: angle < ${angle} >`)
        }

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
        if (!Vector.isVector(vector)) {
            throw valueError(`not Vector instance: < ${vector} >`)
        }

        const vxx = this.x * vector.getCoordZ() - this.z * vector.getCoordY()
        const vyy = this.z * vector.getCoordX() - this.x * vector.getCoordZ()
        const vzz = this.x * vector.getCoordY() - this.y * vector.getCoordX()

        return Vector.from(vxx, vyy, vzz)
    }

    scalarMultiply(vector: Vector): number {
        if (!Vector.isVector(vector)) {
            throw valueError(`not Vector instance: < ${vector} >`)
        }

        return this.x * vector.getCoordX() + this.y * vector.getCoordY() + this.z * vector.getCoordZ()
    }

    distance(vector: Vector): number {
        if (!Vector.isVector(vector)) {
            throw valueError(`not Vector instance: < ${vector} >`)
        }

        const resX = (this.x - vector.getCoordX()) * (this.x - vector.getCoordX())
        const resY = (this.y - vector.getCoordY()) * (this.y - vector.getCoordY())
        const resZ = (this.z - vector.getCoordZ()) * (this.z - vector.getCoordZ())
        const res = resX + resY + resZ

        return res > 0 ? Math.sqrt(res) : 0
    }

    angle(vector: Vector): number {
        if (!Vector.isVector(vector)) {
            throw valueError(`not Vector instance: < ${vector} >`)
        }

        return Math.acos(this.scalarMultiply(vector) / (this.length() * vector.length()))
    }

    equals(vector: Vector): boolean {
        if (!Vector.isVector(vector)) {
            throw valueError(`not Vector instance: < ${vector} >`)
        }

        return this.x === vector.getCoordX() && this.y === vector.getCoordY() && this.z === vector.getCoordZ()
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

    getCoordX(): number {
        return this.x
    }

    getCoordY(): number {
        return this.y
    }

    getCoordZ(): number {
        return this.z
    }

    equal(obj: any): boolean {
        return this.x === obj.vx && this.y === obj.vy && this.z === obj.vz
    }

    setCoordX(value: number): Vector {
        checkNumber(value)

        this.x = value

        return this
    }

    setCoordY(value: number): Vector {
        checkNumber(value)

        this.y = value

        return this
    }

    setCoordZ(value: number): Vector {
        checkNumber(value)

        this.z = value

        return this
    }

    clone(): Vector {
        return Vector.from(this.x, this.y, this.z)
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
