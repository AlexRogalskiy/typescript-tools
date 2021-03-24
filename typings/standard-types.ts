/**
 * Primitive
 * @desc Type representing [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types in TypeScript: `string | number | bigint | boolean |  symbol | null | undefined`
 * @example
 *   type Various = number | string | object;
 *
 *    // Expect: object
 *   type Cleaned = Exclude<Various, Primitive>
 */
export type Primitive = Optional<string | number | bigint | boolean | symbol>

/**
 * Tests for one of the [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types using the JavaScript [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) operator
 *
 * Clarification: TypeScript overloads this operator to produce TypeScript types if used in context of types.
 *
 * @param value The value to be tested
 * @returns If `val` is primitive. If used in the flow of the program typescript will infer type-information from this.
 *
 * @example
 *   const consumer = (value: Primitive | Primitive[]) => {
 *       if (isPrimitive(value)) {
 *           return console.log('Primitive value: ', value);
 *       }
 *       // type of value now inferred as Primitive[]
 *       value.map((primitive) => consumer(primitive));
 *   };
 */
export const isPrimitive = (value: any): value is Primitive => {
    return (
        value === null ||
        value === undefined ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'bigint' ||
        typeof value === 'boolean' ||
        typeof value === 'symbol'
    )
}
// -------------------------------------------------------------------------------------------------
// type declaration
export interface Array<T> {
    forEachParallel(func: (item: T) => Promise<void>): Promise<void>

    forEachSequential(func: (item: T) => Promise<void>): Promise<void>
}

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
 * Optional
 * @desc Type representing [`Optional`] in TypeScript: `T | null | undefined`
 */
export type Optional<T> = T | null | undefined

/**
 * OptionalString
 * @desc Type representing [`OptionalString`] type in TypeScript: `string | null | undefined`
 */
export type OptionalString = Optional<string>

/**
 * OptionalPropertyKey
 * @desc Type representing [`OptionalPropertyKey`] type in TypeScript: `string | number | symbol | null | undefined`
 */
export type OptionalPropertyKey = Optional<PropertyKey>

/**
 * OptionalNumber
 * @desc Type representing [`OptionalNumber`] type in TypeScript: `number | null | undefined`
 */
export type OptionalNumber = Optional<number | bigint>

/**
 * OptionalBoolean
 * @desc Type representing [`OptionalBoolean`] type in TypeScript: `boolean | null | undefined`
 */
export type OptionalBoolean = Optional<boolean>

// -------------------------------------------------------------------------------------------------
/**
 * ExtendableError
 * @desc Type representing extendable error
 */
export default class ExtendableError extends Error {
    // empty
}
// -------------------------------------------------------------------------------------------------
/**
 * DomElement
 * @desc Type representing [`DomElement`]
 */
export type DomElement = Element | Node | Document | HTMLElement

/**
 * OptionalDomElement
 * @desc Type representing optional [`DomElement`]
 */
export type OptionalDomElement = Optional<DomElement>
// -------------------------------------------------------------------------------------------------
/**
 * Truthy
 * @desc Type representing truthy values in TypeScript: `true | 1 | 'on' | null | undefined`
 * @example
 *   type Various = 'a' | 'b' | undefined | true;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, Truthy>;
 */
export type Truthy = Optional<true | 1 | 'on'>

/**
 * Tests for Truthy value
 *
 * The value is mostly in added type-information and explicitly
 * but in case of this simple type much the same can often be archived by just using double negation `!!`:
 * @example
 *   const consumer = (value: boolean | Truthy) => {
 *     if (!!value) {
 *         return ;
 *     }
 *     type newType = typeof value; // === true
 *     // do stuff
 *   };
 */
export const isTruthy = (value: unknown): value is Truthy => !!value || value === 'on'
// -------------------------------------------------------------------------------------------------
/**
 * Falsy
 * @desc Type representing falsy values in TypeScript: `false | "" | 0 | null | undefined`
 * @example
 *   type Various = 'a' | 'b' | undefined | false;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, Falsy>;
 */
export type Falsy = Optional<false | '' | 0 | 'off'>

/**
 * Tests for Falsy by simply applying negation `!` to the tested `val`.
 *
 * The value is mostly in added type-information and explicitly,
 * but in case of this simple type much the same can often be archived by just using negation `!`:
 * @example
 *   const consumer = (value: boolean | Falsy) => {
 *     if (!value) {
 *         return ;
 *     }
 *     type newType = typeof value; // === true
 *     // do stuff
 *   };
 */
export const isFalsy = (value: unknown): value is Falsy => !value || value === 'off'
// -------------------------------------------------------------------------------------------------
/**
 * Nullish
 * @desc Type representing [nullish values][https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing] in TypeScript: `null | undefined`
 * @example
 *   type Various = 'a' | 'b' | undefined;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, Nullish>;
 */
export type Nullish = null | undefined

/**
 * Tests for Nullish by simply comparing `val` for equality with `null`.
 * @example
 *   const consumer = (param: Nullish | string): string => {
 *     if (isNullish(param)) {
 *       // typeof param === Nullish
 *       return String(param) + ' was Nullish';
 *     }
 *     // typeof param === string
 *     return param.toString();
 *   };
 */
export const isNullish = (value: unknown): value is Nullish => value === null || typeof value === 'undefined'
// -------------------------------------------------------------------------------------------------
/**
 * NullOrNotEmpty
 * @desc Type representing null or not empty property key
 */
export type NullOrNotEmpty = Optional<PropertyKey>
// -------------------------------------------------------------------------------------------------
/**
 * ObjectMap
 * @desc Type representing object key-value mappings
 */
export type ObjectMap<T> = {
    [key: string]: Optional<T>
}
// -------------------------------------------------------------------------------------------------
/**
 * StringSet
 * @desc Type representing string {@link Set}
 */
export type StringSet = Set<string>
/**
 * NumberSet
 * @desc Type representing number {@link Set}
 */
export type NumberSet = Set<number | bigint>
/**
 * PropertyKeySet
 * @desc Type representing property key {@link Set}
 */
export type PropertyKeySet = Set<PropertyKey>
/**
 * OptionalSet
 * @desc Type representing optional {@link Set}
 */
export type OptionalSet<T> = Set<Optional<T>>
// -------------------------------------------------------------------------------------------------
/**
 * StringRecord
 * @desc Type representing string {@link Record}
 */
export type StringRecord<T> = Record<string, T>

/**
 * PropertyKeyRecord
 * @desc Type representing property key {@link Record}
 */
export type PropertyKeyRecord<T> = Record<PropertyKey, T>
// -------------------------------------------------------------------------------------------------
