/**
 * Primitive
 * @desc Type representing [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types in TypeScript: `string | number | bigint | boolean |  symbol | null | undefined`
 * @example
 *   type Various = number | string | object;
 *
 *    // Expect: object
 *   type Cleaned = Exclude<Various, Primitive>
 */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined

/**
 * Tests for one of the [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types using the JavaScript [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) operator
 *
 * Clarification: TypeScript overloads this operator to produce TypeScript types if used in context of types.
 *
 * @param val The value to be tested
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
export const isPrimitive = (val: any): val is Primitive => {
    return (
        val === null ||
        val === undefined ||
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'bigint' ||
        typeof val === 'boolean' ||
        typeof val === 'symbol'
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
 * StringOrUndef
 * @desc Type representing [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types in TypeScript: `string | null | undefined`
 */
export type StringOrUndef = string | null | undefined

/**
 * NumberOrUndef
 * @desc Type representing [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types in TypeScript: `number | null | undefined`
 */
export type NumberOrUndef = number | bigint | null | undefined

/**
 * BooleanOrUndef
 * @desc Type representing [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types in TypeScript: `boolean | null | undefined`
 */
export type BooleanOrUndef = boolean | null | undefined

/**
 * ValueOrUndef
 * @desc Type representing [`Primitive`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types in TypeScript: `boolean | null | undefined`
 */
export type ValueOrUndef<T> = T | null | undefined
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
export type Truthy = true | 1 | 'on' | null | undefined

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
export const isTruthy = (val: unknown): val is Truthy => !!val
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
export type Falsy = false | '' | 0 | 'off' | null | undefined

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
export const isFalsy = (val: unknown): val is Falsy => !val
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
export const isNullish = (val: unknown): val is Nullish => val == null
// -------------------------------------------------------------------------------------------------
/**
 * NullOrNotEmpty
 * @desc Type representing [nullish values][https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing] in TypeScript: `null | undefined`
 * @example
 *   type Various = 'a' | 'b' | undefined;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, NullOrNotEmpty>;
 */
export type NullOrNotEmpty<T> = T | null | undefined
// -------------------------------------------------------------------------------------------------
