import { Optional } from './standard-types'

/**
 * Callback
 * @desc Type representing callback function type in TypeScript
 * @example
 *   type Callback = () => console.log("test")
 */
export type Callback = (...args: any[]) => void

/**
 * GenericCallback
 * @desc Type representing callback function type in TypeScript
 * @example
 *   type GenericCallback = () => console.log("test")
 */
export type GenericCallback<T> = (...args: T[]) => void
// -------------------------------------------------------------------------------------------------
/**
 * IteratorStep
 * @desc Type representing iterator step type in TypeScript
 * @example
 *   type IteratorStep = { value: T, done: true }
 */
export type IteratorStep<T> = { value: Optional<T>; done: boolean }

/**
 * Iterator
 * @desc Type representing iterator type in TypeScript
 * @example
 *   type Iterator = { next: () => console.log("test") }
 */
export type Iterator<T> = { next: Supplier<IteratorStep<T>> }

/**
 * OptionalIterator
 * @desc Type representing optional iterator type in TypeScript
 * @example
 *   type OptionalIterator = { next: () => console.log("test") }
 */
export type OptionalIterator<T> = Iterator<Optional<T>>

/**
 * NonNullableIterator
 * @desc Type representing non-nullable iterator type in TypeScript
 * @example
 *   type NonNullableIterator = { next: () => console.log("test") }
 */
export type NonNullableIterator<T> = Iterator<NonNullable<T>>
// -------------------------------------------------------------------------------------------------
/**
 * Executor
 * @desc Type representing executor function type in TypeScript
 * @example
 *   type Executor = () => console.log("test")
 */
export type Executor = () => void
// -------------------------------------------------------------------------------------------------
/**
 * Predicate
 * @desc Type representing predicate function type in TypeScript
 * @example
 *   type Predicate = (v) => return 1 === v
 */
export type Predicate<T> = (v: T) => boolean

/**
 * OptionalPredicate
 * @desc Type representing optional predicate function type in TypeScript
 * @example
 *   type OptionalPredicate = (v) => return 1 === v
 */
export type OptionalPredicate<T> = Predicate<Optional<T>>

/**
 * NonNullablePredicate
 * @desc Type representing non-nullable predicate function type in TypeScript
 * @example
 *   type NonNullablePredicate = (v) => return 1 === v
 */
export type NonNullablePredicate<T> = Predicate<NonNullable<T>>

/**
 * NumberPredicate
 * @desc Type representing number predicate function type in TypeScript
 * @example
 *   type NumberPredicate = (v) => return 1 === v
 */
export type NumberPredicate = Predicate<number>

/**
 * StringPredicate
 * @desc Type representing string predicate function type in TypeScript
 * @example
 *   type StringPredicate = (v) => return "1" === v
 */
export type StringPredicate = Predicate<string>

/**
 * PropertyKeyPredicate
 * @desc Type representing property key predicate function type in TypeScript
 * @example
 *   type PropertyKeyPredicate = (v) => return "1" === v
 */
export type PropertyKeyPredicate = Predicate<PropertyKey>

/**
 * BooleanPredicate
 * @desc Type representing boolean predicate function type in TypeScript
 * @example
 *   type BooleanPredicate = (v) => return true === v
 */
export type BooleanPredicate = Predicate<boolean>

/**
 * BiPredicate
 * @desc Type representing binary predicate function type in TypeScript
 * @example
 *   type BiPredicate = (v1, v2) => return v1 === v2
 */
export type BiPredicate<T, V> = (v1: T, v2: V) => boolean

/**
 * OptionalBiPredicate
 * @desc Type representing optional binary predicate function type in TypeScript
 * @example
 *   type OptionalBiPredicate = (v1, v2) => return v1 === v2
 */
export type OptionalBiPredicate<T, V> = BiPredicate<Optional<T>, Optional<V>>

/**
 * NonNullableBiPredicate
 * @desc Type representing non-nullable binary predicate function type in TypeScript
 * @example
 *   type NonNullableBiPredicate = (v1, v2) => return v1 === v2
 */
export type NonNullableBiPredicate<T, V> = BiPredicate<NonNullable<T>, NonNullable<V>>

/**
 * NumberBiPredicate
 * @desc Type representing number binary predicate function type in TypeScript
 * @example
 *   type NumberBiPredicate = (v1, v2) => return v1 === v2
 */
export type NumberBiPredicate = BiPredicate<number, number>

/**
 * StringBiPredicate
 * @desc Type representing string binary predicate function type in TypeScript
 * @example
 *   type StringBiPredicate = (v1, v2) => return v1 === v2
 */
export type StringBiPredicate = BiPredicate<string, string>

/**
 * PropertyKeyBiPredicate
 * @desc Type representing property key binary predicate function type in TypeScript
 * @example
 *   type PropertyKeyBiPredicate = (v1, v2) => return v1 === v2
 */
export type PropertyKeyBiPredicate = BiPredicate<PropertyKey, PropertyKey>

/**
 * BooleanBiPredicate
 * @desc Type representing boolean binary predicate function type in TypeScript
 * @example
 *   type BooleanBiPredicate = (v1, v2) => return v1 === v2
 */
export type BooleanBiPredicate = BiPredicate<boolean, boolean>

/**
 * TriPredicate
 * @desc Type representing ternary predicate function type in TypeScript
 * @example
 *   type TriPredicate = (v1, v2, v3) => return v1 === v2 === v3
 */
export type TriPredicate<T, V, S> = (v1: T, v2: V, v3: S) => boolean

