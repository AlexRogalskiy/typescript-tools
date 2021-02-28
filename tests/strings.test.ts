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
            expect(capFirstLetter('typescript: you are so powerfull!')).toEqual(
                'Typescript: you are so powerfull!',
            )
        })
    })
}
