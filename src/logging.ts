export namespace Logging {
    export const toLog = (...args: unknown[]): void => {
        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
            return
        }
        console.log(...args)
    }

    export const createUpCaseLog = logger => {
        return message => {
            logger(`${message.toUpperCase()}`)
        }
    }

    export const log = createUpCaseLog(message => console.log(message))
    export const error = createUpCaseLog(message => console.error(message))
    export const warn = createUpCaseLog(message => console.warn(message))
    export const debug = createUpCaseLog(message => console.debug(message))
    export const trace = createUpCaseLog(message => console.trace(message))
}