/**
 * OptionalTriPredicate
 * @desc Type representing optional ternary predicate function type in TypeScript
 * @example
 *   type OptionalTriPredicate = (v1, v2, v3) => return v1 === v2 === v3
 */
export type OptionalTriPredicate<T, V, S> = TriPredicate<Optional<T>, Optional<V>, Optional<S>>

/**
 * NonNullableTriPredicate
 * @desc Type representing non-nullable ternary predicate function type in TypeScript
 * @example
 *   type NonNullableTriPredicate = (v1, v2, v3) => return v1 === v2 === v3
 */
export type NonNullableTriPredicate<T, V, S> = TriPredicate<NonNullable<T>, NonNullable<V>, NonNullable<S>>

/**
 * NumberTriPredicate
 * @desc Type representing number ternary predicate function type in TypeScript
 * @example
 *   type NumberTriPredicate = (v1, v2, v3) => return v1 === v2 === v3
 */
export type NumberTriPredicate = TriPredicate<number, number, number>

/**
 * StringTriPredicate
 * @desc Type representing string ternary predicate function type in TypeScript
 * @example
 *   type StringTriPredicate = (v1, v2, v3) => return v1 === v2 === v3
 */
export type StringTriPredicate = TriPredicate<string, string, string>

/**
 * PropertyKeyTriPredicate
 * @desc Type representing property key ternary predicate function type in TypeScript
 * @example
 *   type PropertyKeyTriPredicate = (v1, v2, v3) => return v1 === v2 === v3
 */
export type PropertyKeyTriPredicate = TriPredicate<PropertyKey, PropertyKey, PropertyKey>

/**
 * BooleanTriPredicate
 * @desc Type representing boolean ternary predicate function type in TypeScript
 * @example
 *   type BooleanTriPredicate = (v1, v2, v3) => return v1 === v2 === v3
 */
export type BooleanTriPredicate = TriPredicate<boolean, boolean, boolean>
// -------------------------------------------------------------------------------------------------
/**
 * Supplier
 * @desc Type representing supplier function type in TypeScript
 * @example
 *   type Supplier = () => return 1
 */
export type Supplier<T> = () => T

/**
 * OptionalSupplier
 * @desc Type representing optional supplier function type in TypeScript
 * @example
 *   type OptionalSupplier = () => return 1
 */
export type OptionalSupplier<T> = Supplier<Optional<T>>

/**
 * NonNullableSupplier
 * @desc Type representing non-nullable supplier function type in TypeScript
 * @example
 *   type NonNullableSupplier = () => return 1
 */
export type NonNullableSupplier<T> = Supplier<NonNullable<T>>

/**
 * NumberSupplier
 * @desc Type representing number supplier function type in TypeScript
 * @example
 *   type NumberSupplier = () => return 1
 */
export type NumberSupplier = Supplier<number>

/**
 * BooleanSupplier
 * @desc Type representing boolean supplier function type in TypeScript
 * @example
 *   type BooleanSupplier = () => return true
 */
export type BooleanSupplier = Supplier<boolean>

/**
 * StringSupplier
 * @desc Type representing string supplier function type in TypeScript
 * @example
 *   type StringSupplier = () => return "1"
 */
export type StringSupplier = Supplier<string>

/**
 * PropertyKeySupplier
 * @desc Type representing property key supplier function type in TypeScript
 * @example
 *   type PropertyKeySupplier = () => return "1"
 */
export type PropertyKeySupplier = Supplier<PropertyKey>

/**
 * BiSupplier
 * @desc Type representing binary supplier function type in TypeScript
 * @example
 *   type BiSupplier = () => return {"v1": "first", "v2": "second"}
 */
export type BiSupplier<T, V> = () => { v1: T; v2: V }

/**
 * OptionalBiSupplier
 * @desc Type representing optional binary supplier function type in TypeScript
 * @example
 *   type OptionalBiSupplier = () => return {"v1": "first", "v2": "second"}
 */
export type OptionalBiSupplier<T, V> = BiSupplier<Optional<T>, Optional<V>>

/**
 * NonNullableBiSupplier
 * @desc Type representing non-nullable binary supplier function type in TypeScript
 * @example
 *   type NonNullableBiSupplier = () => return {"v1": "first", "v2": "second"}
 */
export type NonNullableBiSupplier<T, V> = BiSupplier<NonNullable<T>, NonNullable<V>>

/**
 * NumberBiSupplier
 * @desc Type representing number binary supplier function type in TypeScript
 * @example
 *   type NumberBiSupplier = () => return {"v1": "first", "v2": "second"}
 */
export type NumberBiSupplier = BiSupplier<number, number>

/**
 * StringBiSupplier
 * @desc Type representing string binary supplier function type in TypeScript
 * @example
 *   type StringBiSupplier = () => return {"v1": "first", "v2": "second"}
 */
export type StringBiSupplier = BiSupplier<string, string>

/**
 * PropertyKeyBiSupplier
 * @desc Type representing property key binary supplier function type in TypeScript
 * @example
 *   type PropertyKeyBiSupplier = () => return {"v1": "first", "v2": "second"}
 */
export type PropertyKeyBiSupplier = BiSupplier<PropertyKey, PropertyKey>

/**
 * BooleanBiSupplier
 * @desc Type representing boolean binary supplier function type in TypeScript
 * @example
 *   type BooleanBiSupplier = () => return {"v1": true, "v2": false}
 */
export type BooleanBiSupplier = BiSupplier<boolean, boolean>

/**
 * TriSupplier
 * @desc Type representing ternary supplier function type in TypeScript
 * @example
 *   type TriSupplier = () => return {"v1": "first", "v2": "second", "v3": "third"}
 */
