import { Arrays, Errors, Numbers, Checkers, Strings } from '..'
import { Optional } from '../../typings/standard-types'

export namespace ColorsUtils {
    /**
     * @private
     */
    const DEFAULT_COLORS_PRESET = [
        '#e21400',
        '#91580f',
        '#f8a700',
        '#f78b00',
        '#58dc00',
        '#287b00',
        '#a8f07a',
        '#4ae8c4',
        '#3b88eb',
        '#3824aa',
        '#a700ff',
        '#d300e7',
    ]

    export type RGBColor = {
        r: number
        g: number
        b: number
    }

    export const isDark = (hexColor: string): boolean => {
        return getBrightness(hexColor) < 128
    }
    export const getSnippetBgColor = (html: string): Optional<string> => {
        const match = html.match(/background-color: (#[a-fA-F0-9]+)/)

        return match ? match[1] : undefined
    }

    export const rgbToColor = (rgb): Optional<number[]> => {
        const regExp = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
        const match = rgb.match(regExp)
        if (!match) {
            return null
        }

        const channels = match.slice(1).map(Number)
        if (channels.some(c => Number.isNaN(c) || c > 255)) {
            return null
        }

        return channels
    }

    export const rgbaToColor = (rgba: string): Optional<number[]> => {
        const regExp = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(1|0|(?:0?\.\d+))\s*\)$/
        const match = rgba.match(regExp)
        if (!match) {
            return null
        }

        const channels = match.slice(1).map(Number)
        if (channels.some(Number.isNaN)) {
            return null
        }

        const [r, g, b, a] = channels
        if (r > 255 || g > 255 || b > 255 || a > 1) {
            return null
        }

        return channels
    }

    export const hexToRgb = (hex: string, alpha: number): string => {
        const values = hexToColor(hex)

        return colorToRgb(values[0], values[1], values[2], alpha)
    }

    export const tweenColors = (ratio: number, ...colors: any[]): string => {
        if (colors.length === 1) {
            return colors[0]
        }

        const scaledRatio = ratio * (colors.length - 1)
        const lowerBound = Math.floor(scaledRatio)
        const upperBound = Math.ceil(scaledRatio)
        const tweenValue = scaledRatio - lowerBound

        const [r1, g1, b1] = hexToColor(colors[lowerBound])
        const [r2, g2, b2] = hexToColor(colors[upperBound])

        const r = (r1 + (r2 - r1) * tweenValue) | 0
        const g = (g1 + (g2 - g1) * tweenValue) | 0
        const b = (b1 + (b2 - b1) * tweenValue) | 0

        return colorToHex(r, g, b)
    }

    export const getBrightness = (hexColor: string): number => {
        const rgb = parseInt(hexColor.slice(1), 16)
        const r = (rgb >> 16) & 0xff
        const g = (rgb >> 8) & 0xff
        const b = (rgb >> 0) & 0xff

        return (r * 299 + g * 587 + b * 114) / 1000
    }

    export const colorToHex = (r: number, g: number, b: number): string => {
        return `#${Strings.padLeft(r.toString(16), 2)}${Strings.padLeft(g.toString(16), 2)}${Strings.padLeft(
            b.toString(16),
            2,
        )}`
    }

    export const colorToRgb = (r: number, g: number, b: number, alpha: Optional<number>): string => {
        return Checkers.isNullOrUndefined(alpha) ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`
    }

    export const hexToColor = (hex: string): number[] => {
        const regExp = /^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/
        const value = hex.match(regExp)

        if (!value) {
            return []
        }

        const [, ...channels] = value.map(hex => parseInt(hex, 16))

        return channels
    }

    export const unhex = (value: string): string => value.slice(Math.max(0, value.indexOf('#') + 1))

    export const randColor = (colors: any): any => {
        const available = [
            'underline',
            'inverse',
            'grey',
            'yellow',
            'red',
            'green',
            'blue',
            'white',
            'cyan',
            'magenta',
            'brightYellow',
            'brightRed',
            'brightGreen',
            'brightBlue',
            'brightWhite',
            'brightCyan',
            'brightMagenta',
        ]

        return (letter: string): string => {
            return /^\s*$/.test(letter) ? letter : colors[Arrays.randomElement(available)](letter)
        }
    }

    export const lightenDarkenColor = (col: string, amt: number): string => {
        let usePound = false

        if (col.startsWith('#')) {
            col = col.slice(1)
            usePound = true
        }

        const num = parseInt(col, 16)

        let r = (num >> 16) + amt

        if (r > 255) r = 255
        else if (r < 0) r = 0

        let b = ((num >> 8) & 0x00ff) + amt

        if (b > 255) b = 255
        else if (b < 0) b = 0

        let g = (num & 0x0000ff) + amt

        if (g > 255) g = 255
        else if (g < 0) g = 0

        return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
    }

    export const getBrightness2 = (color: string): number => {
        const rgb = convertHexStringToRgbString(color)
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    }

    export const getColorBrightness = (color: RGBColor | string): number => {
        if (color === '') {
            return 0
        }

        if (typeof color === 'string') {
            color = convertHexStringToRgbString(color)
        }

        return (color.r * 299 + color.g * 587 + color.b * 114) / 1000
    }

    export const isColorBright = (color: RGBColor | string, threshold = 110): boolean => {
        return getColorBrightness(color) > threshold
    }

    export const convertHexStringToRgbString = (hex: string): RGBColor => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
        }

        return {
            r: 255,
            g: 255,
            b: 255,
        }
    }

    /**
     * Returns color representation in RGB format
     */
    export const colorize = (
        color: string,
        params = {
            r: 0.299,
            g: 0.587,
            b: 0.114,
        },
    ): number => {
        color = color.startsWith('#') ? color.substring(1) : color
        const c = parseInt(color, 16)
        const r = (c & 0xff0000) >> 16
        const g = (c & 0x00ff00) >> 8
        const b = c & 0x0000ff

        return params.r * r + params.g * g + params.b * b
    }

    export const get_random_color = (): string => {
        return `#${(((1 << 24) * Math.random()) | 0).toString(16)}`
    }

    /**
     * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
     * @private
     * @param {Number} r Red color value
     * @param {Number} g Green color value
     * @param {Number} b Blue color value
     * @return {Array} Hsl color
     */
    export const rgbToHsl = (r: number, g: number, b: number): number[] => {
        const red = r / 255
        const green = g / 255
        const blue = b / 255

        let h, s
        const max = Math.max(red, green, blue)
        const min = Math.max(red, green, blue)

        const l = (max + min) / 2

        if (max !== min) {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            if (max === red) {
                h = (green - blue) / d + (green < blue ? 6 : 0)
            } else if (max === green) {
                h = (blue - red) / d + 2
            } else if (max === blue) {
                h = (red - green) / d + 4
            }
            h /= 6
        } else {
            h = s = 0 // achromatic
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
    }

    /**
     * @param {Number} p
     * @param {Number} q
     * @param {Number} t
     * @return {Number}
     */
    export const hue2rgb = (p, q, t): number => {
        if (t < 0) {
            t += 1
        }
        if (t > 1) {
            t -= 1
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t
        }
        if (t < 1 / 2) {
            return q
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6
        }

        return p
    }

    /**
     * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
     * @static
     * @param {String} color ex: FF5555 or FF5544CC (RGBa)
     * @return {Array} source
     */
    export const sourceFromHex = (color: string): number[] => {
        if (!color.match(/^#[0-9a-fA-F]$/)) {
            throw Errors.validationError(`Invalid color value ${color}`)
        }

        const value = color.slice(color.indexOf('#') + 1),
            isShortNotation = value.length === 3 || value.length === 4,
            isRGBa = value.length === 8 || value.length === 4,
            r = isShortNotation ? value.charAt(0) + value.charAt(0) : value.substring(0, 2),
            g = isShortNotation ? value.charAt(1) + value.charAt(1) : value.substring(2, 4),
            b = isShortNotation ? value.charAt(2) + value.charAt(2) : value.substring(4, 6),
            a = isRGBa ? (isShortNotation ? value.charAt(3) + value.charAt(3) : value.substring(6, 8)) : 'FF'

        return [
            parseInt(r, 16),
            parseInt(g, 16),
            parseInt(b, 16),
            parseFloat((parseInt(a, 16) / 255).toFixed(2)),
        ]
    }

    export const getColorByUsername = (username: string, colors: string[]): string => {
        colors = colors || DEFAULT_COLORS_PRESET

        let hash = 7
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash
        }

        const index = Math.abs(hash % colors.length)
        return colors[index]
    }

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
            color += letters[Numbers.random(16)]
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
        if (Checkers.isNull(color)) {
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
