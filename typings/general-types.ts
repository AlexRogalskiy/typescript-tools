// -------------------------------------------------------------------------------------------------
/**
 * Supported buffer encoding types
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
 * Supported process configuration options
 */
export type ProcessConfig = {
    readonly env: 'dev' | 'prod' | 'test'
}
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
export type Values<T> = T[keyof T]
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
export type PropertyType<T, K extends keyof T> = T[K]
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
export type ElementType<T extends { [P in K & any]: any }, K extends keyof T | number> = T[K]
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
 * NonNull
 * @desc Excludes null and undefined from T
 * @see https://flow.org/en/docs/types/utilities/#toc-nonmaybe
 * @example
 *   type StringOrNull = string | null;
 *
 *   // Expect: string
 *   type Name = NonNull<StringOrNull>;
 */
export type NonNull<T> = NonNullable<T>
// -------------------------------------------------------------------------------------------------
/**
 * Pair
 * @desc Pair type with left and right values
 * @see https://flow.org/en/docs/types/utilities/#toc-nonmaybe
 * @example
 *   type NumberOrNull = number | null;
 *
 *   // Expect: number
 *   type Pair = Pair<NumberOrNull, NumberOrNull>;
 */
export type Pair<T, V> = { left: T; right: V }

/**
 * NumberPair
 * @desc Number pair type with left and right values
 */
export type NumberPair = Pair<number, number>

/**
 * StringPair
 * @desc String pair type with left and right values
 */
export type StringPair = Pair<string, string>

/**
 * StringRegexPair
 * @desc String regex pair type with left and right values
 */
export type StringRegexPair = Pair<string, RegExp>
// -------------------------------------------------------------------------------------------------
/**
 * NameValue
 * @desc NameValue type with name and value properties
 * @see https://flow.org/en/docs/types/utilities/#toc-nonmaybe
 * @example
 *   type NumberOrNull = number | null;
 *
 *   // Expect: number
 *   type Pair = NameValue<NumberOrNull, NumberOrNull>;
 */
export type NameValue<T, V> = { name: T; value: V }

/**
 * NumberNameValue
 * @desc Number name-value type with name and value properties
 */
export type NumberNameValue = NameValue<number, number>

/**
 * StringNameValue
 * @desc String name-value type with name and value properties
 */
export type StringNameValue = NameValue<string, string>
// -------------------------------------------------------------------------------------------------
/**
 * RangeValue
 * @desc RangeValue type with lower and upper bound properties
 * @see https://flow.org/en/docs/types/utilities/#toc-nonmaybe
 * @example
 *   type NumberOrNull = number | null;
 *
 *   // Expect: number
 *   type Pair = RangeValue<NumberOrNull, NumberOrNull>;
 */
export type RangeValue<T> = { lower: T; upper: T }
// -------------------------------------------------------------------------------------------------
export type KeywordData = [string, number]

export type KeywordDict = Record<string, KeywordData>
// -------------------------------------------------------------------------------------------------
