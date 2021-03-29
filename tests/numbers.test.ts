import { describe, expect } from '@jest/globals'

import { Arrays, Commons, Numbers } from '../src'

export namespace Numbers_Test {
    import average = Arrays.average;
    import countLeadingZeros = Numbers.countLeadingZeros;
    import numberOf2sInRange = Numbers.numberOf2sInRange;
    import isPerfectNumber = Numbers.isPerfectNumber;
    import isSimpleNumber = Numbers.isSimpleNumber;
    import isSuperSimpleNumber = Numbers.isSuperSimpleNumber;
    import getDiv3Xor7 = Numbers.getDiv3Xor7;
    import getPrime = Numbers.getPrime;
    import toUint32 = Numbers.toUint32;
    import toBoolean = Commons.toBoolean;
    import sortBy = Numbers.sortBy;
    import findLongest = Numbers.findLongest;
    import median = Numbers.median;

    beforeAll(() => {
        console.log("Numbers test suite started")
        console.time("Execution time took")
    })

    afterAll(() => {
        console.log("Numbers test suite finished")
        console.timeEnd("Execution time took")
    })

    describe('Check number of leading zeros in a number', () => {
        it('it should calculate valid number of leading zeros', () => {
            expect(countLeadingZeros(1)).toEqual(31)
            expect(countLeadingZeros(3)).toEqual(30)
            expect(countLeadingZeros(5)).toEqual(29)
            expect(countLeadingZeros(555)).toEqual(22)
        })
    })

    describe('Check median calculation by input numbers', () => {
        it('it should calculate valid median of input numbers', () => {
            expect(median(1, 2, 3, 4, 5)).toEqual(3)
            expect(median(1, 2)).toEqual(1)
            expect(median(2, 3, 4)).toEqual(3)
            expect(median()).toEqual(Number.NaN)
        })
    })

    describe('Check division XOR value', () => {
        it('it should calculate valid number', () => {
            expect(getDiv3Xor7(10, 100)).toEqual(35)
        })
    })

    describe('Check sort array order', () => {
        it('it should return valid array elements order', () => {
            expect(sortBy(['fsd', 'sa', 'sadfdafsafds', 'werwe'])).toEqual(["sadfdafsafds", "werwe", "fsd", "sa"])
            expect(sortBy(['fsd', 'sa', 'sadfdafsafds', 'werwe'], (v1, v2) => v1 >= v2 ? 1 : 0)).toEqual(["werwe", "sadfdafsafds", "sa", "fsd"])
            expect(sortBy(['fsd'])).toEqual(['fsd'])
            expect(sortBy([])).toEqual([])
        })
    })

    describe('Check longest string in a sequence', () => {
        it('it should return longest string', () => {
            expect(findLongest('fsd', 'sa')).toEqual({ "index": 0, "value": "fsd" })
            expect(findLongest('fsd', 'sa', 'sadfdafsafds', 'werwe')).toEqual({
                "index": 2,
                "value": "sadfdafsafds"
            })
            expect(findLongest('')).toEqual({ "index": -1, "value": "" })
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
        it('it should calculate valid average value of array', () => {
            expect(average([6, 3, 8, 2, 3, 2])).toEqual(4)
        })
    })

    describe('Check get prime number', () => {
        it('it should return valid prime number', () => {
            expect(getPrime(4)).toEqual(17)
            expect(getPrime(0)).toEqual(17)
            expect(getPrime(157)).toEqual(257)
            expect(getPrime(Number.MAX_SAFE_INTEGER)).toEqual(16777259)
        })
    })

    describe('Check convert to unsigned int32 number', () => {
        it('it should return valid unsigned int32 number', () => {
            expect(toUint32(4)).toEqual(4)
            expect(toUint32(0)).toEqual(0)
            expect(toUint32('157')).toEqual(157)
            expect(toUint32(Number.MAX_SAFE_INTEGER)).toEqual(4294967295)
            expect(toUint32(Number.MIN_SAFE_INTEGER)).toEqual(4294967295)

            expect(toUint32(null)).toEqual(0)
            expect(toUint32(undefined)).toEqual(NaN)
            expect(toUint32({})).toEqual(NaN)
            expect(toUint32(true)).toEqual(1)
            expect(toUint32(() => 5)).toEqual(NaN)
        })
    })

    describe('Check convert to boolean value', () => {
        it('it should return valid boolean value', () => {
            expect(toBoolean(1)).toBeTruthy()
            expect(toBoolean('true')).toBeTruthy()
            expect(toBoolean('on')).toBeTruthy()
            expect(toBoolean(0)).toBeFalsy()
            expect(toBoolean('false')).toBeFalsy()
            expect(toBoolean('off')).toBeFalsy()

            expect(toBoolean('157')).toBeFalsy()
            expect(toBoolean(Number.MAX_SAFE_INTEGER)).toBeFalsy()
            expect(toBoolean(null)).toBeFalsy()
            expect(toBoolean(undefined)).toBeFalsy()
            expect(toBoolean({})).toBeFalsy()
            expect(toBoolean(() => 5)).toBeFalsy()
        })
    })
}
