import { NonNull, Optional } from './standard-types'
import { Profile } from './enum-types'
// -------------------------------------------------------------------------------------------------
/**
 * BufferEncoding
 * @desc Type representing supported buffer encoding settings
 */
export type BufferEncoding =
    | 'ascii'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'latin1'
    | 'binary'
    | 'hex'
// -------------------------------------------------------------------------------------------------
/**
 * ValueOfRecord
 * @param R
 * @desc Type representing value of a record
 */
export type ValueOfRecord<R> = R extends Record<any, infer T> ? T : never

/**
 * If `T` is a union, `T[keyof T]` (cf. `map` and `values` in `index.d.ts`) contains the types of object values that are common across the union (i.e., an intersection).
 * Because we want to include the types of all values, including those that occur in some, but not all members of the union, we first define `ValueOfUnion`.
 * @see https://stackoverflow.com/a/60085683
 */
export type ValueOfUnion<T> = T extends infer U ? U[keyof U] : never

/**
 * ObjectHavingSome
 * @param Key
 * @desc Type representing multi object
 */
export type MultiObject<Key extends PropertyKey, T> = {
    [K in Key]: { [P in K]: T }
}[Key]
// -------------------------------------------------------------------------------------------------
/**
 * Keys
 * @desc Get the union type of all the keys in an object type `T`
 * @see https://flow.org/en/docs/types/utilities/#toc-keys
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *
 *   // Expect: "name" | "age" | "visible"
 *   type PropsKeys = Keys<Props>;
 */
export type Keys<T> = keyof T
// -------------------------------------------------------------------------------------------------
/**
 * Values
 * @desc Get the union type of all the values in an object type `T`
 * @see https://flow.org/en/docs/types/utilities/#toc-values
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *
 *   // Expect: string | number | boolean
 *   type PropsValues = Values<Props>;
 */
export type Values<T> = T[Keys<T>]
// -------------------------------------------------------------------------------------------------
/**
 * KeyValuePair
 * @param K
 * @param V
 * @desc Type representing key-value pair
 */
export type KeyValuePair<K, V> = [K, V]

// -------------------------------------------------------------------------------------------------
/**
 * ProcessConfig
 * @desc Type representing supported process configurations
 */
export type ProcessConfig<T = Keys<Profile>> = {
    readonly env: T
}

export const dev: ProcessConfig<Profile.dev> = { env: Profile.dev }
export const prod: ProcessConfig<Profile.prod> = { env: Profile.prod }
export const test: ProcessConfig<Profile.test> = { env: Profile.test }

// -------------------------------------------------------------------------------------------------
/**
 * An interface for services that keep persistent data
 */
export interface Persistable {
    /**
     * A method to retrieve the data from a service that is intended for persistent storage
     * @return The data of the service that should be stored persistently, e.g. access credentials
     */
    saveAsString: () => string
    /**
     * Loads/restores data saved by {@link #saveAsString() saveAsString} into the service
     * @param savedState The persistent data that was stored
     */
    loadAsString: (savedState: string) => void
}

// -------------------------------------------------------------------------------------------------
/**
 * SearchOptions
 * @desc Type representing search options
 */
export type SearchOptions = {
    limit?: number
    suggest?: boolean
    where?: { [key: string]: string }
    field?: string | string[]
    bool?: 'and' | 'or' | 'not'
}
// -------------------------------------------------------------------------------------------------
/**
 * PropertyType
 * @desc Get the type of property of an object at a given key `K`
 * @see https://flow.org/en/docs/types/utilities/#toc-propertytype
 * @example
 *   // Expect: string;
 *   type Props = { name: string; age: number; visible: boolean };
 *   type NameType = PropertyType<Props, 'name'>;
 *
 *   // Expect: boolean
 *   type Tuple = [boolean, number];
 *   type A = PropertyType<Tuple, '0'>;
 *   // Expect: number
 *   type B = PropertyType<Tuple, '1'>;
 */
export type PropertyType<T, K extends Keys<T>> = T[K]
// -------------------------------------------------------------------------------------------------
/**
 * ElementType
 * @desc Get the type of elements inside of array, tuple or object of type `T`, that matches the given index type `K`
 * @see https://flow.org/en/docs/types/utilities/#toc-elementtype
 * @example
 *   // Expect: string;
 *   type Props = { name: string; age: number; visible: boolean };
 *   type NameType = ElementType<Props, 'name'>;
 *
 *   // Expect: boolean
 *   type Tuple = [boolean, number];
 *   type A = ElementType<Tuple, '0'>;
 *   // Expect: number
 *   type B = ElementType<Tuple, '1'>;
 *
 *   // Expect: boolean
 *   type Arr = boolean[];
 *   type ItemsType = ElementType<Arr, number>;
 *
 *   // Expect: number
 *   type Obj = { [key: string]: number };
 *   type ValuesType = ElementType<Obj, string>;
 */
