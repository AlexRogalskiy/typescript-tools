import { None, OptionType, Some } from './Option'
import { List } from './List'

import { F1, F2, F3, F4, F5, F6, F7, Lazy } from '../../typings/types'

export interface EitherType<E, A> {
    map<B>(f: F1<A, B>): EitherType<E, B>

    flatMap<B>(f: F1<A, EitherType<E, B>>): EitherType<E, B>

    recover(f: F1<E, EitherType<E, A>>): EitherType<E, A>

    getOrElse(value: Lazy<A>): A

    forEach(f: F1<A, void>): void

    isLeft: boolean
    isRight: boolean

    right(): OptionType<A>

    left: () => OptionType<E>

    getOrError()
}

export const Right = <E, A>(value: A): EitherType<E, A> => {
    const self: EitherType<E, A> = {
        flatMap: <B>(f: F1<A, EitherType<E, B>>): EitherType<E, B> => f(value),
        map: <B>(f: F1<A, B>): EitherType<E, B> => self.flatMap(x => Right(f(x))),
        recover: (_: F1<E, EitherType<E, A>>): EitherType<E, A> => self,
        getOrElse: (_: Lazy<A>): A => value,
        forEach: (f: F1<A, void>): void => f(value),
        isLeft: false,
        isRight: true,
        right: () => Some(value),
        left: () => None(),
        getOrError: (): A => value,
    }
    return self
}

export const Left = <E, A>(value: E): EitherType<E, A> => {
    const self: EitherType<E, A> = {
        flatMap: <B>(_: F1<A, EitherType<E, B>>): EitherType<E, B> => self as any as EitherType<E, B>,
        map: <B>(_: F1<A, B>): EitherType<E, B> => self as any as EitherType<E, B>,
        recover: (f: F1<E, EitherType<E, A>>): EitherType<E, A> => f(value),
        getOrElse: (defaultVal: Lazy<A>): A => defaultVal(),
        forEach: (_: F1<A, void>): void => {},
        isLeft: true,
        isRight: false,
        right: () => None(),
        left: () => Some(value),
        getOrError: (): A => {
            throw value
        },
    }
    return self
}

export const Either = {
    sequence: <E, A>(eithers: List<EitherType<E, A>>): EitherType<E, List<A>> => {
        let i = 0
        const length = eithers.length
        let items: any[] = []

        while (i < length) {
            const item = eithers[i]
            if (item.isLeft) return item as any as EitherType<E, List<A>>
            // eslint-disable-next-line github/array-foreach
            item.forEach(v => (items = [...items, v]))
            i++
        }
        return Right(items)
    },
    run<E, A>(gen: Generator<EitherType<E, A>, EitherType<E, A>, A>): EitherType<E, A> {
        let lastValue
        while (true) {
            const result = gen.next(lastValue)
            if (result.done || result.value.isLeft) {
                return result.value
            }
            lastValue = result.value.getOrError() // If Left then throw an exception
        }
    },
    map4: <E, A, B, C, D, F>(
        a: EitherType<E, A>,
        b: EitherType<E, B>,
        c: EitherType<E, C>,
        d: EitherType<E, D>,
        f: F4<A, B, C, D, EitherType<E, F>>,
    ): EitherType<E, F> =>
        Either.map3(a, b, c, (va, vb, vc) => {
            return d.flatMap(vd => f(va, vb, vc, vd))
        }),
    map5: <E, A, B, C, D, F, G>(
        a: EitherType<E, A>,
        b: EitherType<E, B>,
        c: EitherType<E, C>,
        d: EitherType<E, D>,
        f: EitherType<E, F>,
        g: F5<A, B, C, D, F, EitherType<E, G>>,
    ): EitherType<E, G> =>
        Either.map4(a, b, c, d, (va, vb, vc, vd) => {
            return f.flatMap(vf => g(va, vb, vc, vd, vf))
        }),
    map2: <E, A, B, C>(a: EitherType<E, A>, b: EitherType<E, B>, f: F2<A, B, EitherType<E, C>>) =>
        a.flatMap(va => {
            return b.flatMap(vb => {
                return f(va, vb)
            })
        }),
    map3: <E, A, B, C, D>(
        a: EitherType<E, A>,
        b: EitherType<E, B>,
        c: EitherType<E, C>,
        f: F3<A, B, C, EitherType<E, D>>,
    ): EitherType<E, D> =>
        Either.map2(a, b, (va, vb) => {
            return c.flatMap(vc => f(va, vb, vc))
        }),
    map6: <E, A, B, C, D, F, G, H>(
        a: EitherType<E, A>,
        b: EitherType<E, B>,
        c: EitherType<E, C>,
        d: EitherType<E, D>,
        f: EitherType<E, F>,
        g: EitherType<E, G>,
        h: F6<A, B, C, D, F, G, EitherType<E, H>>,
    ): EitherType<E, H> =>
        Either.map5(a, b, c, d, f, (va, vb, vc, vd, vf) => {
            return g.flatMap(vg => h(va, vb, vc, vd, vf, vg))
        }),
    map7: <E, A, B, C, D, F, G, H, J>(
        a: EitherType<E, A>,
        b: EitherType<E, B>,
        c: EitherType<E, C>,
        d: EitherType<E, D>,
        f: EitherType<E, F>,
        g: EitherType<E, G>,
        h: EitherType<E, H>,
        j: F7<A, B, C, D, F, G, H, EitherType<E, J>>,
    ): EitherType<E, J> =>
        Either.map6(a, b, c, d, f, g, (va, vb, vc, vd, vf, vg) => {
            return h.flatMap(vh => j(va, vb, vc, vd, vf, vg, vh))
        }),

    sequenceOption: <E, A>(opt: OptionType<EitherType<E, A>>): EitherType<E, OptionType<A>> => {
        return opt
            .map(item => {
                return item.map(value => Some(value))
            })
            .getOrElse(() => Right(None()))
    },
}
