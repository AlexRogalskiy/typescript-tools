import { ScaleLinear } from 'd3-scale'
import { line } from 'd3-shape'

import { Point, Rectangular, TextStyle, TickValueDescription } from '../../typings/domain-types'
import { CommonUtils } from '..'
import Color = CommonUtils.Color

const PADDING_LEFT = 12
const PADDING_RIGHT = 12
const TICK_MARGIN = 3

export const drawLine = (
    ctx: CanvasRenderingContext2D,
    data: Point[],
    color = 'black',
    lineWidth = 1,
): void => {
    ctx.save()
    ctx.beginPath()
    line<Point>()
        .x(d => d.x)
        .y(d => d.y)
        .context(ctx)(data)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()
    ctx.restore()
}

export const pathRoundedRect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    borderRadius: number,
): void => {
    ctx.moveTo(borderRadius, 0)
    ctx.arcTo(width, 0, width, height, borderRadius)
    ctx.arcTo(width, height, 0, height, borderRadius)
    ctx.arcTo(0, height, 0, 0, borderRadius)
    ctx.arcTo(0, 0, width, 0, borderRadius)
}

export const drawStack = (
    ctx: CanvasRenderingContext2D,
    stack: Color[],
    max: number,
    width: number,
    o: { colorDots: Record<Color, string> },
): void => {
    ctx.save()

    const m = width / max

    for (let i = 0; i < stack.length; i++) {
        // @ts-ignore
        ctx.fillStyle = o.colorDots[stack[i]]
        ctx.fillRect(i * m, 0, m + width * 0.005, 10)
    }

    ctx.restore()
}

export const highlightCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color = 'orange',
): void => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.fillRect((1 + x + 0.5) * 16 - 2, (2 + y + 0.5) * 16 - 2, 4, 4)
}

export const drawText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    position: Point = { x: 0, y: 0 },
    styles: TextStyle = {},
): void => {
    const defaultStyles = {
        font: '11px serif',
        color: 'black',
    }
    const mergeStyles = Object.assign({}, defaultStyles, styles)

    ctx.save()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.font = mergeStyles.font
    ctx.fillStyle = mergeStyles.color
    ctx.fillText(text, position.x, position.y)
    ctx.restore()
}

export const drawYAxis = (
    ctx: CanvasRenderingContext2D,
    tickValues: TickValueDescription[],
    frame: Rectangular,
    scale: ScaleLinear<number, number>,
    resolution = 1,
    withLine = true,
    lineColor = 'black',
    formatter: (v: number, i: number) => string = (v: number) => v.toFixed(2),
    align: 'left' | 'right' = 'left',
): void => {
    ctx.save()
    ctx.strokeStyle = lineColor
    ctx.beginPath()
    ctx.lineWidth = 0.8
    ctx.font = `${10 * resolution}px sans-serif`
    ctx.textBaseline = 'bottom'

    let x: number
    if (align === 'left') {
        ctx.textAlign = 'left'
        x = (PADDING_LEFT + TICK_MARGIN) * resolution
    } else {
        ctx.textAlign = 'right'
        x = frame.width - (PADDING_RIGHT + TICK_MARGIN) * resolution
    }

    for (let i = 0; i < tickValues.length; i++) {
        const { value, color = '#5E667F' } = tickValues[i]
        const y = scale(value) || 0
        if (withLine) {
            ctx.moveTo(PADDING_LEFT * resolution, y)
            ctx.lineTo(frame.width - PADDING_RIGHT * resolution, y)
        }
        ctx.fillStyle = color
        ctx.fillText(formatter(value, i), x, y)
    }

    ctx.stroke()
    ctx.restore()
}

export const drawXAxis = (
    ctx: CanvasRenderingContext2D,
    tickValues: number[],
    frame: Rectangular,
    scale: ScaleLinear<number, number>,
    resolution = 1,
    withTick = true,
    lineColor = 'black',
    formatter: (v: number, i: number) => string = (v: number) => v.toFixed(2),
    tickColor = '#5E667F',
): void => {
    ctx.save()
    ctx.strokeStyle = lineColor
    ctx.beginPath()
    ctx.lineWidth = 0.8
    ctx.font = `${10 * resolution}px sans-serif`
    ctx.fillStyle = tickColor
    ctx.textBaseline = 'top'

    const bottomY = frame.y + frame.height

    for (let i = 0; i < tickValues.length; i++) {
        const value = tickValues[i]
        if (i === 0) {
            ctx.textAlign = 'left'
        } else if (i === tickValues.length - 1) {
            ctx.textAlign = 'right'
        } else {
            ctx.textAlign = 'center'
        }

        const x = scale(value) || 0
        ctx.moveTo(x, frame.y)
        ctx.lineTo(x, bottomY)

        if (withTick) {
            ctx.fillText(formatter(value, i), x, bottomY + TICK_MARGIN * resolution)
        }
    }

    ctx.stroke()
    ctx.restore()
}