export type ElementType<T extends Record<K & any, any>, K extends Keys<T> | number> = T[K]
// -------------------------------------------------------------------------------------------------
/**
 * Shape
 * @desc Copies the shape of the type supplied, but marks every field optional.
 * @see https://flow.org/en/docs/types/utilities/#toc-shape
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *
 *   // Expect: Partial<Props>
 *   type PartialProps = Shape<Props>;
 */
export type Shape<T> = Partial<T>
// -------------------------------------------------------------------------------------------------
/**
 * Call
 * @desc Get the return type from a given typeof expression
 * @see https://flow.org/en/docs/types/utilities/#toc-call
 * @example
 *   // Common use-case
 *   const add = (amount: number) => ({ type: 'ADD' as 'ADD', payload: amount });
 *   type AddAction = Call<typeof returnOfIncrement>; // { type: 'ADD'; payload: number }
 *
 *   // Examples migrated from Flow docs
 *   type ExtractPropType<T extends { prop: any }> = (arg: T) => T['prop'];
 *   type Obj = { prop: number };
 *   type PropType = Call<ExtractPropType<Obj>>; // number
 *
 *   type ExtractReturnType<T extends () => any> = (arg: T) => ReturnType<T>;
 *   type Fn = () => number;
 *   type FnReturnType = Call<ExtractReturnType<Fn>>; // number
 */
export type Call<Fn extends (...args: any[]) => any> = Fn extends (arg: any) => infer RT ? RT : never
// -------------------------------------------------------------------------------------------------
/**
 * Class
 * @desc Represents constructor of type T
 * @see https://flow.org/en/docs/types/utilities/#toc-class
 * @example
 *   class Store {}
 *   function makeStore(storeClass: Class<Store>): Store {
 *     return new storeClass();
 *   }
 */
export type Class<T> = new (...args: any[]) => T
// -------------------------------------------------------------------------------------------------
/**
 * mixed
 * @desc An arbitrary type that could be anything
 * @see https://flow.org/en/docs/types/mixed
 * @example
 *
 * function stringify(value: mixed) {
 *     // ...
 *   }
 *
 *   stringify("foo");
 *   stringify(3.14);
 *   stringify(null);
 *   stringify({});
 */
export type mixed = unknown
// -------------------------------------------------------------------------------------------------
/**
 * Numeric
 * @desc Pair2 type with numeric ("number" | "bigint") value
 */
export type Numeric = number | bigint

// -------------------------------------------------------------------------------------------------
/**
 * Pair2
 * @desc Pair2 type with first and second values
 */
export type Tuple2<T, V> = { first: T; second: V }

/**
 * Pair3
 * @desc Pair3 type with first, second and third values
 */
export type Tuple3<T, V, R> = { first: T; second: V; third: R }

/**
 * Pair4
 * @desc Pair4 type with first, second, third and fourth values
 */
export type Tuple4<T, V, R, S> = { first: T; second: V; third: R; fourth: S }

/**
 * Pair5
 * @desc Pair5 type with first, second, third, fourth and fifth values
 */
export type Tuple5<T, V, R, S, M> = { first: T; second: V; third: R; fourth: S; fifth: M }

/**
 * Pair6
 * @desc Pair6 type with first, second, third, fourth, fifth and sixth values
 */
export type Tuple6<T, V, R, S, M, N> = { first: T; second: V; third: R; fourth: S; fifth: M; sixth: N }
// -------------------------------------------------------------------------------------------------
/**
 * Pair
 * @desc Pair type with left and right values
 */
export type Pair<T, V> = { left: T; right: V }

/**
 * ReversePair
 * @desc Revers pair type with left and right values
 */
export type ReversePair<T, V> = Pair<V, T>

/**
 * OptionalPair
 * @desc Optional pair type with left and right optional values
 */
export type OptionalPair<T, V> = Pair<Optional<T>, Optional<V>>

/**
 * PartialPair
 * @desc Partial pair type with left and right partial values
 */
export type PartialPair<T, V> = Pair<Partial<T>, Partial<V>>

/**
 * RequiredPair
 * @desc Required pair type with left and right required values
 */
export type RequiredPair<T, V> = Pair<Required<T>, Required<V>>

/**
 * NonNullPair
 * @desc Non-nullable pair type with left and right non-nullable values
 */
export type NonNullPair<T, V> = Pair<NonNull<T>, NonNull<V>>

/**
 * OptionalLeft
 * @desc Optional pair type with optional left value
 */
export type OptionalLeft<T, V> = Pair<Optional<T>, V>

/**
 * OptionalRight
 * @desc Optional pair type with optional right value
 */
export type OptionalRight<T, V> = Pair<T, Optional<V>>

/**
 * PropertyKeyPair
 * @desc Property key pair type with left and right property key values
 */
export type PropertyKeyPair = Pair<PropertyKey, PropertyKey>

/**
 * NumericPair
 * @desc Numeric pair type with left and right numeric values
 */
export type NumericPair = Pair<Numeric, Numeric>

/**
 * StringPair
 * @desc String pair type with left and right string values
 */
