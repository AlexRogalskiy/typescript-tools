import { Arrays, Checkers, CommonUtils, Errors, Numbers, Strings } from '..'
import { Optional } from '../../typings/standard-types'

export namespace ColorsUtils {
    import clamp = CommonUtils.clamp
    import NumberOperations = Numbers.NumberOperations

    export type PageTheme = {
        colors: string[]
        shape: string
        backgroundImage: string
    }

    export const DIMENS = {
        spaceTiny: '5px',
        spaceSmall: '10px',
        spaceMedium: '22px',
        spaceLarge: '32px',
        spaceHuge: '42px',

        animationDurationQuick: '100ms',
        animationDurationNormal: '200ms',
        animationDurationSlow: '400ms',
    }

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

    export const wobble = (x1: number, y1: number, x2: number, y2: number): any => {
        //assert(_.every([x1,x2,y1,y2], _.isFinite), 'x1,x2,y1,y2 must be numeric');

        // Wobble no more than 1/25 of the line length
        const factor = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 25

        // Distance along line where the control points are
        // Clamp between 20% and 80% so any arrow heads aren't angled too much
        const r1 = clamp(Math.random(), 0.2, 0.8)
        const r2 = clamp(Math.random(), 0.2, 0.8)

        const xfactor = NumberOperations.randomBoolean() ? factor : -factor
        const yfactor = NumberOperations.randomBoolean() ? factor : -factor

        const p1 = {
            x: (x2 - x1) * r1 + x1 + xfactor,
            y: (y2 - y1) * r1 + y1 + yfactor,
        }

        const p2 = {
            x: (x2 - x1) * r2 + x1 - xfactor,
            y: (y2 - y1) * r2 + y1 - yfactor,
        }

        return `C${p1.x.toFixed(1)},${
            p1.y.toFixed(1) // start control point
        } ${p2.x.toFixed(1)},${
            p2.y.toFixed(1) // end control point
        } ${x2.toFixed(1)},${y2.toFixed(1)}` // end point
    }

    export const handRect = (x: number, y: number, w: number, h: number): any => {
        //assert(_.every([x, y, w, h], _.isFinite), 'x, y, w, h must be numeric')
        return `M${x},${y}${wobble(x, y, x + w, y)}${wobble(x + w, y, x + w, y + h)}${wobble(
            x + w,
            y + h,
            x,
            y + h,
        )}${wobble(x, y + h, x, y)}`
    }

