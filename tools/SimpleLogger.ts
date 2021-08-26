import dayjs from 'dayjs'

export enum Loglevel {
    INFO,
    DEBUG,
    WARNING,
    ERROR
}

export interface Logger {
    error: LogFn
    info: LogFn
    debug: LogFn
}

type LogFn = (logMessage: string) => void

const wrap = (store: string[]): any => (
    logmethod: (msg: any, ...optionalParameters: any[]) => void
): LogFn => {
    return (logMessage: string): void => {
        store.push(logMessage)
        logmethod(logMessage)
    }
}

/**
 * Simple logger for ZBClient
 */
const logger = (loglevel: Loglevel): LogFn => {
    return (logMessage: string): void => {
        let message: string
        try {
            const parsedMessage = JSON.parse(logMessage)
            const gRPC =
                parsedMessage.id === 'gRPC Channel' ? ' [gRPC Channel]:' : ''
            const taskType = parsedMessage.taskType
                ? ` [${parsedMessage.taskType}]`
                : ''
            const msg =
                typeof parsedMessage.message === 'object'
                    ? JSON.stringify(parsedMessage.message)
                    : parsedMessage.message
            message = `| zeebe | ${gRPC}${taskType} ${loglevel}: ${msg}`
        } catch (e) {
            message = logMessage
        }
        const time = dayjs().format('HH:mm:ss.SSS')
        const err = new Error('Debug stack trace')
        const stack = err.stack!.split('\n')

        // tslint:disable: no-console
        const loggers = {
            DEBUG: console.debug,
            ERROR: console.error,
            INFO: console.info,
            WARN: console.warn,
        }
        const logMethod = loggers[loglevel]
        const info =
            loglevel === Loglevel.DEBUG
                ? `${time} ${message}\n${stack}`
                : `${time} ${message}`
        logMethod(info)
    }
}

export const ZBSimpleLogger: Logger = {
    debug: logger(Loglevel.DEBUG),
    error: logger(Loglevel.ERROR),
    info: logger(Loglevel.INFO),
}

export const LogInfo = (values: string[]): any => wrap(values)(m => ZBSimpleLogger.info(m))

export const LogError = (values: string[]): any => wrap(values)(e => ZBSimpleLogger.error(e))