export type StringPair = Pair<string, string>

/**
 * BooleanPair
 * @desc Boolean pair type with left and right boolean values
 */
export type BooleanPair = Pair<boolean, boolean>

/**
 * StringRegexPair
 * @desc String regex pair type with string left and regex right values
 */
export type StringRegexPair = Pair<string, RegExp>

/**
 * RegexStringPair
 * @desc Regex string pair type with regex left and string right values
 */
export type RegexStringPair = Pair<RegExp, string>
// -------------------------------------------------------------------------------------------------
/**
 * KeyValue
 * @desc KeyValue type with key and value properties
 */
export type KeyValue<T, V> = { key: T; value: V }

/**
 * OptionalKeyValue
 * @desc KeyValue type with key and optional value properties
 */
export type OptionalKeyValue<T, V> = KeyValue<T, Optional<V>>

/**
 * PartialKeyValue
 * @desc KeyValue type with key and partial value properties
 */
export type PartialKeyValue<T, V> = KeyValue<T, Partial<V>>

/**
 * RequiredKeyValue
 * @desc KeyValue type with key and required value properties
 */
export type RequiredKeyValue<T, V> = KeyValue<T, Required<V>>

/**
 * NonNullKeyValue
 * @desc KeyValue type with key and non-nullable value properties
 */
export type NonNullKeyValue<T, V> = KeyValue<T, NonNull<V>>

/**
 * PropertyKeyValue
 * @desc PropertyKeyValue type with property key and value properties
 */
export type PropertyKeyValue<V> = KeyValue<PropertyKey, V>
// -------------------------------------------------------------------------------------------------
/**
 * NameValue
 * @desc NameValue type with {@link PropertyKey} name and {@link V} value properties
 */
export type NameValue<T extends PropertyKey, V> = { name: T; value: V }

/**
 * OptionalNameValue
 * @desc Optional name-value type with {@link PropertyKey} name and {@link Optional} value properties
 */
export type OptionalNameValue<V> = NameValue<PropertyKey, Optional<V>>

/**
 * PartialValue
 * @desc NameValue type with {@link PropertyKey} name and {@link Partial} value properties
 */
export type PartialValue<V> = NameValue<PropertyKey, Partial<V>>

/**
 * RequiredValue
 * @desc NameValue type with {@link PropertyKey} name and {@link Required} value properties
 */
export type RequiredValue<V> = NameValue<PropertyKey, Required<V>>

/**
 * NonNullNameValue
 * @desc Non-nullable name-value type with {@link PropertyKey} name and {@link NonNull} value properties
 */
export type NonNullNameValue<V> = NameValue<PropertyKey, NonNull<V>>

/**
 * NumericNameValue
 * @desc Numeric name-value type with {@link PropertyKey} name and {@link numeric} value properties
 */
export type NumericNameValue = NameValue<PropertyKey, Numeric>

/**
 * StringNameValue
 * @desc String name-value type with {@link PropertyKey} name and {@link string} value properties
 */
export type StringNameValue = NameValue<PropertyKey, string>

/**
 * BooleanNameValue
 * @desc Boolean name-value type with {@link PropertyKey} name and {@link boolean} value properties
 */
export type BooleanNameValue = NameValue<PropertyKey, boolean>

/**
 * RegexNameValue
 * @desc Regex name-value type with {@link PropertyKey} name and {@link RegExp} value properties
 */
export type RegexNameValue = NameValue<PropertyKey, RegExp>
// -------------------------------------------------------------------------------------------------
/**
 * RangeValue
 * @desc RangeValue type with {@link T} lower and {@link T} upper bound properties
 */
export type Range<T> = { lower: T; upper: T }

/**
 * OptionalRange
 * @desc OptionalRange type with optional lower and upper bound properties
 */
export type OptionalRange<T> = Range<Optional<T>>

/**
 * PartialRange
 * @desc OptionalRange type with partial lower and upper bound properties
 */
export type PartialRange<T> = Range<Partial<T>>

/**
 * RequiredRange
 * @desc OptionalRange type with required lower and upper bound properties
 */
export type RequiredRange<T> = Range<Required<T>>

/**
 * NonNullRange
 * @desc OptionalRange type with non-nullable lower and upper bound properties
 */
export type NonNullRange<T> = Range<NonNull<T>>

/**
 * NumericRange
 * @desc NumericRange type with numeric lower and upper bound properties
 */
export type NumericRange = Range<Numeric>

/**
 * DateRange
 * @desc DateRange type with date lower and upper bound properties
 */
export type DateRange = Range<Date>
// -------------------------------------------------------------------------------------------------
/**
 * KeywordData
 * @desc KeywordData type with double-sized string/Numeric array values
 */
export type KeywordData<T extends PropertyKey> = [T, Numeric]

/**
 * KeywordDict
 * @desc KeywordDict record type with string keys and keyword data values
 */
export type KeywordDict<T extends PropertyKey> = Record<string, KeywordData<T>>
// -------------------------------------------------------------------------------------------------
