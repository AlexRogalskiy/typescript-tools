import { DateTimes } from '../src'

export namespace DateTimes_Test {
    import diffDatesAsString = DateTimes.diffDatesAsString

    beforeAll(() => {
        console.log('DateTimes test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('DateTimes test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Check diff dates as string', () => {
        it('it should return valid dates differences', () => {
            expect(
                diffDatesAsString(new Date('2020-03-02T15:56:00'), new Date('2020-04-02T15:56:00')).join('-'),
            ).toEqual('1 month')
            expect(diffDatesAsString('1583153760000', '1583153763040').join('-')).toEqual('3 hours-4 minutes')
            expect(diffDatesAsString('2', '1').join('-')).toEqual('1 month')
        })
    })
}
