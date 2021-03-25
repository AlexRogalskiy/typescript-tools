import { Optional } from '../typings/standard-types'
import { Intersection, Ray, Surface, Thing } from '../typings/domain-types'
import { Vector } from './vector'

export class Sphere implements Thing {
    protected radius2: number

    constructor(protected center: Vector, protected radius: number, public surface: Surface) {
        this.radius2 = radius * radius
    }

    normal(pos: Vector): Vector {
        return Vector.norm(Vector.minus(pos, this.center))
    }

    intersect(ray: Ray): Optional<Intersection<Sphere>> {
        const eo = Vector.minus(this.center, ray.start)
        const v = Vector.dot(eo, ray.dir)

        let dist = 0
        if (v >= 0) {
            const disc = this.radius2 - (Vector.dot(eo, eo) - v * v)
            if (disc >= 0) {
                dist = v - Math.sqrt(disc)
            }
        }

        if (dist === 0) {
            return null
        }

        return { thing: this, ray, dist }
    }
}
