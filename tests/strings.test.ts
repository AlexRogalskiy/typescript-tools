import { EMOJI_REGEX, Strings } from '../src'

export namespace Strings_Test {
    import replaceBy = Strings.replaceBy;
    import pad = Strings.pad;
    import parseJson = Strings.parseJson;
    import capFirstLetter = Strings.capFirstLetter;
    import formatNumber = Strings.formatNumber;
    import combinations = Strings.combinations;
    import permutations = Strings.permutations;
    import sortBy = Strings.sortBy;
    import format = Strings.format;
    import shortest = Strings.shortest;
    import getRomanNotation = Strings.getRomanNotation;
    import shortenString = Strings.shortenString;
    import stripComments = Strings.stripComments;
    import capitalize = Strings.capitalize;
    import quote = Strings.quote;

    describe('Check emoji replacer', () => {
        it('it should kill emojis in a string', () => {
            expect(replaceBy(EMOJI_REGEX, '🎉Party 🚩Flags! 🚀Rockets!')).toEqual('Party Flags! Rockets!')
        })
        it('it should kill emojis in a string and replace by a set replacement value', () => {
            expect(replaceBy(EMOJI_REGEX, '🎉 Party 🚩 Flags! 🚀 Rockets!', 'X')).toEqual(
                'X Party X Flags! X Rockets!',
            )
        })
    })

    describe('Check string combinations', () => {
        it('it should perform valid string combinations', () => {
            expect(combinations('wxyz').length).toEqual(15)
        })
    })

    describe('Check string permutations', () => {
        it('it should perform valid string permutations', () => {
            expect(permutations('hat').length).toEqual(6)
        })
    })

    describe('Check string sort order', () => {
        const list = ['Дельта', 'альфа', 'ЧАРЛИ', 'браво']

        it('it should perform valid string sort order', () => {
            expect(sortBy(null, ...list).join('-')).toEqual('альфа-браво-Дельта-ЧАРЛИ')
        })
    })

    describe('Check roman notation transformation', () => {
        it('it should return valid roman notation', () => {
            expect(getRomanNotation(5)).toEqual('V')
            expect(getRomanNotation(15)).toEqual('XV')
            expect(getRomanNotation(55)).toEqual('LV')
            expect(getRomanNotation(155)).toEqual('CLV')
        })
    })

    describe('Check shorten string operation', () => {
        it('it should return valid shortened string', () => {
            expect(shortenString('internationalisation', v => v.toUpperCase())).toEqual('I18N')
            expect(shortenString('localization', v => v.toUpperCase())).toEqual('L10N')
            expect(shortenString('internationalisation', v => v.toLowerCase())).toEqual('i18n')
            expect(shortenString('localization', v => v.toLowerCase())).toEqual('l10n')
        })
    })

    describe('Check shortest path between items', () => {
        const strings = ["or", "in", "at", "for", "after", "next", "before", "previous", "in"]

        it('it should return the shortest path', () => {
            expect(shortest(strings, "in", "at")).toEqual(1)
            expect(shortest(strings, "or", "at")).toEqual(2)
            expect(shortest(strings, "or", "for")).toEqual(3)
        })
    })

    describe('Check format number', () => {
        it('it should return valid number format', () => {
            expect(format(3)).toEqual('3')
            expect(format(3.1)).toEqual('3.1')
            expect(format(3.12)).toEqual('3.12')
            expect(format(3.123)).toEqual('3.12')
        })
    })

    describe('Check strip comments operation', () => {
        it('it should return valid string with stripped comments', () => {
            expect(stripComments('a + b// comment')).toEqual('a + b')
            expect(stripComments('1 + /* 2 */3')).toEqual('1 + 3')
            expect(stripComments('x = 10;// ten!')).toEqual('x = 10;')
            expect(stripComments('1 /* a */+/* b */ 1')).toEqual('1  1')
        })
    })

