export const requireFile = (file: string): any => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(`${file}`)
    } catch (err) {
        return undefined
    }
}
