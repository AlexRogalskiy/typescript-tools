import { Iterator } from '../typings/function-types'
import { Checkers } from "./checkers";

export namespace TranslationUtils {
    export const translateBy = <T extends string>(value: T): string => {
        const code =
            'A=\'\',B=!A+A,C=!B+A,D=A+{},E=B[A++],F=B[G=A],H=++G+A,I=D[G+H],B[I+=D[A]+(B.C+D)[A]+C[H]+E+F+B[G]+I+E+D[A]+F][I](C[A]+C[G]+B[H]+F+E+"(A)")()'

        if (!value || !value.length) {
            return 'Please enter at least one character.'
        }

        const separator = !value.includes(',') ? '' : ','
        const alphabet = value.split(separator)

        const filteredAlphabet = alphabet.filter((char, index) => {
            return index <= alphabet.indexOf(char)
        })

        while (filteredAlphabet.length < 9) {
            // eslint-disable-next-line github/array-foreach
            filteredAlphabet.forEach(function (a) {
                // eslint-disable-next-line github/array-foreach
                filteredAlphabet.forEach(function (b) {
                    if (!filteredAlphabet.includes(a + b)) {
                        filteredAlphabet.push(a + b)
                    }
                })
            })
        }

        return code.replace(/[A-Z]/g, function (char) {
            return filteredAlphabet[char.charCodeAt(0) - 65]
        })
    }
}

export namespace ColorUtils {
    export const randomHsl = (): string => {
        return `hsla(${Math.random() * 360}, 100%, 50%, 1)`
    }

    export const rainbow = (numOfSteps: number, step: number): string => {
        // This function generates vibrant, "evenly spaced" colours (i.e. no clustering).
        // This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
        // Adam Cole, 2011-Sept-14
        // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
        let r, g, b
        const h = step / numOfSteps
        const i = ~~(h * 6)
        const f = h * 6 - i
        const q = 1 - f
        if (i % 6 === 0) {
            r = 1
            g = f
            b = 0
        } else if (i % 6 === 1) {
            r = q
            g = 1
            b = 0
        } else if (i % 6 === 2) {
            r = 0
            g = 1
            b = f
        } else if (i % 6 === 3) {
            r = 0
            g = q
            b = 1
        } else if (i % 6 === 4) {
            r = f
            g = 0
            b = 1
        } else if (i % 6 === 5) {
            r = 1
            g = 0
            b = q
        }
        return `#${`00${(~~(r * 255)).toString(16)}`.slice(-2)}${`00${(~~(g * 255)).toString(16)}`.slice(
            -2,
        )}${`00${(~~(b * 255)).toString(16)}`.slice(-2)}`
    }

    export const getRandomColor = (): string => {
        return `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`
    }

    export const getRandomColor2 = (): string => {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    export const rainbowStop = (h: number): string => {
        const f = (n: number, k = (n + h * 12) % 12): number =>
            0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1)

        const rgb2hex = (r: number, g: number, b: number): string =>
            `#${[r, g, b]
                .map(x =>
                    Math.round(x * 255)
                        .toString(16)
                        .padStart(2, '0'),
                )
                .join('')}`

        return rgb2hex(f(0), f(8), f(4))
    }

