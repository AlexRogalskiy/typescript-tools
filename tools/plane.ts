import { Intersection, Ray, Surface, Thing } from '../typings/domain-types'
import { Vector } from './vector'
import { Optional } from '../typings/standard-types'

export class Plane implements Thing {
    normal: (pos: Vector) => Vector
    intersect: (ray: Ray) => Optional<Intersection<Plane>>

    constructor(protected norm: Vector, protected offset: number, public surface: Surface) {
        this.normal = (pos: Vector): Vector => {
            console.log(pos)
            return norm
        }

        this.intersect = (ray: Ray): Optional<Intersection<Plane>> => {
            const denom = Vector.dot(norm, ray.dir)

            if (denom > 0) {
                return null
            }

            const dist = (Vector.dot(norm, ray.start) + offset) / -denom

            return { thing: this, ray, dist }
        }
    }
}
