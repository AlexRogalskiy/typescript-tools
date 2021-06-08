import { Strings } from '../src'

import padBegin = Strings.padBegin

export class Dateformat {
    /**
     * Date format pattern masks
     * @private
     */
    private static masks = {
        default: 'ddd mmm dd yyyy HH:MM:ss',
        shortDate: 'm/d/yy',
        mediumDate: 'mmm d, yyyy',
        longDate: 'mmmm d, yyyy',
        fullDate: 'dddd, mmmm d, yyyy',
        shortTime: 'h:MM TT',
        mediumTime: 'h:MM:ss TT',
        longTime: 'h:MM:ss TT Z',
        isoDate: 'yyyy-mm-dd',
        isoTime: 'HH:MM:ss',
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    }
    /**
     * Date format month/day titles
     * @private
     */
    private static i18n = {
        dayNames: [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ],
        monthNames: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
    }

    private static token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g
    private static timezone =
        /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g
    private static timezoneClip = /[^-+\dA-Z]/g

    // Regexes and supporting functions are cached through closure
    parse(date, mask, utc): void {
        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (
            arguments.length === 1 &&
            Object.prototype.toString.call(date) === '[object String]' &&
            !/\d/.test(date)
        ) {
            mask = date
            date = undefined
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date()
        if (isNaN(date)) {
            throw SyntaxError('invalid date')
        }

        mask = String(Dateformat.masks[mask] || mask || Dateformat.masks['default'])

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) === 'UTC:') {
            mask = mask.slice(4)
            utc = true
        }

        const _ = utc ? 'getUTC' : 'get',
            d = date[`${_}Date`](),
            D = date[`${_}Day`](),
            m = date[`${_}Month`](),
            y = date[`${_}FullYear`](),
            H = date[`${_}Hours`](),
            M = date[`${_}Minutes`](),
            s = date[`${_}Seconds`](),
            L = date[`${_}Milliseconds`](),
            o = utc ? 0 : date.getTimezoneOffset()

        const time = (String(date).match(Dateformat.timezone) || [''])
            .pop()
            ?.replace(Dateformat.timezoneClip, '')
        const flags = {
            d,
            dd: padBegin(d),
            ddd: Dateformat.i18n.dayNames[D],
            dddd: Dateformat.i18n.dayNames[D + 7],
            m: m + 1,
            mm: padBegin(m + 1),
            mmm: Dateformat.i18n.monthNames[m],
            mmmm: Dateformat.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: padBegin(H % 12 || 12),
            H,
            HH: padBegin(H),
            M,
            MM: padBegin(M),
            s,
            ss: padBegin(s),
            l: padBegin(L, 3),
            L: padBegin(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? 'a' : 'p',
            tt: H < 12 ? 'am' : 'pm',
            T: H < 12 ? 'A' : 'P',
            TT: H < 12 ? 'AM' : 'PM',
            Z: utc ? 'UTC' : time,
            o: (o > 0 ? '-' : '+') + padBegin(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4),
            S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (Number((d % 100) - (d % 10) !== 10) * d) % 10],
        }

        return mask.replace(Dateformat.token, value => {
            return value in flags ? flags[value] : value.slice(1, value.length - 1)
        })
    }
}