export type TriSupplier<T, V, S> = () => { v1: T; v2: V; v3: S }

/**
 * OptionalTriSupplier
 * @desc Type representing optional ternary supplier function type in TypeScript
 * @example
 *   type OptionalTriSupplier = () => return {"v1": "first", "v2": "second", "v3": "third"}
 */
export type OptionalTriSupplier<T, V, S> = TriSupplier<Optional<T>, Optional<V>, Optional<S>>

/**
 * NonNullableTriSupplier
 * @desc Type representing non-nullable ternary supplier function type in TypeScript
 * @example
 *   type NonNullableTriSupplier = () => return {"v1": "first", "v2": "second", "v3": "third"}
 */
export type NonNullableTriSupplier<T, V, S> = TriSupplier<NonNullable<T>, NonNullable<V>, NonNullable<S>>

/**
 * NumberTriSupplier
 * @desc Type representing number ternary supplier function type in TypeScript
 * @example
 *   type NumberTriSupplier = () => return {"v1": "first", "v2": "second", "v3": "third"}
 */
export type NumberTriSupplier = TriSupplier<number, number, number>

/**
 * StringTriSupplier
 * @desc Type representing string ternary supplier function type in TypeScript
 * @example
 *   type StringTriSupplier = () => return {"v1": "first", "v2": "second", "v3": "third"}
 */
export type StringTriSupplier = TriSupplier<string, string, string>

/**
 * PropertyKeyTriSupplier
 * @desc Type representing property key ternary supplier function type in TypeScript
 * @example
 *   type PropertyKeyTriSupplier = () => return {"v1": "first", "v2": "second", "v3": "third"}
 */
export type PropertyKeyTriSupplier = TriSupplier<PropertyKey, PropertyKey, PropertyKey>

/**
 * BooleanTriSupplier
 * @desc Type representing boolean ternary supplier function type in TypeScript
 * @example
 *   type BooleanTriSupplier = () => return {"v1": true, "v2": false, "v3": true}
 */
export type BooleanTriSupplier = TriSupplier<boolean, boolean, boolean>
// -------------------------------------------------------------------------------------------------
/**
 * Consumer
 * @desc Type representing consumer function type in TypeScript
 * @example
 *   type Consumer = (v) => console.log(v)
 */
export type Consumer<T> = (v: T) => void

/**
 * OptionalConsumer
 * @desc Type representing optional consumer function type in TypeScript
 * @example
 *   type OptionalConsumer = (v) => console.log(v)
 */
export type OptionalConsumer<T> = Consumer<Optional<T>>

/**
 * NonNullableConsumer
 * @desc Type representing non-nullable consumer function type in TypeScript
 * @example
 *   type NonNullableConsumer = (v) => console.log(v)
 */
export type NonNullableConsumer<T> = Consumer<NonNullable<T>>

/**
 * NumberConsumer
 * @desc Type representing number consumer function type in TypeScript
 * @example
 *   type NumberConsumer = (v) => console.log(v)
 */
export type NumberConsumer = Consumer<number>

/**
 * StringConsumer
 * @desc Type representing string consumer function type in TypeScript
 * @example
 *   type StringConsumer = (v) => console.log(v)
 */
export type StringConsumer = Consumer<string>

/**
 * PropertyKeyConsumer
 * @desc Type representing property key consumer function type in TypeScript
 * @example
 *   type PropertyKeyConsumer = (v) => console.log(v)
 */
export type PropertyKeyConsumer = Consumer<PropertyKey>

/**
 * BooleanConsumer
 * @desc Type representing boolean consumer function type in TypeScript
 * @example
 *   type BooleanConsumer = (v) => console.log(v)
 */
export type BooleanConsumer = Consumer<boolean>

/**
 * BiConsumer
 * @desc Type representing binary consumer function type in TypeScript
 * @example
 *   type BiConsumer = (v1, v2) => console.log(v1 + ":" + v2)
 */
export type BiConsumer<T, V> = (v1: T, v2: V) => void

/**
 * OptionalBiConsumer
 * @desc Type representing optional binary consumer function type in TypeScript
 * @example
 *   type OptionalBiConsumer = (v1, v2) => console.log(v1 + ":" + v2)
 */
export type OptionalBiConsumer<T, V> = BiConsumer<Optional<T>, Optional<V>>

/**
 * NonNullableBiConsumer
 * @desc Type representing non-nullable binary consumer function type in TypeScript
 * @example
 *   type NonNullableBiConsumer = (v1, v2) => console.log(v1 + ":" + v2)
 */
export type NonNullableBiConsumer<T, V> = BiConsumer<NonNullable<T>, NonNullable<V>>

/**
 * NumberBiConsumer
 * @desc Type representing number binary consumer function type in TypeScript
 * @example
 *   type NumberBiConsumer = (v1, v2) => console.log(v1 + ":" + v2)
 */
export type NumberBiConsumer = BiConsumer<number, number>

/**
 * StringBiConsumer
 * @desc Type representing string binary consumer function type in TypeScript
 * @example
 *   type StringBiConsumer = (v1, v2) => console.log(v1 + ":" + v2)
 */
export type StringBiConsumer = BiConsumer<string, string>

/**
 * PropertyKeyBiConsumer
 * @desc Type representing property key binary consumer function type in TypeScript
 * @example
 *   type PropertyKeyBiConsumer = (v1, v2) => console.log(v1 + ":" + v2)
 */
export type PropertyKeyBiConsumer = BiConsumer<PropertyKey, PropertyKey>

