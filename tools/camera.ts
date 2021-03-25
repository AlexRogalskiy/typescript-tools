import { Vector } from './vector'
import { Errors } from '../src'

import valueError = Errors.valueError

export class Camera {
    static isCamera(value: any): boolean {
        return value instanceof Camera
    }

    static from(pos: Vector, lookAt: Vector): Camera {
        return new Camera(pos, lookAt)
    }

    static checkColor(value: Camera): void {
        if (!Camera.isCamera(value)) {
            throw valueError(`not valid Camera instance: [ ${value} ]`)
        }
    }

    protected forward: Vector
    protected right: Vector
    protected up: Vector

    constructor(protected pos: Vector, protected lookAt: Vector) {
        Vector.checkVector(pos)
        Vector.checkVector(lookAt)

        const down = new Vector(0.0, -1.0, 0.0)

        this.forward = Vector.norm(Vector.minus(lookAt, this.pos))
        this.right = Vector.times(1.5, Vector.norm(Vector.cross(this.forward, down)))
        this.up = Vector.times(1.5, Vector.norm(Vector.cross(this.forward, this.right)))
    }

    // clone(): Camera {
    //     return Camera.from(this.forward, this.right, this.up)
    // }

    toString(): string {
        return `(x: ${this.forward.toString()}, y: ${this.right.toString()}, z: ${this.up.toString()})`
    }

    equals(obj: any): boolean {
        return this.forward === obj.forward && this.right === obj.right && this.up === obj.up
    }

    toArray(): Vector[] {
        return [this.forward, this.right, this.up]
    }
}
