export const assertEnv = (name: string): string => {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Missing env "${name}"`)
    }

    return value
}
