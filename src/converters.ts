export namespace Conversion {
    const regex = /^([-+]?[0-9]+(\.[0-9]+)?)(m?s)$/

    export const from = (cssTime: string): number => {
        const matches = regex.exec(cssTime)

        if (matches === null) {
            throw new Error('Invalid CSS time')
        }

        return parseFloat(matches[1]) * (matches[3] === 's' ? 1000 : 1)
    }

    export const to = (milliseconds: number): string => {
        if (null === milliseconds || isNaN(milliseconds)) {
            throw new Error('Invalid milliseconds')
        }

        return `${milliseconds}ms`
    }
}
