import { Optional } from './standard-types'

// -------------------------------------------------------------------------------------------------
export interface MapOperations<K, V> {
    clear(): void

    delete(key: K): boolean

    forEach(callbackfn: (value: V, key: K, map: MapOperations<K, V>) => void, thisArg?: any): void

    get(key: K): Optional<V>

    has(key: K): boolean

    set(key: K, value: V): this

    readonly size: number
}

export interface MapConstructor {
    new (): MapOperations<any, any>

    new <K, V>(entries?: readonly (readonly [K, V])[] | null): MapOperations<K, V>

    readonly prototype: MapOperations<any, any>
}

// -------------------------------------------------------------------------------------------------
interface ReadonlyMapOperations<K, V> {
    forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void

    get(key: K): Optional<V>

    has(key: K): boolean

    readonly size: number
}

interface ReadonlyMapConstructor {
    // eslint-disable-next-line @typescript-eslint/ban-types
    new <K extends object, V = any>(entries?: Optional<readonly [K, V][]>): ReadonlyMapOperations<K, V>

    readonly prototype: ReadonlyMapOperations<any, any>
}

// -------------------------------------------------------------------------------------------------
interface WeakMapOperations<K, V> {
    delete(key: K): boolean

    get(key: K): Optional<V>

    has(key: K): boolean

    set(key: K, value: V): this
}

interface WeakMapConstructor {
    // eslint-disable-next-line @typescript-eslint/ban-types
    new <K extends object, V = any>(entries?: Optional<readonly [K, V][]>): WeakMapOperations<K, V>

    readonly prototype: WeakMapOperations<any, any>
}

// -------------------------------------------------------------------------------------------------
interface SetOperations<T> {
    add(value: T): this

    clear(): void

    delete(value: T): boolean

    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void

    has(value: T): boolean

    readonly size: number
}

interface SetConstructor {
    new <T = any>(values?: Optional<readonly T[]>): SetOperations<T>

    readonly prototype: SetOperations<any>
}

// -------------------------------------------------------------------------------------------------
interface ReadonlySetOperations<T> {
    forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void

    has(value: T): boolean

    readonly size: number
}

interface ReadonlySetConstructor {
    new <T>(values?: Optional<readonly T[]>): ReadonlySetOperations<T>

    readonly prototype: ReadonlySetOperations<any>
}

// -------------------------------------------------------------------------------------------------
interface WeakSetOperations<T> {
    add(value: T): this

    delete(value: T): boolean

    has(value: T): boolean
}

interface WeakSetConstructor {
    new <T>(values?: Optional<readonly T[]>): WeakSetOperations<T>

    readonly prototype: WeakSetOperations<any>
}

// -------------------------------------------------------------------------------------------------
export declare const Map: MapConstructor
export declare const WeakMap: WeakMapConstructor
export declare const ReadonlyMap: ReadonlyMapConstructor
export declare const ReadonlySet: ReadonlySetConstructor
export declare const WeakSet: WeakSetConstructor
export declare const Set: SetConstructor
// -------------------------------------------------------------------------------------------------
