import { EMOJI_REGEX, Strings } from '../src'

export namespace Strings_Test {
    import replaceBy = Strings.replaceBy
    import pad = Strings.pad
    import parseJson = Strings.parseJson
    import capFirstLetter = Strings.capFirstLetter

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
