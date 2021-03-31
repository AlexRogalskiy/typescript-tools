import boxen from 'boxen'

import { Optional } from './standard-types'
import { Profile } from './enum-types'

import { Camera } from '../tools/camera'
import { Color } from '../tools/color'
import { Vector } from '../tools/vector'

// -------------------------------------------------------------------------------------------------
/**
 * Headers
 * @desc Type representing collection of headers
 */
export type Headers = Record<string, string | string[] | undefined>
// -------------------------------------------------------------------------------------------------
/**
 * PathLike
 * @desc Type representing supported paths
 */
export type PathLike = string | Buffer | URL
// -------------------------------------------------------------------------------------------------
/**
 * HttpRequest
 * @desc Type representing supported http request methods
 */
export type HttpRequest = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete'
// -------------------------------------------------------------------------------------------------
/**
 * ProfileOptions
 * @desc Type representing profile options
 */
export type ProfileOptions = {
    /**
     * Output options
     */
    readonly outputOptions?: boxen.Options
}
// -------------------------------------------------------------------------------------------------
/**
 * FormatCodeSettings
 * @desc Type representing format code settings
 */
export type FormatCodeSettings = Record<string, any>

/**
 * Result
 * @desc Type representing result options
 */
export interface Result {
    fileName: string
    settings: Optional<FormatCodeSettings>
    message: string
    error: boolean
    src: string
    dest: string
    throwNotFound?: boolean
}

/**
 * ResultMap
 * @desc Type representing result map
 */
export interface ResultMap {
    [index: string]: Result
}

// -------------------------------------------------------------------------------------------------
/**
 * ResponseType
 * @desc Type representing supported response types
 */
export type ResponseType = 'json' | 'buffer' | 'text'

// -------------------------------------------------------------------------------------------------
/**
 * PreCommitConfig
 * @desc Type representing pre-commit configuration
 */
export type PreCommitConfig = {
    repos: PreCommitDependency[]
}

export function matchesPrecommitConfigHeuristic(data: unknown): data is PreCommitConfig {
    return data !== null && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'repos')
}

/**
 * PreCommitDependency
 * @desc Type representing pre-commit dependency
 */
export type PreCommitDependency = {
    repo: string
    rev: string
}

export function matchesPrecommitDependencyHeuristic(data: unknown): data is PreCommitDependency {
    return (
        data !== null &&
        typeof data === 'object' &&
        Object.prototype.hasOwnProperty.call(data, 'repo') &&
        Object.prototype.hasOwnProperty.call(data, 'rev')
    )
}

// -------------------------------------------------------------------------------------------------
/**
 * LockFileEntry
 * @desc Type representing lock file entry
 */
export type LockFileEntry = Record<string, { version: string; integrity?: boolean }>

/**
 * LockFile
 * @desc Type representing lock file
 */
export interface LockFile {
    lockedVersions: Record<string, string>
    lockfileVersion?: number
    isYarn1?: boolean
}

// -------------------------------------------------------------------------------------------------
/**
 * MatchResult
 * @desc Type representing supported response types
 */
export type MatchResult = {
    idx: number
    len: number
    label: string
    substr: string
}
// -------------------------------------------------------------------------------------------------
/**
 * GitOptions
 * @desc Type representing git options
 */
export type DataSource = {
    datasource: string
    registryUrl?: string
    lookupName: string
}

// -------------------------------------------------------------------------------------------------
/**
 * GitOptions
 * @desc Type representing git options
 */
export type GitOptions = Record<string, null | string | number>

// -------------------------------------------------------------------------------------------------
/**
 * FileData
 * @desc Type representing file data
 */
export interface FileData {
    isLastPage: boolean

    lines: { text: string }[]

    size: number
}

// -------------------------------------------------------------------------------------------------
/**
 * UpdateType
 * @desc Type representing updates labels
 */
