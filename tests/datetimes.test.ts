import { DataTimes } from '../src'

export namespace DateTimes_Test {
    import diffDatesAsString = DataTimes.diffDatesAsString;

    describe('Check diff dates as string', () => {
        it('it should return valid dates differences', () => {
            expect(diffDatesAsString(new Date('2020-03-02T15:56:00')).join('-')).toEqual("1 year-2 days")
            expect(diffDatesAsString('1583153760000').join('-')).toEqual("436 years-10 months-24 days")
            expect(diffDatesAsString('1').join('-')).toEqual("20 years-2 months-3 days")
        })
    })
}
