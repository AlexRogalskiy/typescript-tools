export type CachedResourceIncludeTemplate<TValue> =
    | `include${Capitalize<string & keyof TValue>}`
    | `customInclude${Capitalize<string>}`
export type CachedResourceIncludeFlags<TValue, TArgs> = {
    [P in keyof TArgs as P extends CachedResourceIncludeTemplate<TValue> ? P : never]?: boolean
}
export type CachedResourceIncludeList<TValue> = CachedResourceIncludeTemplate<TValue>[]
export type CachedResourceIncludeToKey<TKey> = TKey extends (
    | `include${infer T}`
    | `customInclude${Capitalize<string>}`
)[]
    ? Uncapitalize<T>
    : unknown
export type CachedResourceIncludeArgs<TValue, TArguments> = (keyof CachedResourceIncludeFlags<
    TValue,
    TArguments
>)[]

export type CachedResourceValueIncludes<TValue, TKeys> = TValue &
    {
        [P in Extract<
            CachedResourceIncludeToKey<TKeys>,
            keyof TValue
        >]-?: Required<TValue>[P] extends undefined ? TValue[P] : NonNullable<TValue[P]>
    }
