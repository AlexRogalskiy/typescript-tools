import { Numeric } from './general-types'

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
// -------------------------------------------------------------------------------------------------
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
/**
 * Array
 * @desc Type representing [`Array`] in TypeScript
 */
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
 * Undef
 * @desc Type representing [`Undef`] in TypeScript: `T | undefined`
 */
export type Undef<T> = T | undefined
// -------------------------------------------------------------------------------------------------
/**
 * BufferRecord
 * @desc Type representing [`BufferRecord`] in TypeScript: `Buffer | string`
 */
export type BufferRecord = Record<string, Buffer | string>

// -------------------------------------------------------------------------------------------------
/**
 * ThenArg
 * @desc Type representing [`ThenArg`] in TypeScript: PromiseLike`
 */
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

// -------------------------------------------------------------------------------------------------
/**
 * Optional
 * @desc Type representing [`Optional`] in TypeScript: `T | null | undefined`
 */
export type Optional<T> = T | Nullish

/**
 * OptionalString
 * @desc Type representing [`Optional`] string type in TypeScript: `string | null | undefined`
 */
export type OptionalString = Optional<string>

/**
 * OptionalDate
 * @desc Type representing [`Optional`] date type in TypeScript: `date | null | undefined`
 */
export type OptionalDate = Optional<Date>

/**
 * OptionalPropertyKey
 * @desc Type representing [`Optional`] property key type in TypeScript: `PropertyKey | null | undefined`
 */
export type OptionalPropertyKey = Optional<PropertyKey>

/**
 * OptionalNumber
 * @desc Type representing [`Optional`] number type in TypeScript: `number | bigint | null | undefined`
 */
export type OptionalNumber = Optional<Numeric>

/**
 * OptionalBoolean
 * @desc Type representing [`Optional`] boolean type in TypeScript: `boolean | null | undefined`
 */
export type OptionalBoolean = Optional<boolean>

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
 * @desc Type representing truthy values in TypeScript: `true | 1 | 'on' | 'y' | 't'`
 * @example
 *   type Various = 'a' | 'b' | undefined | true;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, Truthy>;
 */
export type Truthy = true | 1 | 'on' | 'y' | 't'

/**
 * Truthy
 * @desc Type representing optional truthy values in TypeScript: `true | 1 | 'on' | null | undefined`
 * @example
 *   type Various = 'a' | 'b' | undefined | true;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, OptionalTruthy>;
 */
export type OptionalTruthy = Optional<Truthy>

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
export const isTruthy = (value: unknown): value is Truthy => {
    return !!value || value === 'on' || value === 'y' || value === 't'
}
// -------------------------------------------------------------------------------------------------
/**
 * Falsy
 * @desc Type representing falsy values in TypeScript: `false | "" | 0 | 'off' | 'n' | 'f'`
 * @example
 *   type Various = 'a' | 'b' | undefined | false;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, Falsy>;
 */
export type Falsy = false | '' | 0 | 'off' | 'n' | 'f'

/**
 * Falsy
 * @desc Type representing optional falsy values in TypeScript: `false | "" | 0 | null | undefined`
 * @example
 *   type Various = 'a' | 'b' | undefined | false;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, OptionalFalsy>;
 */
export type OptionalFalsy = Optional<Falsy>

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
export const isFalsy = (value: unknown): value is Falsy => {
    return !value || value === 'off' || value === 'n' || value === 'f'
}
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
export type NumberSet = Set<Numeric>

/**
 * DateSet
 * @desc Type representing date {@link Set}
 */
export type DateSet = Set<Date>

/**
 * PropertySet
 * @desc Type representing property {@link Set}
 */
export type PropertySet = Set<PropertyKey>

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
 * PropertyRecord
 * @desc Type representing property {@link Record}
 */
export type PropertyRecord<T> = Record<PropertyKey, T>
// -------------------------------------------------------------------------------------------------
/**
 * MultiValue
 * @desc Type representing single value {@link T} or multiple values
 */
export type MultiValue<T> = T | Optional<T[]>
// -------------------------------------------------------------------------------------------------
/**
 * Label
 * @desc Type representing label
 */
export type Label = {
    label?: string
}

// -------------------------------------------------------------------------------------------------
/**
 * Styles
 * @desc Type representing styles
 */
export interface Styles {
    [ruleOrSelector: string]: string | number | Styles
}

// -------------------------------------------------------------------------------------------------
/**
 * An array or object (possibly nested) of related CSS properties
 * @see https://theme-ui.com/theme-spec#theme-scales
 */
export type Scale<T> = T[] | { [K: string]: T | Scale<T>; [I: number]: T }
// -------------------------------------------------------------------------------------------------