/**
 * BooleanBiConsumer
 * @desc Type representing boolean binary consumer function type in TypeScript
 * @example
 *   type BooleanBiConsumer = (v1, v2) => console.log(v1 + ":" + v2)
 */
export type BooleanBiConsumer = BiConsumer<boolean, boolean>

/**
 * TriConsumer
 * @desc Type representing ternary consumer function type in TypeScript
 * @example
 *   type TriConsumer = (v1, v2, v3) => console.log(v1 + ":" + v2 + ":" + v3)
 */
export type TriConsumer<T, V, S> = (v1: T, v2: V, v3: S) => void

/**
 * OptionalTriConsumer
 * @desc Type representing optional ternary consumer function type in TypeScript
 * @example
 *   type OptionalTriConsumer = (v1, v2, v3) => console.log(v1 + ":" + v2 + ":" + v3)
 */
export type OptionalTriConsumer<T, V, S> = TriConsumer<Optional<T>, Optional<V>, Optional<S>>

/**
 * NonNullableTriConsumer
 * @desc Type representing optional ternary consumer function type in TypeScript
 * @example
 *   type NonNullableTriConsumer = (v1, v2, v3) => console.log(v1 + ":" + v2 + ":" + v3)
 */
export type NonNullableTriConsumer<T, V, S> = TriConsumer<NonNullable<T>, NonNullable<V>, NonNullable<S>>

/**
 * NumberTriConsumer
 * @desc Type representing number ternary consumer function type in TypeScript
 * @example
 *   type NumberTriConsumer = (v1, v2, v3) => console.log(v1 + ":" + v2 + ":" + v3)
 */
export type NumberTriConsumer = TriConsumer<number, number, number>

/**
 * StringTriConsumer
 * @desc Type representing string ternary consumer function type in TypeScript
 * @example
 *   type StringTriConsumer = (v1, v2, v3) => console.log(v1 + ":" + v2 + ":" + v3)
 */
export type StringTriConsumer = TriConsumer<string, string, string>

/**
 * PropertyKeyTriConsumer
 * @desc Type representing property key ternary consumer function type in TypeScript
 * @example
 *   type PropertyKeyTriConsumer = (v1, v2, v3) => console.log(v1 + ":" + v2 + ":" + v3)
 */
export type PropertyKeyTriConsumer = TriConsumer<PropertyKey, PropertyKey, PropertyKey>

/**
 * BooleanTriConsumer
 * @desc Type representing boolean ternary consumer function type in TypeScript
 * @example
 *   type BooleanTriConsumer = (v1, v2, v3) => console.log(v1 + ":" + v2 + ":" + v3)
 */
export type BooleanTriConsumer = TriConsumer<boolean, boolean, boolean>
// -------------------------------------------------------------------------------------------------
/**
 * Processor
 * @desc Type representing processor function type in TypeScript
 * @example
 *   type Processor = (v) => return new String(v)
 */
export type Processor<T, V> = (v: T) => V

/**
 * ReverseProcessor
 * @desc Type representing reversed processor function type in TypeScript
 * @example
 *   type ReverseProcessor = (v) => return new String(v)
 */
export type ReverseProcessor<T, V> = Processor<V, T>

/**
 * OptionalProcessor
 * @desc Type representing optional processor function type in TypeScript
 * @example
 *   type OptionalProcessor = (v) => return new String(v)
 */
export type OptionalProcessor<T, R> = Processor<Optional<T>, R>

/**
 * NonNullableProcessor
 * @desc Type representing non-nullable processor function type in TypeScript
 * @example
 *   type NonNullableProcessor = (v) => return new String(v)
 */
export type NonNullableProcessor<T, R> = Processor<NonNullable<T>, R>

/**
 * NumberProcessor
 * @desc Type representing number processor function type in TypeScript
 * @example
 *   type NumberProcessor = (v) => return new String(v)
 */
export type NumberProcessor<R> = Processor<number, R>

/**
 * StringProcessor
 * @desc Type representing string processor function type in TypeScript
 * @example
 *   type StringProcessor = (v) => return new String(v)
 */
export type StringProcessor<R> = Processor<string, R>

/**
 * PropertyKeyProcessor
 * @desc Type representing property key processor function type in TypeScript
 * @example
 *   type PropertyKeyProcessor = (v) => return new String(v)
 */
export type PropertyKeyProcessor<R> = Processor<PropertyKey, R>

/**
 * BooleanProcessor
 * @desc Type representing boolean processor function type in TypeScript
 * @example
 *   type BooleanProcessor = (v) => return v ? "1" : "2"
 */
export type BooleanProcessor<R> = Processor<boolean, R>

/**
 * NumberToStringProcessor
 * @desc Type representing number to string processor function type in TypeScript
 * @example
 *   type NumberToStringProcessor = (v) => return new String(v)
 */
export type NumberToStringProcessor = Processor<number, string>

/**
 * StringToNumberProcessor
 * @desc Type representing string to number processor function type in TypeScript
 * @example
 *   type StringToNumberProcessor = (v) => return parseInt(v)
 */
export type StringToNumberProcessor = Processor<string, number>

/**
 * PropertyKeyToNumberProcessor
 * @desc Type representing property key to number processor function type in TypeScript
 * @example
 *   type PropertyKeyToNumberProcessor = (v) => return parseInt(v)
 */
export type PropertyKeyToNumberProcessor = Processor<PropertyKey, number>

/**
 * BooleanToStringProcessor
 * @desc Type representing boolean to string processor function type in TypeScript
 * @example
 *   type BooleanToStringProcessor = (v) => return new String(v)
 */
