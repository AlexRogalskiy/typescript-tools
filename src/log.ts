export namespace Logging {
    export const log = (...args: unknown[]): void => {
        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
            return
        }
        console.log(...args)
    }
}
