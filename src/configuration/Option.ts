import { EitherType, Left, Right } from './Either'

import { F1, Lazy } from '../../typings/types'

export interface OptionType<A> {
    flatMap<B>(f: F1<A, OptionType<B>>): OptionType<B>

    map<B>(f: F1<A, B>): OptionType<B>

    getOrElse(defaultVal: Lazy<A>): A

    isDefined: boolean

    orError<E>(error: E): EitherType<E, A>

    equals(a: OptionType<A>): boolean
}

export const Some = <A>(value: A): OptionType<A> => {
    return {
        flatMap: <B>(f: F1<A, OptionType<B>>): OptionType<B> => f(value),
        map: <B>(f: F1<A, B>): OptionType<B> => Some(f(value)),
        getOrElse: (_: Lazy<A>): A => value,
        isDefined: true,
        orError: <E>(_: E): EitherType<E, A> => Right(value),
        equals: (a: OptionType<A>): boolean =>
            a.isDefined &&
            a.getOrElse(() => {
                throw Error('It never happens')
            }) === value,
    }
}

export const None = <A>(): OptionType<A> => {
    return {
        flatMap: <B>(_: F1<A, OptionType<B>>): OptionType<B> => None(),
        map: <B>(_: F1<A, B>): OptionType<B> => None(),
        getOrElse: (defaultVal: Lazy<A>): A => defaultVal(),
        isDefined: false,
        orError: <E>(error: E): EitherType<E, A> => Left(error),
        equals: (a: OptionType<A>): boolean => !a.isDefined,
    }
}

export type Nullable<T> = T | undefined | null

export const OptionOf = <A>(val: Nullable<A>): OptionType<A> => {
    if (val != null) return Some(val)
    return None()
}
