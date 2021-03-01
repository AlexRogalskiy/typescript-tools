import { describe, expect } from '@jest/globals'

import { Arrays, Numbers } from '../src'

export namespace Numbers_Test {
    import average = Arrays.average;
    import countLeadingZeros = Numbers.countLeadingZeros;
    import numberOf2sInRange = Numbers.numberOf2sInRange;
    import isPerfectNumber = Numbers.isPerfectNumber;
    import isSimpleNumber = Numbers.isSimpleNumber;
    import isSuperSimpleNumber = Numbers.isSuperSimpleNumber;
    import getDiv3Xor7 = Numbers.getDiv3Xor7;

    describe('Check number of leading zeros in a number', () => {
        it('it should calculate valid number of leading zeros', () => {
            expect(countLeadingZeros(1)).toEqual(31)
            expect(countLeadingZeros(3)).toEqual(30)
            expect(countLeadingZeros(5)).toEqual(29)
            expect(countLeadingZeros(555)).toEqual(22)
        })
    })

    describe('Check division XOR value', () => {
        it('it should calculate valid number', () => {
            expect(getDiv3Xor7(10, 100)).toEqual(35)
        })
    })

    describe('Check number is perfect', () => {
        it('it should perform valid perfect number', () => {
            expect(isPerfectNumber(6)).toBeTruthy()
            expect(isPerfectNumber(28)).toBeTruthy()
            expect(isPerfectNumber(496)).toBeTruthy()
            expect(isPerfectNumber(8128)).toBeTruthy()
            expect(isPerfectNumber(1)).toBeFalsy()
            expect(isPerfectNumber(10)).toBeFalsy()
        })
    })

    describe('Check number is simple', () => {
        it('it should perform valid simple number', () => {
            expect(isSimpleNumber(13)).toBeTruthy()
            expect(isSimpleNumber(31)).toBeTruthy()
            expect(isSimpleNumber(15)).toBeFalsy()
            expect(isSimpleNumber(6)).toBeFalsy()
        })
    })

    describe('Check number is super simple', () => {
        it('it should perform valid super simple number', () => {
            expect(isSuperSimpleNumber(13)).toBeTruthy()
            expect(isSuperSimpleNumber(31)).toBeTruthy()
            expect(isSuperSimpleNumber(15)).toBeFalsy()
            expect(isSuperSimpleNumber(6)).toBeFalsy()
        })
    })

    describe('Check number of 2s in range', () => {
        it('it should calculate valid number of 2s in range', () => {
            expect(numberOf2sInRange(22)).toEqual(6)
            expect(numberOf2sInRange(20)).toEqual(3)
            expect(numberOf2sInRange(5)).toEqual(1)
            expect(numberOf2sInRange(12)).toEqual(2)
        })
    })

    describe('Check average of array elements', () => {
        const array = [6, 3, 8, 2, 3, 2]
        it('it should calculate valid average value of array', () => {
            expect(average(array)).toEqual(4)
        })
    })
}