    describe('Check format human-readable number', () => {
        it('it should return valid format number with byte prefix', () => {
            expect(formatNumber(111, 1)).toEqual('111.0')
            expect(formatNumber(111222, 1)).toEqual('111.2 k')
            expect(formatNumber(111222333, 1)).toEqual('111.2 M')
            expect(formatNumber(111222333444, 1)).toEqual('111.2 G')
            expect(formatNumber(111222333444, 1)).toEqual('111.2 G')
            expect(formatNumber(111222333444, 3)).toEqual('111.222 G')
            expect(formatNumber(111222333444, 0)).toEqual('111 G')
        })
    })

    describe('Check capitalize letters string', () => {
        it('it should return valid string with capitalized first letters', () => {
            expect(capitalize('test')).toEqual('Test')
            expect(capitalize('valid format')).toEqual('Valid Format')
            expect(capitalize('valid format string')).toEqual('Valid Format String')
        })
    })

    describe('Check double quotes', () => {
        it('it should return valid string with double quotes', () => {
            let cmd = quote(['echo', "hell'o1 ${HOME}"], true);
            cmd = ['bash', '-c', quote(cmd)].join(' ');
            expect(quote(cmd)).toEqual("\"bash -c \\\"echo \\\\\"hell'o1 \\\\${HOME}\\\\\"\\\"\"")
            expect(quote(['a', 'b', 'c d'])).toEqual("a b 'c d'")
            expect(quote(['a', 'b', 'it\'s a "neat thing"'])).toEqual('a b "it\'s a \\"neat thing\\""')
            expect(quote(['$', '`', "'"])).toEqual('\\$ \\` "\'"')
            expect(quote([])).toEqual('')
            expect(quote([''])).toEqual("''")
            expect(quote(['a\nb'])).toEqual("'a\nb'")
            expect(quote([' #(){}*|][!'])).toEqual("' #(){}*|][!'")
            expect(quote(["'#(){}*|][!"])).toEqual('"\'#(){}*|][\\!"')
            expect(quote(['X#(){}*|][!'])).toEqual('X\\#\\(\\)\\{\\}\\*\\|\\]\\[\\!')
            expect(quote(['a\n#\nb'])).toEqual("'a\n#\nb'")
            expect(quote(['><;{}'])).toEqual('\\>\\<\\;\\{\\}')
            expect(quote(['a', 1, true, false])).toEqual('a 1 true false')
            expect(quote(['a', 1, null, undefined])).toEqual('a 1 null undefined')
            expect(quote(['a\\x'])).toEqual('a\\\\x')
        })

        it('it should return valid string with single quotes', () => {
            expect(quote(['a', '|', 'b'])).toEqual('a \\| b')
            expect(quote(['a', '&&', 'b', ';', 'c'])).toEqual('a \\&\\& b \\; c')
        })
    })

    describe('Check string padding', () => {
        it('it should add zero padding to numbers', () => {
            expect(pad(7, 2)).toEqual('07')
        })
        it('it should add zero padding to numbers', () => {
            expect(pad(998, 4)).toEqual('0998')
        })
        it('it should not add 2 zero pad to numbers when no size is set', () => {
            expect(pad(7)).toEqual('07')
        })
    })

    describe('Check parsing input json', () => {
        const validString = `{"firstName":"Daphne","lastName":"Smit"}`
        const invalidString = `{"firstName":"Daphne",,"lastName":"Smit"}`

        it('it should parseJson a valid json without errors', () => {
            expect(parseJson(validString)).toEqual({
                firstName: 'Daphne',
                lastName: 'Smit',
            })
        })
        it('it should parseJson an invalid json without errors and return undefined', () => {
            expect(parseJson(invalidString)).toEqual(undefined)
        })
        it('it should parseJson an invalid json without errors and return default value when set', () => {
            expect(parseJson(invalidString, { failed: true })).toEqual({ failed: true })
        })
    })

    describe('Check capitalize first letter', () => {
        it('it should uppercase the first character of a string', () => {
            expect(capFirstLetter('daphne')).toEqual('Daphne')
        })
        it('it should uppercase the first character of a string', () => {
            expect(capFirstLetter('people are crazy!')).toEqual('People are crazy!')
        })
        it('it should uppercase the first character of a string', () => {
            expect(capFirstLetter('typescript: you are so powerful!')).toEqual(
                'Typescript: you are so powerful!',
            )
        })
    })
}
