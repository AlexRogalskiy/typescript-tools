import { Keys } from './general-types'
// -------------------------------------------------------------------------------------------------
/**
 * And (same as Extract)
 * @desc Set intersection of given union types `A` and `B`
 * @example
 *   // Expect: "2" | "3"
 *   And<'1' | '2' | '3', '2' | '3' | '4'>;
 *
 *   // Expect: () => void
 *   And<string | number | (() => void), Function>;
 */
export type And<A, B> = A extends B ? A : never
// -------------------------------------------------------------------------------------------------
/**
 * Diff (same as Exclude)
 * @desc Set difference of given union types `A` and `B`
 * @example
 *   // Expect: "1"
 *   Diff<'1' | '2' | '3', '2' | '3' | '4'>;
 *
 *   // Expect: string | number
 *   Diff<string | number | (() => void), Function>;
 */
export type Diff<A, B> = A extends B ? never : A
// -------------------------------------------------------------------------------------------------
/**
 * Complement
 * @desc Set complement of given union types `A` and (it's subset) `A1`
 * @example
 *   // Expect: "1"
 *   Complement<'1' | '2' | '3', '2' | '3'>;
 */
export type Complement<A, A1 extends A> = Diff<A, A1>
// -------------------------------------------------------------------------------------------------
/**
 * SymDiff
 * @desc Set difference of union and intersection of given union types `A` and `B`
 * @example
 *   // Expect: "1" | "4"
 *   SymDiff<'1' | '2' | '3', '2' | '3' | '4'>;
 */
export type SymDiff<A, B> = Diff<A | B, A & B>
// -------------------------------------------------------------------------------------------------
/**
 * Undef
 * @desc Exclude undefined from set `A`
 * @example
 *   // Expect: "string | null"
 *   SymDiff<string | null | undefined>;
 */
export type Undef<A> = A extends undefined ? never : A
// -------------------------------------------------------------------------------------------------
/**
 * FunctionKeys
 * @desc Get union type of keys that are functions in object type `T`
 * @example
 *  type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};
 *
 *   // Expect: "setName | someFn"
 *   type Keys = FunctionKeys<MixedProps>;
 */
export type FunctionKeys<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in Keys<T>]-?: Undef<T[K]> extends Function ? K : never
}[Keys<T>]
// -------------------------------------------------------------------------------------------------
/**
 * NonFunctionKeys
 * @desc Get union type of keys that are non-functions in object type `T`
 * @example
 *   type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};
 *
 *   // Expect: "name | someKey"
 *   type Keys = NonFunctionKeys<MixedProps>;
 */
export type NonFunctionKeys<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in Keys<T>]-?: Undef<T[K]> extends Function ? never : K
}[Keys<T>]
// -------------------------------------------------------------------------------------------------
/**
 * RequiredKeys
 * @desc Get union type of keys that are required in object type `T`
 * @see https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; optUndef?: number | undefined; };
 *
 *   // Expect: "req" | "reqUndef"
 *   type Keys = RequiredKeys<Props>;
 */
export type RequiredKeys<T> = {
    [K in Keys<T>]-?: {} extends Pick<T, K> ? never : K
}[Keys<T>]
// -------------------------------------------------------------------------------------------------
/**
 * OptionalKeys
 * @desc Get union type of keys that are optional in object type `T`
 * @see https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; optUndef?: number | undefined; };
 *
 *   // Expect: "opt" | "optUndef"
 *   type Keys = OptionalKeys<Props>;
 */
export type OptionalKeys<T> = {
    [K in Keys<T>]-?: {} extends Pick<T, K> ? K : never
}[Keys<T>]
// -------------------------------------------------------------------------------------------------
