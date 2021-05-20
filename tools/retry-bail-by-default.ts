import retry from 'async-retry'

const canRetry = (error: any): any => {
    error.dontBail = true
    return error
}

export async function retryBailByDefault(fn: any, opts: any): Promise<any> {
    return await retry(async () => {
        try {
            return await fn(canRetry)
        } catch (error) {
            if (error.dontBail) {
                delete error.dontBail
            } else {
                error.bail = true
            }
            throw error
        }
    }, opts)
}
