import { ITypedConstructor, ValueToken } from '../typings/function-types'

export function createValueToken<T extends Record<string, any>>(
    obj: string | ITypedConstructor<T> | T,
): ValueToken<T> {
    // just fake function to keep type T
    const token = (): any => null as unknown as T
    const name = getName(obj)

    Object.defineProperty(token, 'name', { value: name, writable: false })

    return token
}

function getName(obj: any): string {
    if (!obj) {
        return 'unknown'
    }
    if (typeof obj === 'string') {
        return obj
    }
    if (typeof obj === 'object') {
        if (obj.constructor) {
            return obj.constructor.name || 'unknown'
        }
    } else if (typeof obj === 'function') {
        return obj.name || 'unknown'
    }
    return 'unexpected'
}