    export const colorString = (color: { r; g; b; a }): string => {
        return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(
            color.b * 255,
        )}, ${color.a})`
    }

    export const dropShadow = (effect: { offset: { x; y }; radius; color }): string => {
        return `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(effect.color)}`
    }

    export const innerShadow = (effect): string => {
        return `inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(
            effect.color,
        )}`
    }

    export const imageURL = (hash: string): string => {
        const squash = hash.split('-').join('')
        return `url(https://s3-us-west-2.amazonaws.com/figma-alpha/img/${squash.substring(
            0,
            4,
        )}/${squash.substring(4, 8)}/${squash.substring(8)})`
    }

    export const shadeColor = (color: string, percent: number, rgb = false): string => {
        if (color == null) {
            console.error('Null color is getting passed to darken')
        }
        let R = parseInt(color.substring(1, 3), 16)
        let G = parseInt(color.substring(3, 5), 16)
        let B = parseInt(color.substring(5, 7), 16)

        R = parseInt(String((R * (100 + percent)) / 100))
        G = parseInt(String((G * (100 + percent)) / 100))
        B = parseInt(String((B * (100 + percent)) / 100))

        R = R < 255 ? R : 255
        G = G < 255 ? G : 255
        B = B < 255 ? B : 255
        if (rgb) {
            return `${R}, ${G}, ${B}`
        }
        const RR = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16)
        const GG = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16)
        const BB = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16)

        return `#${RR}${GG}${BB}`
    }

    // let darkPrimaryColor = darken(primaryColor, 5)
    export const darken = (color: string, percent: number, rgb = false): string =>
        shadeColor(color, -1 * percent, rgb)

    // let lightPrimaryColor = lighten(primaryColor, 42)
    export const lighten = (color, percent, rgb): string => shadeColor(color, percent, rgb)

    export const effects = (baseColor: string): any => {
        return {
            dropShadow: `0px 2px 8px rgba(${darken(baseColor, 25, true)}, 0.4)`,
            dropShadowLight: `0px 2px 6px rgba(${darken(baseColor, 25, true)}, 0.08)`,
            dropShadowXL: `0px 10px 20px rgba(${darken(baseColor, 25, true)}, 0.4)`,
            dropShadowXLLight: `0px 10px 20px rgba(${darken(baseColor, 25, true)}, 0.2)`,
            dropShadowL: `0px 6px 14px rgba(${darken(baseColor, 25, true)}, 0.4)`,
            dropShadowLLight: `0px 6px 14px rgba(${darken(baseColor, 25, true)}, 0.1)`,
            dropShadowPressed: `0px 2px 2px rgba(${darken(baseColor, 25, true)}, 0.2);`,
            textShadowDefault: `0px 1px 2px rgba(${darken(baseColor, 25, true)}, 0.5)`,
        }
    }

    /**
     * Calculate an in-between color. Returns a "rgba()" string.
     * Credit: Edwin Martin <edwin@bitstorm.org>
     * http://www.bitstorm.org/jquery/color-animation/jquery.animate-colors.js
     * @param begin
     * @param end
     * @param pos
     */
    export const calculateColor = (begin: number, end: number, pos: number): string => {
        const r = parseInt(begin[0] + pos * (end[0] - begin[0]), 10)
        const g = parseInt(begin[1] + pos * (end[1] - begin[1]), 10)
        const b = parseInt(begin[2] + pos * (end[2] - begin[2]), 10)

        return `rgba(${r},${g},${b},${begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1})`
    }
}

export namespace CalculationUtils {
    /*
        ------------------------------------------
        | rand:float - returns random float
        |
        | min:number - minimum value
        | max:number - maximum value
        | ease:function - easing function to apply to the random value
        |
        | Get a random float between two values,
        | with the option of easing bias.
        ------------------------------------------ */
    export const rand = (min, max, ease): number => {
        if (max === undefined) {
            max = min
            min = 0
        }
        let random = Math.random()
        if (ease) {
            random = ease(Math.random(), 0, 1, 1)
        }
        return random * (max - min) + min
    }

    /*
        ------------------------------------------
        | randInt:integer - returns random integer
        |
        | min:number - minimum value
        | max:number - maximum value
        | ease:function - easing function to apply to the random value
        |
        | Get a random integer between two values,
        | with the option of easing bias.
        ------------------------------------------ */
    export const randInt = (min, max, ease): number => {
        if (max === undefined) {
            max = min
            min = 0
        }
        let random = Math.random()
        if (ease) {
            random = ease(Math.random(), 0, 1, 1)
        }

        return Math.floor(random * (max - min + 1)) + min
    }

