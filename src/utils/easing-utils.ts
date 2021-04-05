export namespace EasingUtils {
    /**
     * Cubic easing in and out
     */
    export const easeInOutCubic = (t: number, b: number, c: number, d: number): number => {
        t /= d / 2
        return t < 1 ? (c / 2) * t * t * t + b : (c / 2) * ((t -= 2) * t * t + 2) + b
    }

    /**
     * Quartic easing in
     */
    export const easeInQuart = (t: number, b: number, c: number, d: number): number => {
        return c * (t /= d) * t * t * t + b
    }

    /**
     * Quartic easing out
     */
    export const easeOutQuart = (t: number, b: number, c: number, d: number): number => {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    }

    /**
     * Quartic easing in and out
     */
    export const easeInOutQuart = (t: number, b: number, c: number, d: number): number => {
        t /= d / 2
        return t < 1 ? (c / 2) * t * t * t * t + b : (-c / 2) * ((t -= 2) * t * t * t - 2) + b
    }

    /**
     * Quintic easing in
     */
    export const easeInQuint = (t: number, b: number, c: number, d: number): number => {
        return c * (t /= d) * t * t * t * t + b
    }

    /**
     * Quintic easing out
     */
    export const easeOutQuint = (t: number, b: number, c: number, d: number): number => {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    }

    /**
     * Quintic easing in and out
     */
    export const easeInOutQuint = (t: number, b: number, c: number, d: number): number => {
        t /= d / 2
        if (t < 1) {
            return (c / 2) * t * t * t * t * t + b
        }
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b
    }

    /**
     * Sinusoidal easing in
     */
    export const easeInSine = (t: number, b: number, c: number, d: number): number => {
        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
    }

    /**
     * Sinusoidal easing out
     */
    export const easeOutSine = (t: number, b: number, c: number, d: number): number => {
        return c * Math.sin((t / d) * (Math.PI / 2)) + b
    }

    /**
     * Sinusoidal easing in and out

     */
    export const easeInOutSine = (t: number, b: number, c: number, d: number): number => {
        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
    }

    /**
     * Exponential easing in
     */
    export const easeInExpo = (t: number, b: number, c: number, d: number): number => {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    }

    /**
     * Exponential easing out
     */
    export const easeOutExpo = (t: number, b: number, c: number, d: number): number => {
        return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
    }

    /**
     * Exponential easing in and out
     */
    export const easeInOutExpo = (t: number, b: number, c: number, d: number): number => {
        if (t === 0) {
            return b
        }
        if (t === d) {
            return b + c
        }
        t /= d / 2
        return t < 1 ? (c / 2) * Math.pow(2, 10 * (t - 1)) + b : (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
    }

    /**
     * Circular easing in
     */
    export const easeInCirc = (t: number, b: number, c: number, d: number): number => {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    }

    /**
     * Circular easing out
     */
    export const easeOutCirc = (t: number, b: number, c: number, d: number): number => {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    }

    /**
     * Circular easing in and out
     */
    export const easeInOutCirc = (t: number, b: number, c: number, d: number): number => {
        t /= d / 2
        return t < 1
            ? (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
            : (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    }

    /**
     * Quadratic easing in and out
     */
    export const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
        t /= d / 2
        return t < 1 ? (c / 2) * t * t + b : (-c / 2) * (--t * (t - 2) - 1) + b
    }

    /**
     * Backwards easing in
     */
    export const easeInBack = (t: number, b: number, c: number, d: number, s: number): number => {
        if (s === undefined) {
            s = 1.70158
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    }

    /**
     * Backwards easing out
     */
    export const easeOutBack = (t: number, b: number, c: number, d: number, s: number): number => {
        if (s === undefined) {
            s = 1.70158
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    }

    /**
     * Backwards easing in and out
     */
    export const easeInOutBack = (t: number, b: number, c: number, d: number, s: number): number => {
        if (s === undefined) {
            s = 1.70158
        }
        t /= d / 2
        return t < 1
            ? (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
            : (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    }

    /**
     * Bouncing easing in
     */
    export const easeInBounce = (t: number, b: number, c: number, d: number): number => {
        return c - easeOutBounce(d - t, 0, c, d) + b
    }

    /**
     * Bouncing easing out
     */
    export const easeOutBounce = (t: number, b: number, c: number, d: number): number => {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
        }
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
    }

    /**
     * Bouncing easing in and out
     */
    export const easeInOutBounce = (t: number, b: number, c: number, d: number): number => {
        return t < d / 2
            ? easeInBounce(t * 2, 0, c, d) * 0.5 + b
            : easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    }

    /**
     * Quadratic easing in
     */
    export const easeInQuad = (t: number, b: number, c: number, d: number): number => {
        return c * (t /= d) * t + b
    }

    /**
     * Quadratic easing out
     */
    export const easeOutQuad = (t: number, b: number, c: number, d: number): number => {
        return -c * (t /= d) * (t - 2) + b
    }

    /**
     * Cubic easing in
     */
    export const easeInCubic = (t: number, b: number, c: number, d: number): number => {
        return c * (t /= d) * t * t + b
    }

    /*
    ------------------------------------------
    | inQuad:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inQuad.
    ------------------------------------------ */
    export const linear = (t, b, c, d): number => {
        return (t / d) * (b + c)
    }

    /*
    ------------------------------------------
    | inQuad:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inQuad.
    ------------------------------------------ */
    export const inQuad = (t, b, c, d): number => {
        return c * (t /= d) * t + b
    }

    /*
    ------------------------------------------
    | outQuad:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outQuad.
    ------------------------------------------ */
    export const outQuad = (t, b, c, d): number => {
        return -c * (t /= d) * (t - 2) + b
    }

    /*
    ------------------------------------------
    | inOutQuad:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutQuad.
    ------------------------------------------ */
    export const inOutQuad = (t, b, c, d): number => {
        return (t /= d / 2) < 1 ? (c / 2) * t * t + b : (-c / 2) * (--t * (t - 2) - 1) + b
    }

    /*
    ------------------------------------------
    | inCubic:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inCubic.
    ------------------------------------------ */
    export const inCubic = (t, b, c, d): number => {
        return c * (t /= d) * t * t + b
    }

    /*
    ------------------------------------------
    | outCubic:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outCubic.
    ------------------------------------------ */
    export const outCubic = (t, b, c, d): number => {
        return c * ((t = t / d - 1) * t * t + 1) + b
    }

    /*
    ------------------------------------------
    | inOutCubic:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutCubic.
    ------------------------------------------ */
    export const inOutCubic = (t, b, c, d): number => {
        return (t /= d / 2) < 1 ? (c / 2) * t * t * t + b : (c / 2) * ((t -= 2) * t * t + 2) + b
    }

    /*
    ------------------------------------------
    | inQuart:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inQuart.
    ------------------------------------------ */
    export const inQuart = (t, b, c, d): number => {
        return c * (t /= d) * t * t * t + b
    }

    /*
    ------------------------------------------
    | outQuart:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outQuart.
    ------------------------------------------ */
    export const outQuart = (t, b, c, d): number => {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    }

    /*
    ------------------------------------------
    | inOutQuart:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutQuart.
    ------------------------------------------ */
    export const inOutQuart = (t, b, c, d): number => {
        return (t /= d / 2) < 1 ? (c / 2) * t * t * t * t + b : (-c / 2) * ((t -= 2) * t * t * t - 2) + b
    }

    /*
    ------------------------------------------
    | inQuint:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inQuint.
    ------------------------------------------ */
    export const inQuint = (t, b, c, d): number => {
        return c * (t /= d) * t * t * t * t + b
    }

    /*
    ------------------------------------------
    | outQuint:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outQuint.
    ------------------------------------------ */
    export const outQuint = (t, b, c, d): number => {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    }

    /*
    ------------------------------------------
    | inOutQuint:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutQuint.
    ------------------------------------------ */
    export const inOutQuint = (t, b, c, d): number => {
        return (t /= d / 2) < 1
            ? (c / 2) * t * t * t * t * t + b
            : (c / 2) * ((t -= 2) * t * t * t * t + 2) + b
    }

    /*
    ------------------------------------------
    | inSine:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inSine.
    ------------------------------------------ */
    export const inSine = (t, b, c, d): number => {
        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
    }

    /*
    ------------------------------------------
    | outSine:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outSine.
    ------------------------------------------ */
    export const outSine = (t, b, c, d): number => {
        return c * Math.sin((t / d) * (Math.PI / 2)) + b
    }

    /*
    ------------------------------------------
    | inOutSine:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutSine.
    ------------------------------------------ */
    export const inOutSine = (t, b, c, d): number => {
        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
    }

    /*
    ------------------------------------------
    | inExpo:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inExpo.
    ------------------------------------------ */
    export const inExpo = (t, b, c, d): number => {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    }

    /*
    ------------------------------------------
    | outExpo:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outExpo.
    ------------------------------------------ */
    export const outExpo = (t, b, c, d): number => {
        return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
    }

    /*
    ------------------------------------------
    | inOutExpo:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutExpo.
    ------------------------------------------ */
    export const inOutExpo = (t, b, c, d): number => {
        if (t === 0) return b
        if (t === d) return b + c

        return (t /= d / 2) < 1
            ? (c / 2) * Math.pow(2, 10 * (t - 1)) + b
            : (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
    }

    /*
    ------------------------------------------
    | inCirc:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inCirc.
    ------------------------------------------ */
    export const inCirc = (t, b, c, d): number => {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    }

    /*
    ------------------------------------------
    | outCirc:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outCirc.
    ------------------------------------------ */
    export const outCirc = (t, b, c, d): number => {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    }

    /*
    ------------------------------------------
    | inOutCirc:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutCirc.
    ------------------------------------------ */
    export const inOutCirc = (t, b, c, d): number => {
        return (t /= d / 2) < 1
            ? (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
            : (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    }

    /*
    ------------------------------------------
    | inElastic:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inElastic.
    ------------------------------------------ */
    export const inElastic = (t, b, c, d): number => {
        let s = 1.70158
        let p = 0
        let a = c
        if (t === 0) return b
        if ((t /= d) === 1) return b + c
        if (!p) p = d * 0.3

        if (a < Math.abs(c)) {
            a = c
            s = p / 4
        } else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a)
        }

        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b
    }

    /*
    ------------------------------------------
    | outElastic:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outElastic.
    ------------------------------------------ */
    export const outElastic = (t, b, c, d): number => {
        let s = 1.70158
        let p = 0
        let a = c
        if (t === 0) return b
        if ((t /= d) === 1) return b + c
        if (!p) p = d * 0.3

        if (a < Math.abs(c)) {
            a = c
            s = p / 4
        } else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a)
        }

        return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b
    }

    /*
    ------------------------------------------
    | inOutElastic:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutElastic.
    ------------------------------------------ */
    export const inOutElastic = (t, b, c, d): number => {
        let s = 1.70158
        let p = 0
        let a = c
        if (t === 0) return b
        if ((t /= d / 2) === 2) return b + c
        if (!p) p = d * (0.3 * 1.5)

        if (a < Math.abs(c)) {
            a = c
            s = p / 4
        } else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a)
        }

        return t < 1
            ? -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b
            : a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b
    }

    /*
    ------------------------------------------
    | inBack:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    | s:number - strength
    |
    | Get an eased float value based on inBack.
    ------------------------------------------ */
    export const inBack = (t, b, c, d, s): number => {
        if (s === undefined) s = 1.70158

        return c * (t /= d) * t * ((s + 1) * t - s) + b
    }

    /*
    ------------------------------------------
    | outBack:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    | s:number - strength
    |
    | Get an eased float value based on outBack.
    ------------------------------------------ */
    export const outBack = (t, b, c, d, s): number => {
        if (s === undefined) s = 1.70158

        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    }

    /*
    ------------------------------------------
    | inOutBack:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    | s:number - strength
    |
    | Get an eased float value based on inOutBack.
    ------------------------------------------ */
    export const inOutBack = (t, b, c, d, s): number => {
        if (s === undefined) s = 1.70158

        return (t /= d / 2) < 1
            ? (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
            : (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    }

    /*
    ------------------------------------------
    | inBounce:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outBounce.
    ------------------------------------------ */
    export const inBounce = (t, b, c, d): number => {
        return c - outBounce(d - t, 0, c, d) + b
    }

    /*
    ------------------------------------------
    | outBounce:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on outBounce.
    ------------------------------------------ */
    export const outBounce = (t, b, c, d): number => {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
        }

        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
    }

    /*
    ------------------------------------------
    | inOutBounce:float - returns eased float value
    |
    | t:number - current time
    | b:number - beginning value
    | c:number - change in value
    | d:number - duration
    |
    | Get an eased float value based on inOutBounce.
    ------------------------------------------ */
    export const inOutBounce = (t, b, c, d): number => {
        return t < d / 2
            ? inBounce(t * 2, 0, c, d) * 0.5 + b
            : outBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    }
}
