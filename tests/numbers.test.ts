import { describe, expect } from '@jest/globals'

import { Arrays, Numbers } from '../src'

export namespace Numbers_Test {
    import average = Arrays.average;
    import countLeadingZeros = Numbers.countLeadingZeros;
    import numberOf2sInRange = Numbers.numberOf2sInRange;

    describe('Check number of leading zeros in a number', () => {
        it('if should calculate valid number of leading zeros', () => {
            expect(countLeadingZeros(1)).toEqual(31)
            expect(countLeadingZeros(3)).toEqual(30)
            expect(countLeadingZeros(5)).toEqual(29)
            expect(countLeadingZeros(555)).toEqual(22)
        })
    })

    describe('Check number of 2s in range', () => {
        it('if should calculate valid number of 2s in range', () => {
            expect(numberOf2sInRange(22)).toEqual(6)
            expect(numberOf2sInRange(20)).toEqual(3)
            expect(numberOf2sInRange(5)).toEqual(1)
            expect(numberOf2sInRange(12)).toEqual(2)
        })
    })

    describe('Check average of array elements', () => {
        const array = [6, 3, 8, 2, 3, 2]
        it('if should calculate valid average value of array', () => {
            expect(average(array)).toEqual(4)
        })
    })
}
