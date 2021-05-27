const getCustomProperties = ((): (() => CSSStyleDeclaration) => {
    let cssDecl: CSSStyleDeclaration

    return (): CSSStyleDeclaration => {
        if (!cssDecl) {
            cssDecl = getComputedStyle(document.documentElement, null)
        }

        return cssDecl
    }
})()

export const getCustomProperty = ((): ((name: string) => number | string) => {
    const cachedValues: { [key: string]: number | string } = {}

    return (name: string): number | string => {
        if (!cachedValues[name]) {
            const all = getCustomProperties()
            const value = all.getPropertyValue(name).trim()

            if (value.endsWith('px')) {
                return parseInt(value, 10)
            }

            cachedValues[name] = value
        }

        return cachedValues[name]
    }
})()
