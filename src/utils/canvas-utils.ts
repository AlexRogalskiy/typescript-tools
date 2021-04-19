export namespace CanvasUtils {
    export const drawLine = (ctx, x1, y1, x2, y2): void => {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.stroke()
    }

    export const fillCircle = (ctx, x, y, r): void => {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
    }

    export const strokeCircle = (ctx, x, y, r): void => {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.stroke()
    }
}
