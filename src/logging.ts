import { Consumer, Processor } from '../typings/function-types'

export namespace Logging {
    export const toLog = (...args: unknown[]): void => {
        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
            return
        }
        console.log(...args)
    }

    export const createLog = (
        logger: Consumer<string>,
        processor: Processor<string, string>,
    ): Consumer<string> => {
        return message => {
            logger(`${processor(message)}`)
        }
    }

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
