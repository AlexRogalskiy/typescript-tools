import { EXTENSION_SYMBOL, EXTENSION_TYPE_SYMBOL } from './constants'

export interface IExtension<T> {
    [EXTENSION_SYMBOL]: symbol
    [EXTENSION_TYPE_SYMBOL]?: T
}