export type BooleanToStringProcessor = Processor<boolean, string>

/**
 * StringToBooleanProcessor
 * @desc Type representing string to boolean processor function type in TypeScript
 * @example
 *   type StringToBooleanProcessor = (v) => return v == true
 */
export type StringToBooleanProcessor = Processor<string, boolean>

/**
 * PropertyKeyToBooleanProcessor
 * @desc Type representing string to boolean processor function type in TypeScript
 * @example
 *   type PropertyKeyToBooleanProcessor = (v) => return v == true
 */
export type PropertyKeyToBooleanProcessor = Processor<PropertyKey, boolean>

/**
 * ToOptionalProcessor
 * @desc Type representing processor function type with optional result in TypeScript
 * @example
 *   type ToOptionalProcessor = (v) => return v.length
 */
export type ToOptionalProcessor<T, V> = Processor<T, Optional<V>>

/**
 * ToNonNullableProcessor
 * @desc Type representing processor function type with non-nullable result in TypeScript
 * @example
 *   type ToNonNullableProcessor = (v) => return v.length
 */
export type ToNonNullableProcessor<T, V> = Processor<T, NonNullable<V>>

/**
 * ToNumberProcessor
 * @desc Type representing processor function type with number result in TypeScript
 * @example
 *   type ToNumberProcessor = (v) => return v.length
 */
export type ToNumberProcessor<T> = Processor<T, number>

/**
 * ToStringProcessor
 * @desc Type representing processor function type with string result in TypeScript
 * @example
 *   type ToStringProcessor = (v) => return new String(v)
 */
export type ToStringProcessor<T> = Processor<T, string>

/**
 * ToPropertyKeyProcessor
 * @desc Type representing processor function type with string result in TypeScript
 * @example
 *   type ToPropertyKeyProcessor = (v) => return new String(v)
 */
export type ToPropertyKeyProcessor<T> = Processor<T, PropertyKey>

/**
 * ToBooleanProcessor
 * @desc Type representing processor function type with boolean result in TypeScript
 * @example
 *   type ToBooleanProcessor = (v) => return v1 === true
 */
export type ToBooleanProcessor<T> = Processor<T, boolean>
// -------------------------------------------------------------------------------------------------
/**
 * BiProcessor
 * @desc Type representing binary processor function type in TypeScript
 * @example
 *   type Processor = (v1, v2) => return new String(v1 + v2)
 */
export type BiProcessor<T, V, R> = (v1: T, v2: V) => R

/**
 * OptionalBiProcessor
 * @desc Type representing optional binary processor function type in TypeScript
 * @example
 *   type OptionalBiProcessor = (v1, v2) => return v1 + v2
 */
export type OptionalBiProcessor<T, V, R> = BiProcessor<Optional<T>, Optional<V>, R>

/**
 * NonNullableBiProcessor
 * @desc Type representing non-nullable binary processor function type in TypeScript
 * @example
 *   type NonNullableBiProcessor = (v1, v2) => return v1 + v2
 */
export type NonNullableBiProcessor<T, V, R> = BiProcessor<NonNullable<T>, NonNullable<V>, R>

/**
 * NumberBiProcessor
 * @desc Type representing number binary processor function type in TypeScript
 * @example
 *   type NumberBiProcessor = (v1, v2) => return v1 + v2
 */
export type NumberBiProcessor<R> = BiProcessor<number, number, R>

/**
 * StringBiProcessor
 * @desc Type representing string binary processor function type in TypeScript
 * @example
 *   type StringBiProcessor = (v1, v2) => return v1 + v2
 */
export type StringBiProcessor<R> = BiProcessor<string, string, R>

/**
 * PropertyKeyBiProcessor
 * @desc Type representing property key binary processor function type in TypeScript
 * @example
 *   type PropertyKeyBiProcessor = (v1, v2) => return v1 + v2
 */
export type PropertyKeyBiProcessor<R> = BiProcessor<PropertyKey, PropertyKey, R>

/**
 * BooleanBiProcessor
 * @desc Type representing boolean binary processor function type in TypeScript
 * @example
 *   type BooleanBiProcessor = (v1, v2) => return v1 + v2
 */
export type BooleanBiProcessor<R> = BiProcessor<boolean, boolean, R>

/**
 * ToOptionalBiProcessor
 * @desc Type representing binary processor function type with optional result in TypeScript
 * @example
 *   type ToOptionalBiProcessor = (v1, v2) => return v1.length + v2.length
 */
export type ToOptionalBiProcessor<T, V, R> = BiProcessor<T, V, Optional<R>>

/**
 * ToNonNullableBiProcessor
 * @desc Type representing binary processor function type with non-nullable result in TypeScript
 * @example
 *   type ToNonNullableBiProcessor = (v1, v2) => return v1.length + v2.length
 */
export type ToNonNullableBiProcessor<T, V, R> = BiProcessor<T, V, NonNullable<R>>

/**
 * ToNumberBiProcessor
 * @desc Type representing binary processor function type with number result in TypeScript
 * @example
 *   type ToNumberBiProcessor = (v1, v2) => return v1.length + v2.length
 */
export type ToNumberBiProcessor<T, V> = BiProcessor<T, V, number>

/**
 * ToStringBiProcessor
 * @desc Type representing binary processor function type with string result in TypeScript
 * @example
 *   type ToStringBiProcessor = (v1, v2) => return new String(v1 + v2)
 */
export type ToStringBiProcessor<T, V> = BiProcessor<T, V, string>

