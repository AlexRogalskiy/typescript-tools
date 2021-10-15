import { isoParse, timeFormat } from 'd3-time-format'
import moment from 'moment'

function addLeadingZero(number: number) {
    if (number.toString().length === 1) {
        return `0${number.toString()}`
    }
    return number
}

export function stopWatchDuration(durationMs: number) {
    const duration = moment.duration(durationMs, 'ms')
    if (duration.asMilliseconds() === 0) {
        return '0'
    }

    if (duration.asHours() > 1) {
        return `${duration.hours()}h ${addLeadingZero(duration.seconds())}s`
    }
    if (duration.asSeconds() > 1) {
        return `${duration.minutes()}m ${addLeadingZero(duration.seconds())}s`
    } else {
        return `${duration.milliseconds()} ms`
    }
}

export const capitalize = (word: string) => {
    if (word.length < 2) {
        return word.toUpperCase()
    }
    return `${word[0].toUpperCase()}${word.slice(1)}`
}

const customTimeFormat = timeFormat('%b %d, %Y %I:%M%p')

export const formatUpdatedAt = (updatedAt: string) => {
    const parsedDate = isoParse(updatedAt)
    if (!parsedDate) {
        return ''
    } else {
        const dateString = customTimeFormat(parsedDate)
        return `${dateString.slice(0, -2)}${dateString.slice(-2).toLowerCase()}`
    }
}
