import { Checkers } from '..'

export namespace Bools {
    export const bool = (value: any): boolean => {
        if (Array.isArray(value)) {
            return value.length > 0
        }

        if (Checkers.isPlainObject(value)) {
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