/**
 * ToPropertyKeyBiProcessor
 * @desc Type representing binary processor function type with property key result in TypeScript
 * @example
 *   type ToPropertyKeyBiProcessor = (v1, v2) => return new String(v1 + v2)
 */
export type ToPropertyKeyBiProcessor<T, V> = BiProcessor<T, V, PropertyKey>

/**
 * ToBooleanBiProcessor
 * @desc Type representing binary processor function type with boolean result in TypeScript
 * @example
 *   type ToBooleanBiProcessor = (v1, v2) => return v1 === v2
 */
export type ToBooleanBiProcessor<T, V> = BiProcessor<T, V, boolean>
// -------------------------------------------------------------------------------------------------
/**
 * TriProcessor
 * @desc Type representing ternary processor function type in TypeScript
 * @example
 *   type TriProcessor = (v1, v2, v3) => return new String(v1 + v2 + v3)
 */
export type TriProcessor<T, V, S, R> = (v1: T, v2: V, v3: S) => R

/**
 * OptionalTriProcessor
 * @desc Type representing optional ternary processor function type in TypeScript
 * @example
 *   type OptionalTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type OptionalTriProcessor<T, V, S, R> = TriProcessor<Optional<T>, Optional<V>, Optional<S>, R>

/**
 * NonNullableTriProcessor
 * @desc Type representing non-nullable ternary processor function type in TypeScript
 * @example
 *   type NonNullableTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type NonNullableTriProcessor<T, V, S, R> = TriProcessor<
    NonNullable<T>,
    NonNullable<V>,
    NonNullable<S>,
    R
>

/**
 * NumberTriProcessor
 * @desc Type representing number ternary processor function type in TypeScript
 * @example
 *   type NumberTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type NumberTriProcessor<R> = TriProcessor<number, number, number, R>

/**
 * StringTriProcessor
 * @desc Type representing string ternary processor function type in TypeScript
 * @example
 *   type StringTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type StringTriProcessor<R> = TriProcessor<string, string, string, R>

/**
 * PropertyKeyTriProcessor
 * @desc Type representing property key ternary processor function type in TypeScript
 * @example
 *   type PropertyKeyTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type PropertyKeyTriProcessor<R> = TriProcessor<PropertyKey, PropertyKey, PropertyKey, R>

/**
 * BooleanTriProcessor
 * @desc Type representing boolean ternary processor function type in TypeScript
 * @example
 *   type BooleanTriProcessor = (v1, v2, v3) => return v1 & v2 & v3
 */
export type BooleanTriProcessor<R> = TriProcessor<boolean, boolean, boolean, R>

/**
 * ToOptionalTriProcessor
 * @desc Type representing ternary processor function type with optional result in TypeScript
 * @example
 *   type ToOptionalTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type ToOptionalTriProcessor<T, V, S, R> = (v1: T, v2: V, v3: S) => Optional<R>

/**
 * ToNonNullableTriProcessor
 * @desc Type representing ternary processor function type with non-nullable result in TypeScript
 * @example
 *   type ToNonNullableTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type ToNonNullableTriProcessor<T, V, S, R> = (v1: T, v2: V, v3: S) => NonNullable<R>

/**
 * ToNumberTriProcessor
 * @desc Type representing ternary processor function type with number result in TypeScript
 * @example
 *   type ToNumberTriProcessor = (v1, v2, v3) => return v1 + v2 + v3
 */
export type ToNumberTriProcessor<T, V, S> = (v1: T, v2: V, v3: S) => number

/**
 * ToStringTriProcessor
 * @desc Type representing string ternary processor function type with string result in TypeScript
 * @example
 *   type ToStringTriProcessor = (v1, v2, v3) => return new String(v1 + v2 + v3)
 */
export type ToStringTriProcessor<T, V, S> = (v1: T, v2: V, v3: S) => string

/**
 * ToPropertyKeyTriProcessor
 * @desc Type representing property key ternary processor function type with property key result in TypeScript
 * @example
 *   type ToPropertyKeyTriProcessor = (v1, v2, v3) => return new String(v1 + v2 + v3)
 */
export type ToPropertyKeyTriProcessor<T, V, S> = (v1: T, v2: V, v3: S) => PropertyKey

/**
 * ToBooleanTriProcessor
 * @desc Type representing ternary processor function type with boolean result in TypeScript
 * @example
 *   type ToBooleanTriProcessor = (v1, v2, v3) => return v1 === v2 === v3
 */
export type ToBooleanTriProcessor<T, V, S> = (v1: T, v2: V, v3: S) => boolean
// -------------------------------------------------------------------------------------------------
/**
 * UnaryOperator
 * @desc Type representing unary operator type in TypeScript
 * @example
 *   type UnaryOperator = (v) => return v
 */
export type UnaryOperator<T> = (v: T) => T

/**
 * OptionalUnaryOperator
 * @desc Type representing number unary operator type in TypeScript
 * @example
 *   type OptionalUnaryOperator = (v) => return v
 */
export type OptionalUnaryOperator<T> = UnaryOperator<Optional<T>>

/**
 * NonNullableUnaryOperator
 * @desc Type representing number unary operator type in TypeScript
 * @example
 *   type NonNullableUnaryOperator = (v) => return v
 */
export type NonNullableUnaryOperator<T> = UnaryOperator<NonNullable<T>>

/**
 * NumberUnaryOperator
 * @desc Type representing number unary operator type in TypeScript
 * @example
 *   type NumberUnaryOperator = (v) => return v
 */
export type NumberUnaryOperator = UnaryOperator<number>

