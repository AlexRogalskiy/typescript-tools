import { Errors } from '../src'

/**
 * ColorType
 * @desc Type representing color parameters
 */
export type ColorType = {
    r: number
    g: number
    b: number
}

export class Color {
    private readonly subscribers = {}

    static white = new Color(1.0, 1.0, 1.0)
    static grey = new Color(0.5, 0.5, 0.5)
    static black = new Color(0.0, 0.0, 0.0)

    static isColor(value: any): boolean {
        return value instanceof Color
    }

    static scale(k: number, v: Color): Color {
        return Color.from(k * v.r, k * v.g, k * v.b)
    }

    static plus(v1: Color, v2: Color): Color {
        return Color.from(v1.r + v2.r, v1.g + v2.g, v1.b + v2.b)
    }

    static times(v1: Color, v2: Color): Color {
        return Color.from(v1.r * v2.r, v1.g * v2.g, v1.b * v2.b)
    }

    static from(r: number, g: number, b: number): Color {
        return new Color(r, g, b)
    }

    static toDrawingColor(c: Color): Color {
        const legalize = (d: number): number => {
            return d > 1 ? 1 : d
        }

        return Color.from(
            Math.floor(legalize(c.r) * 255),
            Math.floor(legalize(c.g) * 255),
            Math.floor(legalize(c.b) * 255),
        )
    }

    static checkColor(value: Color): void {
        if (!Color.isColor(value)) {
            throw Errors.valueError(`not valid Color instance: [ ${value} ]`)
        }
    }

    /**
     * Default {@link Color} constructor by input parameters
     * @param r initial red {@link Number} r
     * @param g initial green {@link Number} g
     * @param b initial blue {@link Number} b
     */
    constructor(public r: number, public g: number, public b: number) {
        this.r = r
        this.g = g
        this.b = b
    }

    clone(): Color {
        return Color.from(this.r, this.g, this.b)
    }

    toString(): string {
        return `(x: ${this.r.toFixed(0)}, y: ${this.g.toFixed(0)}, z: ${this.b.toFixed(0)})`
    }

    equals(obj: any): boolean {
        return this.r === obj.r && this.g === obj.g && this.b === obj.b
    }

    toArray(): number[] {
        return [this.r, this.g, this.b]
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
