import { DateOptions } from '../typings/domain-types'
import { DateTimes } from '../src'

import formatDate2 = DateTimes.formatDate2

export const formatParams = (options: DateOptions = {}): string => {
    const sp = new URLSearchParams()

    const o: any = { ...options }

    if ('year' in options) {
        const from = new Date()
        from.setFullYear(options.year)
        from.setMonth(0)
        from.setDate(1)

        const to = new Date()
        to.setFullYear(options.year)
        to.setMonth(11)
        to.setDate(31)

        o.from = from
        o.to = to
    }

    for (const s of ['from', 'to'])
        if (o[s]) {
            const value = formatDate2(o[s])

            if (value >= formatDate2(new Date()))
                throw new Error('cannot get contribution for date in the future')

            sp.set(s, value)
        }

    return sp.toString()
}
