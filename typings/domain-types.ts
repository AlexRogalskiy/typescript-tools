import { Profile } from './enum-types'
// -------------------------------------------------------------------------------------------------
export type WebRequest = {
    method: string
    uri: string
    // body can be string or ReadableStream
    body: string
    headers: any
}

export type WebResponse = {
    statusCode: number
    statusMessage: string
    headers: any
    body: any
}

export type WebRequestOptions = {
    retriableErrorCodes?: string[]
    retryCount?: number
    retryIntervalInSeconds?: number
    retriableStatusCodes?: number[]
    retryRequestTimedout?: boolean
}

// -------------------------------------------------------------------------------------------------
export interface GenericObject {
    [key: string]: any
}

// -------------------------------------------------------------------------------------------------
export interface Rectangular {
    x: number
    y: number
    width: number
    height: number
}

export interface Point {
    x: number
    y: number
}

export interface TextStyle {
    font?: string
    color?: string
}

export interface TickValueDescription {
    value: number
    color?: string
}

// -------------------------------------------------------------------------------------------------
export type ProfileOptions<T> = {
    [K in Profile]: T
}

// -------------------------------------------------------------------------------------------------
/**
 * Configuration options type
 */
export interface ConfigOptions<T> {
    /**
     * Configuration options.
     */
    readonly options: ProfileOptions<T>
}

// -------------------------------------------------------------------------------------------------
