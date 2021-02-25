import dateFormat from 'dateformat'

import { Checkers } from '../src'
import { Converter } from './converter'
import isNumber = Checkers.isNumber
import isObject = Checkers.isObject
import isString = Checkers.isString

/**
 * Custom logger class to generate formatted log entries
 */
export class Logger {
    /**
     * Custom {@link Logger} instance
     * @private
     */
    private static readonly INSTANCE: Logger

    private static DATETIME_FORMAT = 'dddd, mmmm dS, yyyy, hh:MM:ss TT'
    private static COLORS_PRESET = {
        white: '#ffffff',
        pink: '#ff00ff',
        yellow: '#ffff00',
        green: '#00ff00',
        blue: '#0000ff',
        black: '#000000',
        red: '#f00000',
    }

    private static output(dateTime: string, message: string, ...args: any[]): string {
        return `Logger => time: ${dateTime}, message: ${message}, args: ${args}`
    }

    private static getOutputStyle(type: string): string {
        return `color: ${
            Logger.COLORS_PRESET[type] ? Logger.COLORS_PRESET[type] : Logger.COLORS_PRESET['black']
        }`
    }

    private static getTime(format = '', utc = false): string {
        format = isString(format) ? format : Logger.DATETIME_FORMAT

        return dateFormat(Date.now(), format, utc)
    }

    private static getLocalTime(format = '', offset = 0, utc = false): string {
        format = isString(format) ? format : Logger.DATETIME_FORMAT
        const currentDate = new Date()
        const currentTime = currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000
        const localCurrentTime = new Date(currentTime + offset * 60 * 60 * 1000)

        return dateFormat(localCurrentTime, format, utc)
    }

    static getMessage(messages: string[], ...args: any[]): string {
        let result = ''
        for (let i = 0; i < args.length; i++) {
            result += messages[i]
            result += isObject(args[i]) ? Converter.serialize(args[i]) : args[i]
        }
        result += messages[messages.length - 1]

        return result
    }

    static getMessage2(messages: string[], ...args: any[]): string {
        return messages.reduce((s, v, idx) => {
            return (
                s +
                (idx > 0
                    ? isObject(args[idx - 1])
                        ? Converter.serialize(args[idx - 1])
                        : args[idx - 1]
                    : '') +
                v
            )
        }, '')
    }

    static getRawMessage(messages: string[], ...args: any[]): string {
        let result = ''
        for (let i = 0; i < args.length; i++) {
            result += messages[i]
            result += isObject(args[i]) ? Converter.serialize(args[i]) : args[i]
        }
        result += messages[messages.length - 1]

        return result
    }

    static getRawMessage2(messages: string[], ...args: any[]): string {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return messages.reduce((s, v, idx) => {
            return (
                String.raw`s` +
                (idx > 0
                    ? isObject(args[idx - 1])
                        ? Converter.serialize(args[idx - 1])
                        : args[idx - 1]
                    : '') +
                String.raw`v`
            )
        }, '')
    }

    static getCurrencyMessage(symbol: string, messages: string[], ...args: any[]): string {
        return messages.reduce((s, v, idx) => {
            if (idx > 0) {
                if (isNumber(args[idx - 1])) {
                    s += `${symbol}${args[idx - 1].toFixed(2)}`
                } else {
                    s += args[idx - 1]
                }
            }
            return s + v
        }, '')
    }

    private constructor() {
        // empty
    }

    static getLogger(): Logger {
        const value = Symbol.for('instance')

        if (!Logger.INSTANCE[value]) {
            Logger.INSTANCE[value] = new Logger()
        }

        return Logger.INSTANCE[value]
    }

    debug(message: string, ...args: any[]): void {
        console.log(`%c${Logger.output(Logger.getTime(), message, args)}`, Logger.getOutputStyle('green'))
    }

    error(message: string, ...args: any[]): void {
        console.error(`%c${Logger.output(Logger.getTime(), message, args)}`, Logger.getOutputStyle('red'))
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`%c${Logger.output(Logger.getTime(), message, args)}`, Logger.getOutputStyle('blue'))
    }

    info(message: string, ...args: any[]): void {
        console.info(`%c${Logger.output(Logger.getTime(), message, args)}`, Logger.getOutputStyle('pink'))
    }

    group(message: string, ...args: any[]): void {
        console.group(Logger.output(Logger.getLocalTime(), message))
        console.log(args)
        console.groupEnd()
    }
}
