import { None, OptionType, Some } from './Option'

import { F1 } from '../../typings/types'

export type List<A> = readonly A[]
export type Predicate<A> = F1<A, boolean>

export const isEmptyList = <A>(list: List<A>): boolean => list.length === 0

export const find = <A>(predicate: Predicate<A>, list: List<A>): OptionType<A> => {
    let i = 0
    const length = list.length

    while (i < length) {
        if (predicate(list[i])) return Some(list[i])
        i++
    }
    return None()
}
