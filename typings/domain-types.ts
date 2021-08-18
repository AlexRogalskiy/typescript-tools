import boxen from 'boxen'
import * as TypeFest from 'type-fest'

import { ObjectMap, Optional, Primitive, PropertyRecord, StringRecord } from './standard-types'
import { Profile } from './enum-types'

import { Camera } from '../tools/camera'
import { Color } from '../tools/color'
import { Vector } from '../tools/vector'

// -------------------------------------------------------------------------------------------------
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    Object: any
    DateTime: any
}

// -------------------------------------------------------------------------------------------------
export type HTTP_METHODS_LOWERCASE = 'head' | 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options'
export type GenericValue = string | number | boolean | undefined | null
export type AnyObject = Record<string, GenericValue | GenericValue[] | unknown>

export interface IBinaryData {
    [key: string]: string | undefined

    data: string
    mimeType: string
    fileName?: string
    fileExtension?: string
}

// -------------------------------------------------------------------------------------------------
export interface NetworkInterfaceBase {
    address: string
    netmask: string
    mac: string
    internal: boolean
    cidr: string | null
}

export interface NetworkInterfaceInfoIPv4 extends NetworkInterfaceBase {
    family: 'IPv4'
}

export interface NetworkInterfaceInfoIPv6 extends NetworkInterfaceBase {
    family: 'IPv6'
    scopeid: number
}

export type NetworkInterfaceInfo = NetworkInterfaceInfoIPv4 | NetworkInterfaceInfoIPv6
// -------------------------------------------------------------------------------------------------
export type Pixels = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement

// -------------------------------------------------------------------------------------------------
export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
    timeStyle?: 'full' | 'long' | 'medium' | 'short'
}

// -------------------------------------------------------------------------------------------------
export type rgbaArray = number[]
export type Int32ARGBColor = number
export type ColorType = Int32ARGBColor | rgbaArray | string

// -------------------------------------------------------------------------------------------------
/**
 * Action Parameter metadata.
 */
export interface ParamMetadata {
    /**
     * Parameter type.
     */
    type: ParamType

    /**
     * Parameter name.
     */
    name: string

    /**
     * Parameter target type.
     */
    targetType?: any

    /**
     * Parameter target type's name in lowercase.
     */
    targetName: string

    /**
     * Indicates if target type is an object.
     */
    isTargetObject: boolean

    /**
     * Parameter target.
     */
    target: any

    /**
     * Specifies if parameter should be parsed as json or not.
     */
    parse: boolean

    /**
     * Indicates if this parameter is required or not
     */
    required: boolean
}

// -------------------------------------------------------------------------------------------------
export type CamelCasedPropsGlobal<T> = { [K in keyof T as TypeFest.CamelCase<K>]: T[K] }

// -------------------------------------------------------------------------------------------------
export interface AxiosProxyConfig {
    host: string
    port?: number
    auth?: {
        username: string
        password: string
    }
}

// -------------------------------------------------------------------------------------------------
export type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined

export type DeepPartial<T> = T extends Builtin
    ? T
    : T extends (infer U)[]
    ? DeepPartial<U>[]
    : T extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : T extends {}
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>

// -------------------------------------------------------------------------------------------------
export enum TestAttributes {
    /** Name of the testing framework executing the test */
    TEST_FRAMEWORK = 'test.framework',

    /** Name of the test itself, without suites */
    TEST_NAME = 'test.name',

    /** Name of the test with the suites */
    TEST_FULL_NAME = 'test.full_name',

    /** Array of suites in which the test reside, in order of nesting (from outer to inner) */
    TEST_SUITES = 'test.suites',

    /** boolean value indicating it the test failed due to timeout */
    TEST_RESULT_TIMEDOUT = 'test.result.timedout',

    /** How many timed to retry failed test */
    TEST_RETRIES = 'test.retries',

    /** the retry attempt to run this test */
    TEST_CURRENT_RETRY = 'test.current_retry',
}

// -------------------------------------------------------------------------------------------------
export type BufferEncodingOption = 'buffer' | { encoding: 'buffer' }
// -------------------------------------------------------------------------------------------------
export type ClientLogLevel = 'error' | 'warning' | 'info'
// -------------------------------------------------------------------------------------------------
export type ErrorConstructor = new (...args: any[]) => Error

// -------------------------------------------------------------------------------------------------
export interface TryFn<Context = unknown> {
    /**
     * Attempt to run some assertions. The result must be explicitly committed or discarded or else
     * the test will fail. The title may help distinguish attempts from one another.
     */ <Args extends unknown[]>(title: string, context: Context, ...args: Args): Promise<any>
}

// -------------------------------------------------------------------------------------------------
/**
 * Controller action properties.
 */
export interface Action {
    /**
     * Action Request object.
     */
    request: any

    /**
     * Action Response object.
     */
    response: any

