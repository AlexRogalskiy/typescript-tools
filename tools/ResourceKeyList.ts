export type ResourceKey<TKey> = TKey | ResourceKeyList<TKey>
export type SingleResourceKey<T> = Exclude<T, Exclude<T, ResourceKeyList<any>>> extends ResourceKeyList<
    infer TKey
>
    ? TKey
    : T

export class ResourceKeyList<TKey> {
    readonly list: TKey[]
    readonly mark: any

    constructor(list: TKey[] | TKey, mark?: any) {
        this.list = Array.isArray(list) ? list : [list]
        this.mark = mark
    }

    includes(key: ResourceKeyList<TKey> | TKey): boolean {
        if (isResourceKeyList(key)) {
            return key.list.some(key => this.list.includes(key))
        }
        return this.list.includes(key)
    }
}

interface MapFnc {
    <TKey, TValue>(key: ResourceKeyList<TKey>, selector: (key: TKey, index: number) => TValue): TValue[]

    <TKey, TValue>(
        key: ResourceKey<TKey>,
        selector: (key: TKey, index: number) => TValue,
    ): TKey extends ResourceKeyList<any> ? TValue[] : TValue
}

export interface ResourceKeyUtils {
    hasMark: <TKey>(key: ResourceKey<TKey>, mark: any) => boolean
    count: <TKey>(key: ResourceKey<TKey>) => number
    first: <TKey>(key: ResourceKey<TKey>) => TKey
    forEach: <TKey>(key: ResourceKey<TKey>, action: (key: TKey, index: number) => any) => void
    forEachAsync: <TKey>(
        key: ResourceKey<TKey>,
        action: (key: TKey, index: number) => Promise<any>,
    ) => Promise<void>
    some: <TKey>(key: ResourceKey<TKey>, predicate: (key: TKey, index: number) => boolean) => boolean
    every: <TKey>(key: ResourceKey<TKey>, predicate: (key: TKey, index: number) => boolean) => boolean
    map: MapFnc
    includes: <TKey>(first: ResourceKey<TKey>, second: ResourceKey<TKey>) => boolean
    exclude: <TKey>(first: ResourceKeyList<TKey>, second: ResourceKey<TKey>) => ResourceKey<TKey>
}

export const resourceKeyUtils: ResourceKeyUtils = {
    hasMark<TKey>(key: ResourceKey<TKey>, mark: any): boolean {
        if (isResourceKeyList(key)) {
            return key.mark === mark
        } else {
            return false
        }
    },

    count<TKey>(key: ResourceKey<TKey>): number {
        if (isResourceKeyList(key)) {
            return key.list.length
        } else {
            return 0
        }
    },

    first<TKey>(key: ResourceKey<TKey>): TKey {
        if (isResourceKeyList(key)) {
            return key.list[0]
        } else {
            return key
        }
    },

    forEach<TKey>(key: ResourceKey<TKey>, action: (key: TKey, index: number) => any | Promise<any>): void {
        if (isResourceKeyList(key)) {
            for (let i = 0; i < key.list.length; i++) {
                action(key.list[i], i)
            }
        } else {
            action(key, -1)
        }
    },

    async forEachAsync<TKey>(
        key: ResourceKey<TKey>,
        action: (key: TKey, index: number) => any | Promise<any>,
    ): Promise<void> {
        if (isResourceKeyList(key)) {
            for (let i = 0; i < key.list.length; i++) {
                await action(key.list[i], i)
            }
        } else {
            await action(key, -1)
        }
    },

    some<TKey>(key: ResourceKey<TKey>, predicate: (key: TKey, index: number) => boolean): boolean {
        if (isResourceKeyList(key)) {
            return key.list.some(predicate)
        } else {
            return predicate(key, -1)
        }
    },

    every<TKey>(key: ResourceKey<TKey>, predicate: (key: TKey, index: number) => boolean): boolean {
        if (isResourceKeyList(key)) {
            return key.list.every(predicate)
        } else {
            return predicate(key, -1)
        }
    },

    map<TKey, TValue>(
        key: ResourceKey<TKey>,
        selector: (key: TKey, index: number) => TValue,
    ): TValue | TValue[] {
        if (isResourceKeyList(key)) {
            return key.list.map(selector)
        } else {
            return selector(key, -1)
        }
    },

    includes<TKey>(param: ResourceKey<TKey>, key: ResourceKey<TKey>): boolean {
        if (isResourceKeyList(param)) {
            return param.includes(key)
        }

        if (isResourceKeyList(key)) {
            return key.includes(param)
        }

        return param === key
    },

    exclude<TKey>(param: ResourceKeyList<TKey>, key: ResourceKey<TKey>): ResourceKey<TKey> {
        if (isResourceKeyList(key)) {
            return resourceKeyList(
                param.list.filter(param => !key.list.includes(param)),
                param.mark,
            )
        }

        return resourceKeyList(
            param.list.filter(param => param !== key),
            param.mark,
        )
    },
}

export function isResourceKeyList<T>(data: any): data is ResourceKeyList<T> {
    return data instanceof ResourceKeyList
}

export function resourceKeyList<T>(list: T[], mark?: any): ResourceKeyList<T> {
    return new ResourceKeyList(list, mark)
}
