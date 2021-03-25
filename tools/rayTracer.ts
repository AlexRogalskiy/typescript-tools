import { Color } from './color'
import { Vector } from './vector'

import { Optional } from '../typings/standard-types'
import { Intersection, Ray, Scene, Thing } from '../typings/domain-types'

export class RayTracer {
    private maxDepth = 5

    intersections(ray: Ray, scene: Scene): Optional<Intersection<Thing>> {
        let closest = +Infinity
        let closestInter: Optional<Intersection<Thing>> = undefined

        for (const thing of scene.things) {
            const inter = thing.intersect(ray)
            if (inter != null && inter.dist < closest) {
                closestInter = inter
                closest = inter.dist
            }
        }

        return closestInter
    }

    testRay(ray: Ray, scene: Scene): Optional<number> {
        const isect = this.intersections(ray, scene)

        if (isect != null) {
            return isect.dist
        }

        return undefined
    }

    private traceRay(ray: Ray, scene: Scene, depth: number): Color {
        const isect = this.intersections(ray, scene)

        if (isect === undefined || isect === null) {
            return Color.black
        }

        return this.shade(isect, scene, depth)
    }

    shade(isect: Intersection<Thing>, scene: Scene, depth: number): Color {
        const d = isect.ray.dir
        const pos = Vector.plus(Vector.times(isect.dist, d), isect.ray.start)
        const normal = isect.thing.normal(pos)
        const reflectDir = Vector.minus(d, Vector.times(2, Vector.times(Vector.dot(normal, d), normal)))
        const naturalColor = Color.plus(
            Color.black,
            this.getNaturalColor(isect.thing, pos, normal, reflectDir, scene),
        )
        const reflectedColor =
            depth >= this.maxDepth
                ? Color.grey
                : this.getReflectionColor(isect.thing, pos, normal, reflectDir, scene, depth)

        return Color.plus(naturalColor, reflectedColor)
    }

    getReflectionColor(
        thing: Thing,
        pos: Vector,
        normal: Vector,
        rd: Vector,
        scene: Scene,
        depth: number,
    ): Color {
        console.log(normal)
        return Color.scale(
            thing.surface.reflect(pos),
            this.traceRay({ start: pos, dir: rd }, scene, depth + 1),
        )
    }

    getNaturalColor(thing: Thing, pos: Vector, norm: Vector, rd: Vector, scene: Scene): Color {
        const addLight = (col, light): Color => {
            const ldis = Vector.minus(light.pos, pos)
            const livec = Vector.norm(ldis)
            const neatIsect = this.testRay({ start: pos, dir: livec }, scene)
            const isInShadow =
                neatIsect === undefined || neatIsect === null ? false : neatIsect <= Vector.mag(ldis)
            if (isInShadow) {
                return col
            }
            const illum = Vector.dot(livec, norm)
            const lcolor = illum > 0 ? Color.scale(illum, light.color) : Color.black
            const specular = Vector.dot(livec, Vector.norm(rd))
            const scolor =
                specular > 0
                    ? Color.scale(Math.pow(specular, thing.surface.roughness), light.color)
                    : Color.black
            return Color.plus(
                col,
                Color.plus(
                    Color.times(thing.surface.diffuse(pos), lcolor),
                    Color.times(thing.surface.specular(pos), scolor),
                ),
            )
        }

        return scene.lights.reduce(addLight, Color.white)
    }

    render(scene, ctx, screenWidth, screenHeight): void {
        const getPoint = (x, y, camera): Vector => {
            const recenterX = (x: number): number => (x - screenWidth / 2.0) / 2.0 / screenWidth
            const recenterY = (y: number): number => -(y - screenHeight / 2.0) / 2.0 / screenHeight

            return Vector.norm(
                Vector.plus(
                    camera.forward,
                    Vector.plus(
                        Vector.times(recenterX(x), camera.right),
                        Vector.times(recenterY(y), camera.up),
                    ),
                ),
            )
        }

        for (let y = 0; y < screenHeight; y++) {
            for (let x = 0; x < screenWidth; x++) {
                const color = this.traceRay(
                    { start: scene.camera.pos, dir: getPoint(x, y, scene.camera) },
                    scene,
                    0,
                )
                const c = Color.toDrawingColor(color)
                ctx.fillStyle = `rgb(${String(c.r)}, ${String(c.g)}, ${String(c.b)})`
                ctx.fillRect(x, y, x + 1, y + 1)
            }
        }
    }
}