/**
 * StringUnaryOperator
 * @desc Type representing string unary operator type in TypeScript
 * @example
 *   type StringUnaryOperator = (v) => return v
 */
export type StringUnaryOperator = UnaryOperator<string>

/**
 * PropertyKeyUnaryOperator
 * @desc Type representing property key unary operator type in TypeScript
 * @example
 *   type PropertyKeyUnaryOperator = (v) => return v
 */
export type PropertyKeyUnaryOperator = UnaryOperator<PropertyKey>

/**
 * BooleanUnaryOperator
 * @desc Type representing boolean unary operator type in TypeScript
 * @example
 *   type BooleanUnaryOperator = (v) => return v
 */
export type BooleanUnaryOperator = UnaryOperator<boolean>

/**
 * BinaryOperator
 * @desc Type representing binary operator type in TypeScript
 * @example
 *   type BinaryOperator = (v1, v2) => return v1 + v2
 */
export type BinaryOperator<T> = (v1: T, v2: T) => T

/**
 * OptionalBinaryOperator
 * @desc Type representing optional binary operator type in TypeScript
 * @example
 *   type OptionalBinaryOperator = (v1, v2) => return v1 + v2
 */
export type OptionalBinaryOperator<T> = BinaryOperator<Optional<T>>

/**
 * NonNullableBinaryOperator
 * @desc Type representing non-nullable binary operator type in TypeScript
 * @example
 *   type NonNullableBinaryOperator = (v1, v2) => return v1 + v2
 */
export type NonNullableBinaryOperator<T> = BinaryOperator<NonNullable<T>>

/**
 * NumberBinaryOperator
 * @desc Type representing number binary operator type in TypeScript
 * @example
 *   type NumberBinaryOperator = (v1, v2) => return v1 + v2
 */
export type NumberBinaryOperator = BinaryOperator<number>

/**
 * StringBinaryOperator
 * @desc Type representing string binary operator type in TypeScript
 * @example
 *   type StringBinaryOperator = (v1, v2) => return v1 + v2
 */
export type StringBinaryOperator = BinaryOperator<string>

/**
 * PropertyKeyBinaryOperator
 * @desc Type representing property key binary operator type in TypeScript
 * @example
 *   type PropertyKeyBinaryOperator = (v1, v2) => return v1 + v2
 */
export type PropertyKeyBinaryOperator = BinaryOperator<PropertyKey>

/**
 * BooleanBinaryOperator
 * @desc Type representing boolean binary operator type in TypeScript
 * @example
 *   type BooleanBinaryOperator = (v1, v2) => return v1 & v2
 */
export type BooleanBinaryOperator = BinaryOperator<boolean>

/**
 * TernaryOperator
 * @desc Type representing ternary operator type in TypeScript
 * @example
 *   type TernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type TernaryOperator<T> = (v1: T, v2: T, v3: T) => T

/**
 * OptionalTernaryOperator
 * @desc Type representing optional ternary operator type in TypeScript
 * @example
 *   type OptionalTernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type OptionalTernaryOperator<T> = TernaryOperator<Optional<T>>

/**
 * NonNullableTernaryOperator
 * @desc Type representing non-nullable ternary operator type in TypeScript
 * @example
 *   type NonNullableTernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type NonNullableTernaryOperator<T> = TernaryOperator<NonNullable<T>>

/**
 * NumberTernaryOperator
 * @desc Type representing number ternary operator type in TypeScript
 * @example
 *   type NumberTernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type NumberTernaryOperator = TernaryOperator<number>

/**
 * StringTernaryOperator
 * @desc Type representing string ternary operator type in TypeScript
 * @example
 *   type StringTernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type StringTernaryOperator = TernaryOperator<string>

/**
 * PropertyKeyTernaryOperator
 * @desc Type representing property key ternary operator type in TypeScript
 * @example
 *   type PropertyKeyTernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type PropertyKeyTernaryOperator = TernaryOperator<PropertyKey>

/**
 * BooleanTernaryOperator
 * @desc Type representing boolean ternary operator type in TypeScript
 * @example
 *   type BooleanTernaryOperator = (v1, v2, v3) => return v1 & v2 & v3
 */
export type BooleanTernaryOperator = TernaryOperator<boolean>
// -------------------------------------------------------------------------------------------------
/**
 * Filter
 * @desc Type representing filter function type in TypeScript
 * @example
 *   type Filter = (v1 => true) => return [v1, v1]
 */
export type Filter<T> = (filter: Predicate<T>) => T[]

/**
 * OptionalFilter
 * @desc Type representing optional filter function type in TypeScript
 * @example
 *   type OptionalFilter = (v1 => true) => return [v1, v1]
 */
export type OptionalFilter<T> = Filter<Optional<T>>

/**
 * NonNullableFilter
 * @desc Type representing non-nullable filter function type in TypeScript
 * @example
 *   type NonNullableFilter = (v1 => true) => return [v1, v1]
 */
export type NonNullableFilter<T> = Filter<NonNullable<T>>

/**
 * NumberFilter
 * @desc Type representing number filter function type in TypeScript
 * @example
 *   type NumberFilter = (v1 => true) => return [v1, v1]
 */
export type NumberFilter = Filter<number>

/**
 * StringFilter
 * @desc Type representing string filter function type in TypeScript
 * @example
 *   type StringFilter = (v1 => true) => return [v1, v1]
 */
export type StringFilter = Filter<string>

/**
 * PropertyKeyFilter
 * @desc Type representing property key filter function type in TypeScript
 * @example
 *   type PropertyKeyFilter = (v1 => true) => return [v1, v1]
 */
