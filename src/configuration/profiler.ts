import { Numbers } from '../types/numbers'

import NumberOperations = Numbers.NumberOperations

export type Profiler = {
    start: () => void
    stop: (inSeconds?: boolean) => number
    avg: (inSeconds?: boolean) => number
    fps: () => number
    avgFps: () => number
}

const msToSs = (timeMs: number, fractionDigits = 2): number => {
    return NumberOperations.toFloatFixed(timeMs / 1000, fractionDigits)
}

export const newProfiler = (): Profiler => {
    let timeRangesSum = 0
    let timeRangesNum = 0
    let lastTimeRange = 0

    let startTimeMs = 0

    const start = (): void => {
        startTimeMs = Date.now()
    }

    const stop = (inSeconds = true): number => {
        const timeRange = Date.now() - startTimeMs
        lastTimeRange = timeRange
        timeRangesNum += 1
        timeRangesSum += timeRange
        if (inSeconds) {
            return msToSs(timeRange)
        }
        return timeRange
    }

    const avg = (inSeconds = true): number => {
        const average = Math.ceil(timeRangesSum / timeRangesNum)
        if (inSeconds) {
            return msToSs(average)
        }
        return average
    }

    const fps = (): number => {
        return NumberOperations.toFloatFixed(1 / msToSs(lastTimeRange), 2)
    }

    const avgFps = (): number => {
        return NumberOperations.toFloatFixed(1 / avg(), 2)
    }

    return {
        start,
        stop,
        avg,
        fps,
        avgFps,
    }
}
