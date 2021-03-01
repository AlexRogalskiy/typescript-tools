import vagueTime from 'vague-time'

export namespace DataTimes {
    // Function equivalent to moment(<stringDate>).fromNow()
    // but vague-time module is lighter than moment!
    export function fromNow(strDate: string | Date): string {
        try {
            const date: Date = new Date(new Date(strDate))
            const formattedDate = vagueTime.get({ to: date }).replace('a couple of', '2')
            if (/\d+ years ago|a year ago/.test(formattedDate)) {
                return `in ${date.getFullYear()}`
            }

            return formattedDate
        } catch (e) {
            // avoid throwing "Invalid date" errors
            return '?'
        }
    }

    export const getDay = (day: string, mon: string, year: number): string => {
        const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']

        const day_ = parseInt(day, 10) //если день двухсимвольный и <10
        const mon_ = parseInt(mon, 10) //если месяц двухсимвольный и <10
        const a = parseInt(String((14 - mon_) / 12), 10)

        const y = year - a
        const m = mon_ + 12 * a - 2
        const d =
            (7000 +
                parseInt(
                    String(
                        day_ +
                            y +
                            parseInt(String(y / 4), 10) -
                            parseInt(String(y / 100), 10) +
                            parseInt(String(y / 400), 10) +
                            (31 * m) / 12,
                    ),
                    10,
                )) %
            7

        return days[d]
    }
}
