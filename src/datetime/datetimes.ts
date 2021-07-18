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

    export const buildDate = (mOrTimestamp: number, d?: number, y?: number): Date => {
        return d !== undefined && y !== undefined ? new Date(y, mOrTimestamp, d) : new Date(mOrTimestamp)
    }

    export const formatDate3 = (date: Date): string => {
        const a = `0${date.getDate()}`.slice(-2)
        const b = `0${date.getMonth() + 1}`.slice(-2, date.getFullYear())

        return `${a}/${b}`
    }

    export const getNow = (): string => {
        return new Date().toISOString()
    }

    export const daysFromNow = (days = 0, existingDate?: number): string => {
        const date = existingDate ? new Date(existingDate) : new Date()
        date.setDate(date.getDate() + days)

        return date.toISOString()
    }

    export const minutesFromNow = (minutes = 0): string => {
        return new Date(Date.now() + minutes * 60000).toISOString()
    }

    // countWeekDaysBetween(new Date('Oct 05, 2020'), new Date('Oct 06, 2020')); // 1
    // countWeekDaysBetween(new Date('Oct 05, 2020'), new Date('Oct 14, 2020')); // 7
    export const countWeekDaysBetween = (startDate: Date, endDate: Date): any =>
        Array.from({ length: (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) }).reduce(
            (count: number) => {
                if (startDate.getDay() % 6 !== 0) count++
                startDate = new Date(startDate.setDate(startDate.getDate() + 1))
                return count
            },
            0,
        )

    export const addWeekDays = (startDate: Date, count: number): any =>
        Array.from({ length: count }).reduce((date: Date) => {
            date = new Date(date.setDate(date.getDate() + 1))
            if (date.getDay() % 6 === 0)
                date = new Date(date.setDate(date.getDate() + (date.getDay() / 6 + 1)))
            return date
        }, startDate)

    // daysInMonth(2020, 12)); // 31
    // daysInMonth(2024, 2)); // 29
    export const daysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate()

    // daysFromNow(5); // 2020-10-13 (if current date is 2020-10-08)
    export const daysFromNow2 = (n: number): string => {
        const d = new Date()
        d.setDate(d.getDate() + Math.abs(n))

        return d.toISOString().split('T')[0]
    }

    // daysAgo(20); // 2020-09-16 (if current date is 2020-10-06)
    export const daysAgo2 = (n: number): string => {
        const d = new Date()
        d.setDate(d.getDate() - Math.abs(n))

        return d.toISOString().split('T')[0]
    }

    // dayName(new Date()); // 'Saturday'
    // dayName(new Date('09/23/2020'), 'de-DE'); // 'Samstag'
    export const dayName = (date: Date, locale: string): string =>
        date.toLocaleDateString(locale, { weekday: 'long' })

    // dayOfYear(new Date()); // 272
    export const dayOfYear = (date: Date): number =>
        Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)

    export const addMinutesToDate = (date: number | string | Date, n: number): string => {
        const d = new Date(date)
        d.setTime(d.getTime() + n * 60000)

        return d.toISOString().split('.')[0].replace('T', ' ')
    }

    export const addDaysToDate = (date: number | string | Date, n: number): string => {
        const d = new Date(date)
        d.setDate(d.getDate() + n)

        return d.toISOString().split('T')[0]
    }

    export const formatDate2 = (input: Date | string): string => {
        const currentDate = new Date(input)

        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const date = currentDate.getDate()

        return [year, month.toString().padStart(2, '0'), date.toString().padStart(2, '0')].join('-')
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
