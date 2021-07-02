const keyGenerator = (...args: any[]): string => args.join(',')

export const func = (fn: any, keyfn = keyGenerator): any => {
    const mem = {}

    return (...args) => {
        const key = keyfn(...args)

        if (mem[key] == null) {
            mem[key] = fn(...args)
        }

        return mem[key]
    }
}