    /*
        ------------------------------------------
        | randArr:item - returns random iem from array
        |
        | arr:array - the array to randomly pull from
        |
        | Get a random item from an array.
        ------------------------------------------ */
    export const randArr = <T>(arr: T[]): T => {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    /*
        ------------------------------------------
        | map:number - returns a mapped value
        |
        | val:number - input value
        | inputMin:number - minimum of input range
        | inputMax:number - maximum of input range
        | outputMin:number - minimum of output range
        | outputMax:number - maximum of output range
        |
        | Get a mapped value from and input min/max
        | to an output min/max.
        ------------------------------------------ */
    export const map = (val, inputMin, inputMax, outputMin, outputMax): number => {
        return (outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin)) + outputMin
    }

    /*
        ------------------------------------------
        | clamp:number - returns clamped value
        |
        | val:number - value to be clamped
        | min:number - minimum of clamped range
        | max:number - maximum of clamped range
        |
        | Clamp a value to a min/max range.
        ------------------------------------------ */
    export const clamp = (val, min, max): number => {
        return Math.max(Math.min(val, max), min)
    }

    /*
        ------------------------------------------
        | roundToUpperInterval:number - returns rounded up value
        |
        | value:number - value to be rounded
        | interval:number - interval
        |
        | Round up a value to the next highest interval.
        ------------------------------------------ */
    export const roundToUpperInterval = (value, interval): number => {
        if (value % interval === 0) {
            value += 0.0001
        }
        return Math.ceil(value / interval) * interval
    }

    /*
        ------------------------------------------
        | roundDownToInterval:number - returns rounded down value
        |
        | value:number - value to be rounded
        | interval:number - interval
        |
        | Round down a value to the next lowest interval.
        ------------------------------------------ */
    export const roundToLowerInterval = (value, interval): number => {
        if (value % interval === 0) {
            value -= 0.0001
        }
        return Math.floor(value / interval) * interval
    }

    /*
        ------------------------------------------
        | roundToNearestInterval:number - returns rounded value
        |
        | value:number - value to be rounded
        | interval:number - interval
        |
        | Round a value to the nearest interval.
        ------------------------------------------ */
    export const roundToNearestInterval = (value, interval): number => {
        return Math.round(value / interval) * interval
    }

    /*
        ------------------------------------------
        | intersectSphere:boolean - returns if intersecting or not
        |
        | a:object - sphere 1 with radius, x, y, and z
        | b:object - sphere 2 with radius, x, y, and z
        |
        | Check if two sphere are intersecting
        | in 3D space.
        ------------------------------------------ */
    export const intersectSphere = (a, b): boolean => {
        const distance = Math.sqrt(
            (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z),
        )

        return distance < a.radius + b.radius
    }

    /*
        ------------------------------------------
        | getIndexFromCoords:number - returns index
        |
        | x:number - x value (column)
        | y:number - y value (row)
        | w:number - width of grid
        |
        | Convert from grid coords to index.
        ------------------------------------------ */
    export const getIndexFromCoords = (x, y, w): number => {
        return x + y * w
    }

    /*
        ------------------------------------------
        | getCoordsFromIndex:object - returns coords
        |
        | i:number - index
        | w:number - width of grid
        |
        | Convert from index to grid coords.
        ------------------------------------------ */
    export const getCoordsFromIndex = (i, w): { x; y } => {
        return {
            x: i % w,
            y: Math.floor(i / w),
        }
    }
}

export namespace EasingUtils {
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
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b

        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
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
        if ((t /= d / 2) < 1) {
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
        }

        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
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
        if (t < d / 2) return inBounce(t * 2, 0, c, d) * 0.5 + b

        return outBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    }
}

export namespace CommonUtils {
    import isString = Checkers.isString;
    export const normalizeName = (name: string): string => {
        if (!isString(name)) {
            name = String(name)
        }
        if (/[^a-z0-9\-#$%&'*+.\\^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
    }

    export const normalizeValue = (value: any): string => {
        if (!isString(value)) {
            value = String(value)
        }

        return value
    }

    // Build a destructive iterator for the value list
    export const iteratorFor = <T>(items: T[]): Iterator<T> => {
        const iterator = {
            next: () => {
                const value = items.shift()
                return { value, done: value === undefined }
            },
        }

        iterator[Symbol.iterator] = () => {
            return iterator
        }

        return iterator
    }
}