    /**
     * Content in which action is executed.
     * Koa-specific property.
     */
    context?: any

    /**
     * "Next" function used to call next middleware.
     */
    next?: Function
}

// -------------------------------------------------------------------------------------------------
/**
 * Controller action's parameter type.
 */
export type ParamType =
    | 'body'
    | 'body-param'
    | 'query'
    | 'queries'
    | 'header'
    | 'headers'
    | 'file'
    | 'files'
    | 'param'
    | 'params'
    | 'session'
    | 'session-param'
    | 'state'
    | 'cookie'
    | 'cookies'
    | 'request'
    | 'response'
    | 'context'
    | 'current-user'
    | 'custom-converter'
// -------------------------------------------------------------------------------------------------
/**
 * Response handler type.
 */
export type ResponseHandlerType =
    | 'success-code'
    | 'error-code'
    | 'content-type'
    | 'header'
    | 'rendered-template'
    | 'redirect'
    | 'location'
    | 'on-null'
    | 'on-undefined'
    | 'response-class-transform-options'
    | 'authorized'
// -------------------------------------------------------------------------------------------------
/**
 * Controller action type.
 */
export type ActionType =
    | 'all'
    | 'checkout'
    | 'connect'
    | 'copy'
    | 'delete'
    | 'get'
    | 'head'
    | 'lock'
    | 'merge'
    | 'mkactivity'
    | 'mkcol'
    | 'move'
    | 'm-search'
    | 'notify'
    | 'options'
    | 'patch'
    | 'post'
    | 'propfind'
    | 'proppatch'
    | 'purge'
    | 'put'
    | 'report'
    | 'search'
    | 'subscribe'
    | 'trace'
    | 'unlock'
    | 'unsubscribe'
// -------------------------------------------------------------------------------------------------
export type ClassConstructor<T> = { new (...args: any[]): T }

// -------------------------------------------------------------------------------------------------
export interface ShutdownHandler {
    (): Promise<any> | any
}

// -------------------------------------------------------------------------------------------------
export type HelmRepository = {
    name: string
    url: string
}
// -------------------------------------------------------------------------------------------------
export type IpLogger = {
    ip: string | null
}

// -------------------------------------------------------------------------------------------------
export type TrieLeafValue = string | string[]

export type TrieValue = TrieData | TrieLeafValue | undefined

export type TrieData = Map<string | RegExp, TrieValue>
// -------------------------------------------------------------------------------------------------
export type UserData = {
    email?: string
    id: string
}

export type TrackSegmentEvent = {
    active?: boolean
    event: string
    properties?: Record<string, unknown>
    user: UserData
}
// -------------------------------------------------------------------------------------------------
export type File = {
    branch: string | null
    content: string
    id: string
    is_deleted: boolean
    is_read_only: boolean
    path: string
    team_id: string
}

export type FormattedVariables = { [name: string]: string }

export type Email = {
    created_at?: string
    from: string
    html: string
    id: string
    is_outbound: boolean
    subject: string
    team_id: string
    text: string
    to: string
}

export type Environment = {
    created_at?: string
    id: string
    name: string
    team_id: string
    updated_at?: string
}

export type EnvironmentVariable = {
    created_at?: string
    environment_id: string
    id: string
    is_system?: boolean
    name: string
    team_id: string
    value: string
    updated_at?: string
}

// -------------------------------------------------------------------------------------------------
export interface IStackElement {
    _stackElementBrand: void
    readonly depth: number

    clone(): IStackElement

    equals(other: IStackElement): boolean
}

export interface ITokenizeLineResult {
    readonly tokens: IToken[]
    /**
     * The `prevState` to be passed on to the next line tokenization.
     */
    readonly ruleStack: IStackElement
}

export interface IToken {
    startIndex: number
    readonly endIndex: number
    readonly scopes: string[]
}

// -------------------------------------------------------------------------------------------------
export interface WithId {
    readonly id: number
}

export interface WithName {
    readonly name: string
}

// -------------------------------------------------------------------------------------------------
export interface GitHub {
    id: string
    name: string
    full_name?: string
    description: string
    url: string
    stars: number
    forks?: number
    opened_issues?: number
    homepage: string
}

// -------------------------------------------------------------------------------------------------
export type GenericClassDecorator<T> = (target: T) => void

// -------------------------------------------------------------------------------------------------
/**
 * Interface for implementations which decide
 * whether or not sampling should be done
 *
 * @param <T> type of the argument to be used for sampling decision
 */
export interface Sampler<T> {
    /**
     * Checks whether or not sampling should be done.
     *
     * @param arg to be used for sampling decision
     * @return {@code true} if sampling should be done,
     *         {@code false} otherwise
     */
    isSampled(arg?: T): boolean
}

