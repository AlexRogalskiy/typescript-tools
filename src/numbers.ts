export namespace Numbers {
    export const random = (max: number): number => {
        return Math.floor(Math.random() * max)
    }

    export const average = (delta: number, numberOfDays: number): number | undefined => {
        if (delta === undefined) return undefined

        return round(delta / numberOfDays)
    }

    export const round = (number: number, decimals = 1): number => {
        const i = Math.pow(10, decimals)

        return Math.round(number * i) / i
    }

    export const orderBy = <T>(items: T[], fn): T[] => {
        return items.sort((a, b) => fn(b) - fn(a))
    }

    export const getSign = (value: number): string => {
        if (value === 0) return ''

        return value > 0 ? '+' : '-'
    }
}