    export const colors: { [colorname: string]: number[] } = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50],
    }

    // toRGBObject('rgb(255, 12, 0)'); // {red: 255, green: 12, blue: 0}
    export const toRGBObject = (rgbStr: string): any => {
        const [red, green, blue] = toRGBArray(rgbStr)

        return { red, green, blue }
    }

    export const handLine = (x1: number, y1: number, x2: number, y2: number): any => {
        //assert(_.every([x1,x2,y1,y2], _.isFinite), 'x1,x2,y1,y2 must be numeric')
        return `M${x1.toFixed(1)},${y1.toFixed(1)}${wobble(x1, y1, x2, y2)}`
    }

    // toRGBArray('rgb(255, 12, 0)'); // [255, 12, 0]
    export const toRGBArray = (rgbStr: string): number[] => rgbStr.match(/\d+/g)!.map(Number)

    // toHSLObject('hsl(50, 10%, 10%)'); // { hue: 50, saturation: 10, lightness: 10 }
    export const toHSLObject = (hslStr: string): any => {
        const [hue, saturation, lightness] = hslStr.match(/\d+/g)!.map(Number)

        return { hue, saturation, lightness }
    }

    // toHSLArray('hsl(50, 10%, 10%)'); // [50, 10, 10]
    export const toHSLArray = (hslStr: string): number[] => hslStr.match(/\d+/g)!.map(Number)

    export const randomHexColorCode = (): string => {
        const n = (Math.random() * 0xfffff * 1000000).toString(16)

        return `#${n.slice(0, 6)}`
    }

    // hexToRGB('#27ae60ff'); // 'rgba(39, 174, 96, 255)'
    // hexToRGB('27ae60'); // 'rgb(39, 174, 96)'
    // hexToRGB('#fff'); // 'rgb(255, 255, 255)'
    export const hexToRGB = (hex: string): string => {
        let alpha = false,
            h = hex.slice(hex.startsWith('#') ? 1 : 0)
        if (h.length === 3) h = [...h].map(x => x + x).join('')
        else if (h.length === 8) alpha = true
        const value = parseInt(h, 16)

        return `rgb${alpha ? 'a' : ''}(${value >>> (alpha ? 24 : 16)}, ${
            (value & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)
        }, ${(value & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)}${
            alpha ? `, ${value & 0x000000ff}` : ''
        })`
    }

    // extendHex('#03f'); // '#0033ff'
    // extendHex('05a'); // '#0055aa'
    export const extendHex = (shortHex: string): string =>
        `#${shortHex
            .slice(shortHex.startsWith('#') ? 1 : 0)
            .split('')
            .map(x => x + x)
            .join('')}`

    export const getElevationPseudoElementStyle = (dy: string, blur: string, opacity: string): any => {
        return {
            'display': 'block',
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'right': '0',
            'bottom': '0',
            '-webkit-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
            '-moz-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
            'box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
        }
    }

    export const RGBToHSL = (r: number, g: number, b: number): number[] => {
        r /= 255
        g /= 255
        b /= 255
        const l = Math.max(r, g, b)
        const s = l - Math.min(r, g, b)
        const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0

        return [
            60 * h < 0 ? 60 * h + 360 : 60 * h,
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
            (100 * (2 * l - s)) / 2,
        ]
    }

    export const RGBToHex = (r: number, g: number, b: number): string =>
        ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')

    export const RGBToHSB = (r: number, g: number, b: number): number[] => {
        r /= 255
        g /= 255
        b /= 255
        const v = Math.max(r, g, b),
            n = v - Math.min(r, g, b)
        const h = n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n

        return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100]
    }

    export const changeLightness = (delta: string, hslStr: string): string => {
        const [hue, saturation, lightness] = hslStr.match(/\d+/g)!.map(Number)

        const newLightness = Math.max(0, Math.min(100, lightness + parseFloat(delta)))

        return `hsl(${hue}, ${saturation}%, ${newLightness}%)`
    }

    export const HSLToRGB = (h: number, s: number, l: number): number[] => {
        s /= 100
        l /= 100
        const k = (n: number): number => (n + h / 30) % 12
        const a = s * Math.min(l, 1 - l)
        const f = (n: number): number => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

        return [255 * f(0), 255 * f(8), 255 * f(4)]
    }

    export const HSBToRGB = (h: number, s: number, b: number): number[] => {
        s /= 100
        b /= 100
        const k = (n: number): number => (n + h / 60) % 6
        const f = (n: number): number => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))

        return [255 * f(5), 255 * f(3), 255 * f(1)]
    }

    export const colorVariants: Record<string, string[]> = {
        darkGrey: ['#171717', '#383838'],
        marineBlue: ['#006D8F', '#0049A1'],
        veryBlue: ['#0027AF', '#270094'],
        rubyRed: ['#98002B', '#8D1134'],
        toastyOrange: ['#BE2200', '#A41D00'],
        purpleSky: ['#8912CA', '#3E00EA'],
        eveningSea: ['#00FFF2', '#035355'],
        teal: ['#005B4B'],
        pinkSea: ['#C8077A', '#C2297D'],
    }

    export const rgb = (...values: string[]): string => `rgb(${values.join(',')})`

    export const rgba = (...values: string[]): string => `rgba(${values.join(',')})`

    export const shapes: Record<string, string> = {
        wave: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='1368' height='400' fill='none'%3e%3cmask id='a' width='1368' height='401' x='0' y='0' maskUnits='userSpaceOnUse'%3e%3cpath fill='url(%23paint0_linear)' d='M437 116C223 116 112 0 112 0h1256v400c-82 0-225-21-282-109-112-175-436-175-649-175z'/%3e%3cpath fill='url(%23paint1_linear)' d='M1368 400V282C891-29 788 40 711 161 608 324 121 372 0 361v39h1368z'/%3e%3cpath fill='url(%23paint2_linear)' d='M1368 244v156H0V94c92-24 198-46 375 0l135 41c176 51 195 109 858 109z'/%3e%3cpath fill='url(%23paint3_linear)' d='M1252 400h116c-14-7-35-14-116-16-663-14-837-128-1013-258l-85-61C98 28 46 8 0 0v400h1252z'/%3e%3c/mask%3e%3cg mask='url(%23a)'%3e%3cpath fill='white' d='M-172-98h1671v601H-172z'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient id='paint0_linear' x1='602' x2='1093.5' y1='-960.5' y2='272' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint1_linear' x1='482' x2='480' y1='1058.5' y2='70.5' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint2_linear' x1='424' x2='446.1' y1='-587.5' y2='274.6' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint3_linear' x1='587' x2='349' y1='-1120.5' y2='341' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e\")",
        wave2: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='1368' height='400' fill='none'%3e%3cmask id='a' width='1764' height='479' x='-229' y='-6' maskUnits='userSpaceOnUse'%3e%3cpath fill='url(%23paint0_linear)' d='M0 400h1350C1321 336 525 33 179-2c-345-34-395 236-408 402H0z'/%3e%3cpath fill='url(%23paint1_linear)' d='M1378 177v223H0V217s219 75 327 52C436 246 717-35 965 45s254 144 413 132z'/%3e%3cpath fill='url(%23paint2_linear)' d='M26 400l-78-16c-170 205-44-6-137-30l-4-1 4 1 137 30c37-45 89-110 159-201 399-514-45 238 1176-50 275-65 354-39 91 267H26z'/%3e%3c/mask%3e%3cg mask='url(%23a)'%3e%3cpath fill='white' d='M0 0h1368v400H0z'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient id='paint0_linear' x1='431' x2='397.3' y1='-599' y2='372.8' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint1_linear' x1='236.5' x2='446.6' y1='-586' y2='381.5' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint2_linear' x1='851.8' x2='640.4' y1='-867.2' y2='363.7' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e\")",
        round: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='1368' height='400' fill='none'%3e%3cmask id='a' width='2269' height='1408' x='-610' y='-509' maskUnits='userSpaceOnUse'%3e%3ccircle cx='1212.8' cy='74.8' r='317.5' fill='url(%23paint0_linear)' transform='rotate(-52 1213 75)'/%3e%3ccircle cx='737.8' cy='445.8' r='317.5' fill='url(%23paint1_linear)' transform='rotate(-116 738 446)'/%3e%3ccircle cx='601.8' cy='52.8' r='418.6' fill='url(%23paint2_linear)' transform='rotate(-117 602 53)'/%3e%3ccircle cx='999.8' cy='364' r='389.1' fill='url(%23paint3_linear)' transform='rotate(31 1000 364)'/%3e%3cellipse cx='-109.2' cy='263.5' fill='url(%23paint4_linear)' rx='429.2' ry='465.8' transform='rotate(-85 -109 264)'/%3e%3c/mask%3e%3cg mask='url(%23a)'%3e%3cpath fill='white' d='M0 0h1368v400H0z'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient id='paint0_linear' x1='1301.2' x2='161.4' y1='-1879.7' y2='-969.6' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint1_linear' x1='826.2' x2='-313.6' y1='-1508.7' y2='-598.6' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint2_linear' x1='718.4' x2='-784.3' y1='-2524' y2='-1324.2' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint3_linear' x1='1108.2' x2='-288.6' y1='-2031.1' y2='-915.9' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient id='paint4_linear' x1='10.4' x2='-1626.5' y1='-2603.8' y2='-1399.5' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white'/%3e%3cstop offset='1' stop-color='white' stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e\")",
    }

    // As the background shapes and colors are decorative, we place them onto
    // the page as a css background-image instead of an html element of its own.
    // Utility to not have to write colors and shapes twice.
    export const genPageTheme = (colors: string[], shape: string): PageTheme => {
        const gradientColors = colors.length === 1 ? [colors[0], colors[0]] : colors
        const gradient = `linear-gradient(90deg, ${gradientColors.join(', ')})`
        const backgroundImage = `${shape},  ${gradient}`

        return { colors, shape, backgroundImage }
    }

    export const pageTheme: Record<string, PageTheme> = {
        home: genPageTheme(colorVariants.teal, shapes.wave),
        documentation: genPageTheme(colorVariants.pinkSea, shapes.wave2),
        tool: genPageTheme(colorVariants.purpleSky, shapes.round),
        service: genPageTheme(colorVariants.marineBlue, shapes.wave),
        website: genPageTheme(colorVariants.veryBlue, shapes.wave),
        library: genPageTheme(colorVariants.rubyRed, shapes.wave),
        other: genPageTheme(colorVariants.darkGrey, shapes.wave),
        app: genPageTheme(colorVariants.toastyOrange, shapes.wave),
        apis: genPageTheme(colorVariants.teal, shapes.wave2),
    }

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
