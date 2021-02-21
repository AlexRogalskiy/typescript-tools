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
 * BiSupplier
 * @desc Type representing binary supplier function type in TypeScript
 * @example
 *   type BiSupplier = () => return {"v1": "first", "v2": "second"}
 */
export type BiSupplier<T, V> = () => { v1: T; v2: V }

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
 * BooleanProcessor
 * @desc Type representing boolean processor function type in TypeScript
 * @example
 *   type BooleanProcessor = (v) => return v ? "1" : "2"
 */
export type BooleanProcessor<R> = Processor<boolean, R>

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
 * BooleanBiProcessor
 * @desc Type representing boolean binary processor function type in TypeScript
 * @example
 *   type BooleanBiProcessor = (v1, v2) => return v1 + v2
 */
export type BooleanBiProcessor<R> = BiProcessor<boolean, boolean, R>

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
 * BooleanTriProcessor
 * @desc Type representing boolean ternary processor function type in TypeScript
 * @example
 *   type BooleanTriProcessor = (v1, v2, v3) => return v1 & v2 & v3
 */
export type BooleanTriProcessor<R> = TriProcessor<boolean, boolean, boolean, R>

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
 * ToBooleanTriProcessor
 * @desc Type representing ternary processor function type with boolean result in TypeScript
 * @example
 *   type ToBooleanTriProcessor = (v1, v2, v3) => return v1 === v2 === v3
 */
export type ToBooleanTriProcessor<T, V, S> = (v1: T, v2: V, v3: S) => boolean
// -------------------------------------------------------------------------------------------------
/**
 * UnaryOperator
 * @desc Type representing unary function type in TypeScript
 * @example
 *   type UnaryOperator = (v) => return v
 */
export type UnaryOperator<T> = (v: T) => T

/**
 * NumberUnaryOperator
 * @desc Type representing number unary function type in TypeScript
 * @example
 *   type NumberUnaryOperator = (v) => return v
 */
export type NumberUnaryOperator = UnaryOperator<number>

/**
 * StringUnaryOperator
 * @desc Type representing string unary function type in TypeScript
 * @example
 *   type StringUnaryOperator = (v) => return v
 */
export type StringUnaryOperator = UnaryOperator<string>

/**
 * BooleanUnaryOperator
 * @desc Type representing boolean unary function type in TypeScript
 * @example
 *   type BooleanUnaryOperator = (v) => return v
 */
export type BooleanUnaryOperator = UnaryOperator<boolean>

/**
 * BinaryOperator
 * @desc Type representing binary function type in TypeScript
 * @example
 *   type BinaryOperator = (v1, v2) => return v1 + v2
 */
export type BinaryOperator<T> = (v1: T, v2: T) => T

/**
 * NumberBinaryOperator
 * @desc Type representing number binary function type in TypeScript
 * @example
 *   type NumberBinaryOperator = (v1, v2) => return v1 + v2
 */
export type NumberBinaryOperator = BinaryOperator<number>

/**
 * StringBinaryOperator
 * @desc Type representing string binary function type in TypeScript
 * @example
 *   type StringBinaryOperator = (v1, v2) => return v1 + v2
 */
export type StringBinaryOperator = BinaryOperator<string>

/**
 * BooleanBinaryOperator
 * @desc Type representing boolean binary function type in TypeScript
 * @example
 *   type BooleanBinaryOperator = (v1, v2) => return v1 & v2
 */
export type BooleanBinaryOperator = BinaryOperator<boolean>

/**
 * TernaryOperator
 * @desc Type representing ternary function type in TypeScript
 * @example
 *   type TernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type TernaryOperator<T> = (v1: T, v2: T, v3: T) => T

/**
 * NumberTernaryOperator
 * @desc Type representing number ternary function type in TypeScript
 * @example
 *   type NumberTernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type NumberTernaryOperator = TernaryOperator<number>

/**
 * StringTernaryOperator
 * @desc Type representing string ternary function type in TypeScript
 * @example
 *   type StringTernaryOperator = (v1, v2, v3) => return v1 + v2 + v3
 */
export type StringTernaryOperator = TernaryOperator<string>

/**
 * BooleanTernaryOperator
 * @desc Type representing boolean ternary function type in TypeScript
 * @example
 *   type BooleanTernaryOperator = (v1, v2, v3) => return v1 & v2 & v3
 */
export type BooleanTernaryOperator = TernaryOperator<boolean>
// -------------------------------------------------------------------------------------------------
