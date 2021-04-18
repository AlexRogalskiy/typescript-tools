import vagueTime from 'vague-time'
import dayjs from 'dayjs'
import preciseDiff from 'dayjs-precise-range'

export namespace DateTimes {
    dayjs.extend(preciseDiff)

    const measures = {
        years: ['year', 'years'],
        months: ['month', 'months'],
        days: ['day', 'days'],
        hours: ['hour', 'hours'],
        minutes: ['minute', 'minutes'],
        seconds: ['second', 'seconds'],
    }

    export const getNow = (): string => {
        return new Date().toISOString()
    }

    export const getISOTimestamp = (date: Date): string => {
        return `${date.toISOString().split('.')[0]}Z`
    }

    export const formatDate = (date: Date | number | string, format: string): string => {
        let d: Date
        if (typeof date === 'number') {
            d = new Date(date)
        } else if (typeof date === 'string') {
            d = new Date(date.replace(/-/g, '/'))
        } else {
            d = date
        }
        const dict: { [key: string]: string | number } = {
            yyyy: d.getFullYear(),
            M: d.getMonth() + 1,
            d: d.getDate(),
            H: d.getHours(),
            m: d.getMinutes(),
            s: d.getSeconds(),
            MM: `${d.getMonth() + 101}`.substr(1),
            dd: `${d.getDate() + 100}`.substr(1),
            HH: `${d.getHours() + 100}`.substr(1),
            mm: `${d.getMinutes() + 100}`.substr(1),
            ss: `${d.getSeconds() + 100}`.substr(1),
        }
        return format.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, key => dict[key] as string)
    }

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
        const v = parseInt(String(y / 4), 10) - parseInt(String(y / 100), 10) + parseInt(String(y / 400), 10)
        const d = (7000 + parseInt(String(day_ + y + v + (31 * m) / 12), 10)) % 7

        return days[d]
    }

    export const toLocaleDateString = (value: number | string | Date): string => {
        return new Date(value).toLocaleDateString()
    }

    export const diffDatesAsString = (startDate: dayjs.ConfigType, endDate: dayjs.ConfigType): string[] => {
        const start = dayjs(startDate)
        const end = dayjs(endDate)

        const diff = dayjs['preciseDiff'](start, end, true)

        let count = 0
        const timeParts: string[] = []
        for (const [key, value] of Object.entries<number>(diff)) {
            if (count === 3) {
                break
            } else if (count > 0) {
                count++
            }
            if (measures[key] && value > 0) {
                if (count === 0) {
                    count++
                }
                timeParts.push(`${value} ${measures[key][value === 1 ? 0 : 1]}`)
            }
        }

        return timeParts
    }
}