export type UpdateType =
    | 'major'
    | 'minor'
    | 'patch'
    | 'pin'
    | 'digest'
    | 'lockFileMaintenance'
    | 'lockfileUpdate'
    | 'rollback'
    | 'bump'

// -------------------------------------------------------------------------------------------------
/**
 * GroupConfig
 * @desc Type representing group configuration
 */
export interface GroupConfig extends Record<string, unknown> {
    branchName?: string
    branchTopic?: string
}

// -------------------------------------------------------------------------------------------------
/**
 * Level
 * @desc Type representing supported logging levels
 */
export type Level = 'debug' | 'warning' | 'error'
// -------------------------------------------------------------------------------------------------
/**
 * Direction
 * @desc Type representing direction
 */
export type Direction = -1 | 0 | 1

// -------------------------------------------------------------------------------------------------
/**
 * Options
 * @desc Type representing direction
 */
export interface Options {
    dryRun?: boolean
    verbose?: boolean
    baseDir?: string
    throwNotFound?: boolean
}

// -------------------------------------------------------------------------------------------------
/**
 * Ray
 * @desc Type representing ray
 */
export interface Ray {
    start: Vector
    dir: Vector
}

/**
 * Intersection
 * @desc Type representing intersection
 */
export interface Intersection<T extends Thing> {
    thing: T
    ray: Ray
    dist: number
}

/**
 * Surface
 * @desc Type representing surface
 */
export interface Surface {
    diffuse: (pos: Vector) => Color
    specular: (pos: Vector) => Color
    reflect: (pos: Vector) => number
    roughness: number
}

/**
 * Thing
 * @desc Type representing thing
 */
export interface Thing {
    intersect: (ray: Ray) => Optional<Intersection<Thing>>
    normal: (pos: Vector) => Vector
    surface: Surface
}

/**
 * Light
 * @desc Type representing light
 */
export interface Light {
    pos: Vector
    color: Color
}

/**
 * Scene
 * @desc Type representing scene
 */
export interface Scene {
    things: Thing[]
    lights: Light[]
    camera: Camera
}

// -------------------------------------------------------------------------------------------------
/**
 * WebRequest
 * @desc Interface representing web request options
 */
export type WebRequest = {
    method: string
    uri: string
    // body can be string or ReadableStream
    body: string
    headers: any
}

/**
 * WebResponse
 * @desc Interface representing web response options
 */
export type WebResponse = {
    statusCode: number
    statusMessage: string
    headers: any
    body: any
}

/**
 * WebRequestOptions
 * @desc Interface representing web request options
 */
export type WebRequestOptions = {
    retriableErrorCodes?: string[]
    retryCount?: number
    retryIntervalInSeconds?: number
    retriableStatusCodes?: number[]
    retryRequestTimedout?: boolean
}

// -------------------------------------------------------------------------------------------------
/**
 * GenericObject
 * @desc Interface representing generic object data
 */
export interface GenericObject {
    [key: string]: any
}

// -------------------------------------------------------------------------------------------------
/**
 * Rectangular
 * @desc Interface representing rectangular data
 */
export interface Rectangular {
    x: number
    y: number
    width: number
    height: number
}

/**
 * Point
 * @desc Interface representing point style data
 */
export interface Point {
    x: number
    y: number
}

/**
 * TextStyle
 * @desc Interface representing text style data
 */
export interface TextStyle {
    font?: string
    color?: string
}

/**
 * TickValueDescription
 * @desc Interface representing tick value data
 */
export interface TickValueDescription {
    value: number
    color?: string
}

// -------------------------------------------------------------------------------------------------
/**
 * ProfileOptions
 * @desc Type representing profile configuration options
 */
export type ProfileRecord<T> = {
    [K in Profile]: T
}

// -------------------------------------------------------------------------------------------------
/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions<T> = {
    /**
     * Configuration options.
     */
    readonly options: ProfileRecord<T>
}

// -------------------------------------------------------------------------------------------------
