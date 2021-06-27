import { v4 as uuidv4 } from 'uuid'

export type OutputBuffer = ArrayLike<number>
export type InputBuffer = ArrayLike<number>

export interface RandomOptions {
    random?: InputBuffer
}
export interface RngOptions {
    rng?: () => InputBuffer
}

export interface V1BaseOptions {
    node?: InputBuffer
    clockseq?: number
    msecs?: number | Date
    nsecs?: number
}
export type V4Options = RandomOptions | RngOptions

export const uuid = (options?: V4Options): string => {
    return uuidv4(options)
}
