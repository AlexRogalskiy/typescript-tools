import { Comparators } from '../src'

export namespace Comparators_Test {
    import compareByOrder = Comparators.compareByOrder
    import compare = Comparators.compare
    beforeAll(() => {
        console.log('Comparators test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('Comparators test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Check compare by order result', () => {
        it('it should return valid result by compare order', () => {
            expect(compareByOrder(1, 1)).toEqual(0)
            expect(compareByOrder(1, 2)).toEqual(-1)
            expect(compareByOrder(2, 1)).toEqual(1)

            expect(compareByOrder('test', 'test')).toEqual(0)
            expect(compareByOrder('test', 'retest')).toEqual(1)
            expect(compareByOrder('retest', 'test')).toEqual(-1)

            expect(compareByOrder(true, true)).toEqual(0)
            expect(compareByOrder(true, false)).toEqual(1)
            expect(compareByOrder(false, true)).toEqual(-1)
        })
    })

    describe('Check compare result', () => {
        it('it should return valid result by compare', () => {
            expect(compare(1, 1)).toEqual(-0)
            expect(compare(1, 2)).toEqual(-1)
            expect(compare(2, 1)).toEqual(1)

            expect(compare('test', 'test')).toEqual(-0)
            expect(compare('test', 'retest')).toEqual(1)
            expect(compare('retest', 'test')).toEqual(-1)

            expect(compare(true, true)).toEqual(-0)
            expect(compare(true, false)).toEqual(1)
            expect(compare(false, true)).toEqual(-1)
        })
    })
}
