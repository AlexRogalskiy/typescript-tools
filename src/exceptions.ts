import { ErrorType } from '../typings/domain-types'

export namespace Exceptions {
    export type ErrorMessage = {
        name: ErrorType
        message: string
    }

    export const exception = (name: ErrorType, message: string): ErrorMessage => {
        return { name, message }
    }

    export const typeException = (message: string): ErrorMessage => {
        return { name: ErrorType.type_error, message }
    }

    export const valueException = (message: string): ErrorMessage => {
        return { name: ErrorType.value_error, message }
    }
}
