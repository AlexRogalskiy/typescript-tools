import { Checkers } from '..'

export namespace Bools {
    import isPlainObject = Checkers.isPlainObject

    export const bool = (value: any): boolean => {
        if (Array.isArray(value)) {
            return value.length > 0
        }

        if (isPlainObject(value)) {
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    return true
                }
            }

            return false
        }

        return Boolean(value)
    }
}
