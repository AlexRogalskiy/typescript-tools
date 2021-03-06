import boxen from 'boxen'
import chalk from 'chalk'
import dateFormat from 'dateformat'

import { Processor } from '../../typings/function-types'

import { Profiles } from '../configuration/profiles'

import { CommonUtils } from '..'

export namespace Logging {
    import profile = Profiles.config
    import mergeProps = CommonUtils.mergeProps

    const { hasOwnProperty: hasOwnProp } = Object.prototype

    const DATETIME_FORMAT = 'dddd, mmmm dS, yyyy, hh:MM:ss TT'

    export const levels: Record<number, string> = {
        10: chalk.gray('TRACE'),
        20: chalk.blue('DEBUG'),
        30: chalk.green(' INFO'),
        40: chalk.magenta(' WARN'),
        50: chalk.red('ERROR'),
        60: chalk.bgRed('FATAL'),
    }

    const getColor = (value: string, defaultValue = ''): string =>
        process.stdout.isTTY ? value : defaultValue

    /**
     * Logger
     * @desc Type representing logging function
     */
    type Logger<T, V> = (message: T, ...args: V[]) => void

    const COLORS = {
        RESET: getColor('\x1b[0m'),
        BLACK: getColor('\x1b[0;30m'),
        RED: getColor('\x1b[0;31m'),
        GREEN: getColor('\x1b[0;32m'),
        BROWN: getColor('\x1b[0;33m'),
        BLUE: getColor('\x1b[0;34m'),
        PURPLE: getColor('\x1b[0;35m'),
        CYAN: getColor('\x1b[0;36m'),
        LIGHT_GRAY: getColor('\x1b[0;37m'),
        DARK_GRAY: getColor('\x1b[1;30m'),
        LIGHT_RED: getColor('\x1b[1;31m'),
        LIGHT_GREEN: getColor('\x1b[1;32m'),
        YELLOW: getColor('\x1b[1;33m'),
        LIGHT_BLUE: getColor('\x1b[1;34m'),
        LIGHT_PURPLE: getColor('\x1b[1;35m'),
        LIGHT_CYAN: getColor('\x1b[1;36m'),
        WHITE: getColor('\x1b[1;37m'),
    }

    const getTime = (format = DATETIME_FORMAT, utc = false): string => {
        return dateFormat(Date.now(), format, utc)
    }

    export const toLog = (message: string, ...args: unknown[]): void => {
        console.group('>>>')
        console.log(`${COLORS.PURPLE}${getTime()}:${COLORS.RESET}`, message, ...args)
        console.groupEnd()
    }

    export const createLogger = <T>(logger: Logger<T, any>, processor?: Processor<T, T>): Logger<T, any> => {
        return (message, ...args) => {
            logger(processor ? processor(message) : message, ...args)
        }
    }

    export const logs = createLogger((message, ...args) =>
        console.log(`${COLORS.PURPLE}${getTime()}:${COLORS.RESET}`, message, args),
    )
    export const errorLogs = createLogger((message, ...args) =>
        console.error(`${COLORS.RED}${getTime()}:${COLORS.RESET}`, message, args),
    )
    export const warnLogs = createLogger((message, ...args) =>
        console.warn(`${COLORS.GREEN}${getTime()}:${COLORS.RESET}`, message, args),
    )
    export const debugLogs = createLogger((message, ...args) =>
        console.debug(`${COLORS.BLUE}${getTime()}:${COLORS.RESET}`, message, args),
    )
    export const traceLogs = createLogger((message, ...args) =>
        console.trace(`${COLORS.CYAN}${getTime()}:${COLORS.RESET}`, message, args),
    )

    export const boxenLogs = createLogger(console.log, message => boxen(message, profile.outputOptions))

    export const boxenErrorLogs = createLogger(console.error, message =>
        boxen(
            message,
            mergeProps(profile.outputOptions, {
                borderColor: 'red',
                borderStyle: 'double',
            }),
        ),
    )
    export const boxenWarnLogs = createLogger(console.warn, message =>
        boxen(message, mergeProps(profile.outputOptions, { borderColor: 'green' })),
    )
    export const boxenDebugLogs = createLogger(console.debug, message =>
        boxen(message, mergeProps(profile.outputOptions, { borderColor: 'blue' })),
    )
    export const boxenTraceLogs = createLogger(console.trace, message =>
        boxen(message, mergeProps(profile.outputOptions, { borderColor: 'cyan' })),
    )

    // [2, 5, 9].forEach(logArrayElements);
    export const logArrayElements = <T>(index: number, array: T[]): void => {
        logs(`array[${index}] = ${array[index]}`)
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
