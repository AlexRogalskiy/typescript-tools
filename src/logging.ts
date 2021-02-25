import { BiConsumer, Consumer, Processor } from '../typings/function-types'

export namespace Logging {
    export const toLog = (message: string, ...args: unknown[]): void => {
        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
            return
        }
        console.log(message, ...args)
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
        (m, ...args) => console.log(m, args),
        m => m.toUpperCase(),
    )
    export const errors = createLogs(
        (m, ...args) => console.error(m, args),
        m => m.toUpperCase(),
    )
    export const warns = createLogs(
        (m, ...args) => console.warn(m, args),
        m => m.toUpperCase(),
    )
    export const debugs = createLogs(
        (m, ...args) => console.debug(m, args),
        m => m.toUpperCase(),
    )
    export const traces = createLogs(
        (m, ...args) => console.trace(m, args),
        m => m.toUpperCase(),
    )

    export const log = createLog(
        m => console.log(m),
        m => m.toUpperCase(),
    )
    export const error = createLog(
        m => console.error(m),
        m => m.toUpperCase(),
    )
    export const warn = createLog(
        m => console.warn(m),
        m => m.toUpperCase(),
    )
    export const debug = createLog(
        m => console.debug(m),
        m => m.toUpperCase(),
    )
    export const trace = createLog(
        m => console.trace(m),
        m => m.toUpperCase(),
    )

    // [2, 5, 9].forEach(logArrayElements);
    export const logArrayElements = <T>(index: number, array: T[]): void => {
        log(`array[${index}] = ${array[index]}`)
    }

    export const dump = (obj: any): string => {
        let out = ''
        if (obj && typeof obj == 'object') {
            for (const i in obj) {
                out += `${i}: ${obj[i]}n`
            }
        } else {
            out = obj
        }

        return out
    }
}