// -------------------------------------------------------------------------------------------------
export type SignalConstants = {
    [key in NodeJS.Signals]: number
}
// -------------------------------------------------------------------------------------------------
export type Maybe<T> = T
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }

// -------------------------------------------------------------------------------------------------
export type ILocaleProvider = (locale: string) => Promise<string[][]> | string[][]

export interface Locale {
    [key: string]: string
}

// -------------------------------------------------------------------------------------------------
export interface UserType extends WithId, WithName {}

export const User = (id: number, name: string): UserType => ({ id, name })

export interface IssueType extends WithId, WithName {}

export const Issue = (id: number, name: string): IssueType => ({ id, name })

export interface CategoryType extends WithId, WithName {}

export const Category = (id: number, name: string): CategoryType => ({ id, name })

export interface VersionType extends WithId, WithName {}

export const Version = (id: number, name: string): VersionType => ({ id, name })

export interface PriorityType extends WithId, WithName {}

export const Priority = (id: number, name: string): PriorityType => ({ id, name })

export interface FieldItemType extends WithId, WithName {}

export const FieldItem = (id: number, name: string): FieldItemType => ({ id, name })
// -------------------------------------------------------------------------------------------------
export const notNull = <T, _>(t: T): boolean => t != null
export const isEmpty = (str: string): boolean => str === ''
// -------------------------------------------------------------------------------------------------
export type Platform = 'macOS' | 'Linux' | 'Windows'

// -------------------------------------------------------------------------------------------------
export interface IResultSetElementKey {
    readonly row?: number
    readonly column?: number
}

// -------------------------------------------------------------------------------------------------
export interface CellPosition {
    idx: number
    rowIdx: number
}

// -------------------------------------------------------------------------------------------------
export interface IMousePosition {
    x: number
    y: number
}

// -------------------------------------------------------------------------------------------------
export interface IDraggingPosition {
    rowIdx: number
    colIdx: number
}

// -------------------------------------------------------------------------------------------------
/**
 * NumberValue
 * @desc Type representing number value
 */
export type NumberValue = number | { valueOf(): number }

// -------------------------------------------------------------------------------------------------
/**
 * CodeSnippet
 * @desc Type representing code snippet
 */
export interface CodeSnippet {
    readonly name: string
    readonly label: string
    readonly description: string
    readonly body: string
}

// -------------------------------------------------------------------------------------------------
const aliases = {
    inlineCode: 'code',
    thematicBreak: 'hr',
    root: 'div',
} as const

export const isAlias = (x: string): x is keyof typeof aliases => x in aliases

// -------------------------------------------------------------------------------------------------
/**
 * DateOptions
 * @desc Type representing date options
 */
export type DateOptions = { from?: string | Date; to?: string | Date } | { year: number }

// -------------------------------------------------------------------------------------------------
/**
 * RepoInfo
 * @desc Type representing repository information
 */
export interface RepoInfo {
    id: string
    name: string
    url: string
    owner: string
    description: string
    homepage: Optional<string>
    size: number
    createdAt: string
    updatedAt: string
    stars: number
    branch: string
    subdir?: string[]
    exampleName?: string
    tagline?: string
    framework?: string
}

// -------------------------------------------------------------------------------------------------
/**
 * Repo
 * @desc Type representing repository
 */
export interface Repo {
    repo: string
    owner: {
        username: string
    }
    username: string
    branch: string
    path: string
}

// -------------------------------------------------------------------------------------------------
/**
 * FlatArray
 * @desc Type representing flat array
 */
export type FlatArray<Arr, Depth extends number> = {
    done: Arr
    recur: Arr extends readonly (infer InnerArr)[]
        ? FlatArray<
              InnerArr,
              [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]
          >
        : Arr
}[Depth extends -1 ? 'done' : 'recur']

// -------------------------------------------------------------------------------------------------
/**
 * ObjectConstructor
 * @desc Type representing object constructor interface
 */
export interface ObjectConstructor {
    assign(...objects: any[]): any
}

// -------------------------------------------------------------------------------------------------
/**
 * Labeled
 * @desc Type representing labeled data
 */
export type Labeled<T, R = { data: T } & { _label?: PropertyKey }> = R

// -------------------------------------------------------------------------------------------------
/**
 * GradleDependency
 * @desc Type representing gradle dependency
 */
export type GradleDependency = {
    group: string
    name: string
    version?: string
}

// -------------------------------------------------------------------------------------------------
/**
 * DockerComposeConfig
 * @desc Type representing docker compose configuration
 */
export type DockerComposeConfig = {
    version?: string
    services?: StringRecord<DockerComposeService>
}

/**
 * DockerComposeService
 * @desc Type representing docker compose service
 */
export type DockerComposeService = {
    image?: string
    build?: {
        context?: string
        dockerfile?: string
    }
}

// -------------------------------------------------------------------------------------------------
/**
 * JsonValue
 * @desc Type representing json value
 */
