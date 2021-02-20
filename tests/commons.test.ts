import { Commons } from '../src'

export namespace Commons_Test {
    import isEmpty = Commons.isEmpty

    describe('Check isEmpty by input object', () => {
        it('it should return true when value is null', () => {
            expect(isEmpty(null)).toEqual(true)
        })
        it('it should return true when value is undefined', () => {
            expect(isEmpty(undefined)).toEqual(true)
        })
        it('it should return true when value is empty string', () => {
            expect(isEmpty('')).toEqual(true)
        })
        it('it should return true when value is null as string', () => {
            expect(isEmpty('null')).toEqual(true)
        })
        it('it should return false when value is 0', () => {
            expect(isEmpty(0)).toEqual(false)
        })
        it('it should return false when value is not empty', () => {
            expect(isEmpty('Daphne')).toEqual(false)
        })
    })
}
