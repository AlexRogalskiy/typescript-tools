import dateFormat from 'dateformat'

import { BiConsumer, Consumer, Processor } from '../typings/function-types'

export namespace Logging {
    const { hasOwnProperty: hasOwnProp } = Object.prototype

    const DATETIME_FORMAT = 'dddd, mmmm dS, yyyy, hh:MM:ss TT'

    const COLORS = {
        RESET: process.stdout.isTTY ? '\x1b[0m' : '',
        BLACK: process.stdout.isTTY ? '\x1b[0;30m' : '',
        RED: process.stdout.isTTY ? '\x1b[0;31m' : '',
        GREEN: process.stdout.isTTY ? '\x1b[0;32m' : '',
        BROWN: process.stdout.isTTY ? '\x1b[0;33m' : '',
        BLUE: process.stdout.isTTY ? '\x1b[0;34m' : '',
        PURPLE: process.stdout.isTTY ? '\x1b[0;35m' : '',
        CYAN: process.stdout.isTTY ? '\x1b[0;36m' : '',
        LIGHT_GRAY: process.stdout.isTTY ? '\x1b[0;37m' : '',
        DARK_GRAY: process.stdout.isTTY ? '\x1b[1;30m' : '',
        LIGHT_RED: process.stdout.isTTY ? '\x1b[1;31m' : '',
        LIGHT_GREEN: process.stdout.isTTY ? '\x1b[1;32m' : '',
        YELLOW: process.stdout.isTTY ? '\x1b[1;33m' : '',
        LIGHT_BLUE: process.stdout.isTTY ? '\x1b[1;34m' : '',
        LIGHT_PURPLE: process.stdout.isTTY ? '\x1b[1;35m' : '',
        LIGHT_CYAN: process.stdout.isTTY ? '\x1b[1;36m' : '',
        WHITE: process.stdout.isTTY ? '\x1b[1;37m' : '',
    }

    const getTime = (format = '', utc = false): string => {
        format = format || DATETIME_FORMAT

        return dateFormat(Date.now(), format, utc)
    }

    export const toLog = (message: string, ...args: unknown[]): void => {
        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
            return
        }

        console.group('>>>')
        console.log(`${COLORS.PURPLE}${getTime()}:${COLORS.RESET}`, message, ...args)
        console.groupEnd()
    }

    export const createLog = (
        logger: Consumer<string>,
        processor: Processor<string, string>,
    ): Consumer<string> => {
        return message => {
            logger(`${processor(message)}`)
        }
    }

    export const createLogs = (
        logger: BiConsumer<string, any[]>,
        processor: Processor<string, string>,
    ): BiConsumer<string, any[]> => {
        return (message, args) => {
            logger(`${processor(message)}`, args)
        }
    }

    export const logs = createLogs(
        (m, ...args) => console.log(`${COLORS.PURPLE}${getTime()}:${COLORS.RESET}`, m, args),
        m => m.toUpperCase(),
    )
    export const errors = createLogs(
        (m, ...args) => console.error(`${COLORS.RED}${getTime()}:${COLORS.RESET}`, m, args),
        m => m.toUpperCase(),
    )
    export const warns = createLogs(
        (m, ...args) => console.warn(`${COLORS.GREEN}${getTime()}:${COLORS.RESET}`, m, args),
        m => m.toUpperCase(),
    )
    export const debugs = createLogs(
        (m, ...args) => console.debug(`${COLORS.BLUE}${getTime()}:${COLORS.RESET}`, m, args),
        m => m.toUpperCase(),
    )
    export const traces = createLogs(
        (m, ...args) => console.trace(`${COLORS.CYAN}${getTime()}:${COLORS.RESET}`, m, args),
        m => m.toUpperCase(),
    )

    export const log = createLog(
        m => console.log(`${COLORS.PURPLE}${getTime()}:${COLORS.RESET}`, m),
        m => m.toUpperCase(),
    )
    export const error = createLog(
        m => console.error(`${COLORS.RED}${getTime()}:${COLORS.RESET}`, m),
        m => m.toUpperCase(),
    )
    export const warn = createLog(
        m => console.warn(`${COLORS.GREEN}${getTime()}:${COLORS.RESET}`, m),
        m => m.toUpperCase(),
    )
    export const debug = createLog(
        m => console.debug(`${COLORS.BLUE}${getTime()}:${COLORS.RESET}`, m),
        m => m.toUpperCase(),
    )
    export const trace = createLog(
        m => console.trace(`${COLORS.CYAN}${getTime()}:${COLORS.RESET}`, m),
        m => m.toUpperCase(),
    )

    // [2, 5, 9].forEach(logArrayElements);
    export const logArrayElements = <T>(index: number, array: T[]): void => {
        log(`array[${index}] = ${array[index]}`)
    }

    export const dump = (obj: any): string => {
        let out = ''
        if (obj && typeof obj === 'object') {
            for (const i in obj) {
                if (hasOwnProp.call(obj, i)) {
                    out += `${i}: ${obj[i]}n`
                }
            }
        } else {
            out = obj
        }

        return out
    }
}