export type PropertyKeyFilter = Filter<PropertyKey>

/**
 * BooleanFilter
 * @desc Type representing boolean filter function type in TypeScript
 * @example
 *   type BooleanFilter = (v1 => true) => return [v1, v1]
 */
export type BooleanFilter = Filter<boolean>
// -------------------------------------------------------------------------------------------------
/**
 * ArrayGetter
 * @desc Type representing array getter function type in TypeScript
 * @example
 *   type ArrayGetter = (v1) => v1[0]
 */
export type ArrayGetter<T> = Processor<T[], T>

/**
 * ArraySetter
 * @desc Type representing array setter function type in TypeScript
 * @example
 *   type ArraySetter = (v1, v) => v1[0] = v
 */
export type ArraySetter<T> = BiConsumer<T[], T>

/**
 * NumberArrayGetter
 * @desc Type representing array getter function type in TypeScript
 * @example
 *   type NumberArrayGetter = (num) => (v1) => return v1[num]
 */
export type NumberArrayGetter<T> = Processor<number, ArrayGetter<T>>

/**
 * NumberArraySetter
 * @desc Type representing array setter function type in TypeScript
 * @example
 *   type NumberArraySetter = (num) => (v1, v) => v1[num] = v
 */
export type NumberArraySetter<T> = Processor<number, ArraySetter<T>>
// -------------------------------------------------------------------------------------------------
/**
 * Comparator modes
 */
export type ComparatorMode = 'asc' | 'desc'

/**
 * Comparator
 * @desc Type representing comparator function type in TypeScript
 * @example
 *   type Comparator = (v1, v2) => return 0
 */
export type Comparator<T> = BiProcessor<T, T, number>

/**
 * PropertyComparator
 * @desc Type representing property comparator function type in TypeScript
 * @example
 *   type PropertyComparator = (v1, v2, 'propKey') => return 0
 */
export type PropertyComparator<T> = TriProcessor<T, T, PropertyKey, number>

/**
 * OptionalComparator
 * @desc Type representing optional comparator function type in TypeScript
 * @example
 *   type OptionalComparator = (v1, v2) => return 0
 */
export type OptionalComparator<T> = Comparator<Optional<T>>

/**
 * NonNullableComparator
 * @desc Type representing non-nullable comparator function type in TypeScript
 * @example
 *   type NonNullableComparator = (v1, v2) => return 0
 */
export type NonNullableComparator<T> = Comparator<NonNullable<T>>

/**
 * OptionalPropertyComparator
 * @desc Type representing optional property key comparator function type in TypeScript
 * @example
 *   type OptionalPropertyComparator = (v1, v2, 'propKey') => return 0
 */
export type OptionalPropertyComparator<T> = PropertyComparator<Optional<T>>

/**
 * NonNullablePropertyComparator
 * @desc Type representing non-nullable property key comparator function type in TypeScript
 * @example
 *   type NonNullablePropertyComparator = (v1, v2, 'propKey') => return 0
 */
export type NonNullablePropertyComparator<T> = PropertyComparator<NonNullable<T>>

/**
 * NumberComparator
 * @desc Type representing number comparator function type in TypeScript
 * @example
 *   type NumberComparator = (v1, v2) => return 0
 */
export type NumberComparator = Comparator<number>

/**
 * StringComparator
 * @desc Type representing string comparator function type in TypeScript
 * @example
 *   type StringComparator = (v1, v2) => return 0
 */
export type StringComparator = Comparator<string>

/**
 * PropertyKeyComparator
 * @desc Type representing property key comparator function type in TypeScript
 * @example
 *   type PropertyKeyComparator = (v1, v2) => return 0
 */
export type PropertyKeyComparator = Comparator<PropertyKey>

/**
 * BooleanComparator
 * @desc Type representing boolean comparator function type in TypeScript
 * @example
 *   type BooleanComparator = (v1, v2) => return 0
 */
export type BooleanComparator = Comparator<boolean>
// -------------------------------------------------------------------------------------------------
/**
 * Wrapper
 * @desc Type representing wrapper function type in TypeScript
 * @example
 *   type Wrapper = (v1, v2) => return 0
 */
export type Wrapper<T> = () => Supplier<T>

/**
 * OptionalWrapper
 * @desc Type representing optional wrapper function type in TypeScript
 * @example
 *   type OptionalWrapper = (v1, v2) => return 0
 */
export type OptionalWrapper<T> = Wrapper<Optional<T>>

/**
 * NonNullableWrapper
 * @desc Type representing non-nullable wrapper function type in TypeScript
 * @example
 *   type NonNullableWrapper = (v1, v2) => return 0
 */
export type NonNullableWrapper<T> = Wrapper<NonNullable<T>>

/**
 * Factory
 * @desc Type representing factory function type in TypeScript
 * @example
 *   type Factory = (v1, v2) => return 0
 */
export type Factory<T, V> = (v: T) => Supplier<V>

/**
 * OptionalFactory
 * @desc Type representing optional factory function type in TypeScript
 * @example
 *   type OptionalFactory = (v1, v2) => return 0
 */
export type OptionalFactory<T, V> = (v: T) => Supplier<Optional<V>>

/**
 * NonNullableFactory
 * @desc Type representing non-nullable factory function type in TypeScript
 * @example
 *   type NonNullableFactory = (v1, v2) => return 0
 */
export type NonNullableFactory<T, V> = (v: T) => Supplier<NonNullable<V>>
// -------------------------------------------------------------------------------------------------