export interface JsonValue {
    [key: string]: Optional<string | number | boolean | JsonValue | JsonValue[]>
}

// -------------------------------------------------------------------------------------------------
/**
 * UserPass
 * @desc Type representing user passwords
 */
export type UserPass = {
    username: string
    password: string
}

// -------------------------------------------------------------------------------------------------
/**
 * JenkinsPluginRenovate
 * @desc Type representing jenkins plugin renovate
 */
export type JenkinsPluginRenovate = {
    ignore?: boolean
}

/**
 * JenkinsPluginRenovate
 * @desc Type representing jenkins plugin source
 */
export type JenkinsPluginSource = {
    version?: string
    url?: string
}

/**
 * JenkinsPluginRenovate
 * @desc Type representing jenkins plugin
 */
export type JenkinsPlugin = {
    artifactId?: string
    groupId?: string
    source?: JenkinsPluginSource
    renovate?: JenkinsPluginRenovate
}

/**
 * JenkinsPluginRenovate
 * @desc Type representing jenkins plugins
 */
export type JenkinsPlugins = {
    plugins?: JenkinsPlugin[]
}

// -------------------------------------------------------------------------------------------------
/**
 * Properties
 * @desc Type representing collection of properties
 */
export type Properties<T> = {
    [name: string]: T
}

// -------------------------------------------------------------------------------------------------
/**
 * Headers
 * @desc Type representing collection of headers
 */
export type Headers = Record<string, Optional<string | string[]>>
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
 * Fields
 * @desc Type representing supported fields
 */
export interface Fields {
    [key: string]: string | string[]
}

// -------------------------------------------------------------------------------------------------
/**
 * Grid
 * @desc Type representing supported grid
 */
export type Grid = {
    width: number
    height: number
    data: Uint8Array
}

// -------------------------------------------------------------------------------------------------
/**
 * Uint8ArrayTag
 * @desc Type representing supported Uint8ArrayTag
 */
export type Uint8ArrayTag = (tag: string) => Uint8Array & { tag }
// -------------------------------------------------------------------------------------------------
/**
 * Signature of a Node.js style callback
 */
export type NodeCallback<T> = (err: Error, data?: T) => void

// -------------------------------------------------------------------------------------------------
/**
 * ArrayBuffer
 * @desc Type representing array buffer interface
 */
export interface ArrayBuffer {
    /**
     * Read-only. The length of the ArrayBuffer (in bytes).
     */
    readonly byteLength: number

    /**
     * Returns a section of an ArrayBuffer.
     */
    slice(begin: number, end?: number): ArrayBuffer
}

// -------------------------------------------------------------------------------------------------
/**
 * LiteralUnion
 * @desc Type representing literal union
 */
export type LiteralUnion<LiteralType, BaseType extends Primitive> = LiteralType | (BaseType & { _?: never })

// -------------------------------------------------------------------------------------------------
export type Key = string | number
export type Ref<T> = string | ((instance: T) => any)
export type ComponentState = {} | void

/**
 * ClassAttributes
 * @desc Type representing attributes
 */
export interface Attributes {
    key?: Key
}

/**
 * ClassAttributes
 * @desc Type representing class attributes
 */
export interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>
}

// -------------------------------------------------------------------------------------------------
/**
 * Factory
 * @desc Type representing factory
 */
export type Factory<T, P> = (new () => T) | (new () => { props: P })

/**
 * Factory
 * @desc Type representing property factory
 */
export type PropertyFactory<T, P> = Factory<T, PropertyRecord<P>>

// -------------------------------------------------------------------------------------------------
/**
 * Files
 * @desc Type representing supported files
 */
export interface Files {
    [key: string]: File | File[]
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
 * SandboxObject
 * @desc Type representing sandbox type
 */
export type SandboxObject = {
    get(key: string): any
    set(key: string, value: any): void
}

/**
 * Location
 * @desc Type representing location
 */
export type Location = {
    longitude: number
    latitude: number
}

// -------------------------------------------------------------------------------------------------
/**
 * Comparable
 * @desc Type representing comparable interface
 */
export interface Comparable {
    compareTo: (object: any) => number
}

// -------------------------------------------------------------------------------------------------
/**
 * LanguageFeature
 * @desc Type representing supported language features
 */
export type LanguageFeature =
    | 'enum'
    | 'union'
    | 'no-defaults'
    | 'strict-optional'
    | 'date-time'
    | 'integer-string'
    | 'bool-string'
    | 'uuid'
    | 'minmax'
    | 'minmaxlength'
    | 'pattern'
// -------------------------------------------------------------------------------------------------
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE'

// -------------------------------------------------------------------------------------------------
/**
 * Types
 * @desc Class representing supported types
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Types {
    static typeMap: ObjectMap<new (...arg: any[]) => SandboxObject>
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
