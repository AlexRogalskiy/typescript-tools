import { Checkers } from '../src'

export namespace Checkers_Test {
    import isInRange = Checkers.isInRange;
    import isIntNumber = Checkers.isIntNumber;
    import isDate = Checkers.isDate;
    import isBoolean = Checkers.isBoolean;
    import isNumeric = Checkers.isNumeric;
    import isFunction = Checkers.isFunction;
    import isPowerOfTwo = Checkers.isPowerOfTwo;
    import isString = Checkers.isString;
    import isObject = Checkers.isObject;
    import isArray = Checkers.isArray;
    import isJSON = Checkers.isJSON;
    import isRealNumber = Checkers.isRealNumber;
    import isAlphaNumeric = Checkers.isAlphaNumeric;

    describe('Check value is in range', () => {
        it('it should return true when value is in range', () => {
            expect(isInRange(1, 0, 6)).toBeTruthy()
            expect(isInRange(7, 0, 6)).toBeFalsy()
            expect(isInRange(7, 0, 7)).toBeFalsy()
            expect(isInRange(7, 0, 8)).toBeTruthy()
            expect(isInRange(5.6, 0, 7)).toBeTruthy()
            expect(isInRange(0, 0, 7)).toBeFalsy()
        })
    })

    describe('Check value is integer', () => {
        it('it should return true when value is integer', () => {
            expect(isIntNumber(1)).toBeTruthy()
            expect(isIntNumber(1.1)).toBeFalsy()
            expect(isIntNumber('1')).toBeFalsy()
            expect(isIntNumber('test')).toBeFalsy()
            expect(isIntNumber(true)).toBeFalsy()
            expect(isIntNumber(null)).toBeFalsy()
        })
    })

    describe('Check value is date', () => {
        it('it should return true when value is date', () => {
            expect(isDate(1)).toBeFalsy()
            expect(isDate('1')).toBeFalsy()
            expect(isDate(new Date())).toBeTruthy()
            expect(isDate(new Date('2020-02-02'))).toBeTruthy()
            expect(isDate(null)).toBeFalsy()
        })
    })

    describe('Check value is boolean', () => {
        it('it should return true when value is boolean', () => {
            expect(isBoolean(1)).toBeFalsy()
            expect(isBoolean('1')).toBeFalsy()
            expect(isBoolean(true)).toBeTruthy()
            expect(isBoolean(Boolean())).toBeTruthy()
            expect(isBoolean(Boolean(true))).toBeTruthy()
            expect(isBoolean(null)).toBeFalsy()
        })
    })

    describe('Check value is numeric', () => {
        it('it should return true when value is numeric', () => {
            expect(isNumeric(1)).toBeTruthy()
            expect(isNumeric('1')).toBeTruthy()
            expect(isNumeric(true)).toBeFalsy()
            expect(isNumeric(Boolean())).toBeFalsy()
            expect(isNumeric(1.56)).toBeTruthy()
            expect(isNumeric(null)).toBeFalsy()
        })
    })

    describe('Check value is function', () => {
        it('it should return true when value is function', () => {
            const dummy = () => {
                // empty
            }

            expect(isFunction(1)).toBeFalsy()
            expect(isFunction('1')).toBeFalsy()
            expect(isFunction(true)).toBeFalsy()
            expect(isFunction(Boolean())).toBeFalsy()
            expect(isFunction(1.56)).toBeFalsy()
            expect(isFunction(dummy)).toBeTruthy()
            expect(isFunction(Function())).toBeTruthy()
            expect(isFunction(new Function())).toBeTruthy()
            expect(isFunction(null)).toBeFalsy()
        })
    })

    describe('Check value is power of two', () => {
        it('it should return true when value is power of two', () => {
            expect(isPowerOfTwo(1)).toBeTruthy()
            expect(isPowerOfTwo(1.57)).toBeFalsy()
            expect(isPowerOfTwo(4)).toBeTruthy()
            expect(isPowerOfTwo(8)).toBeTruthy()
            expect(isPowerOfTwo(9)).toBeFalsy()
        })
    })

    describe('Check value is string', () => {
        it('it should return true when value is string', () => {
            expect(isString('1')).toBeTruthy()
            expect(isString(1)).toBeFalsy()
            expect(isString(true)).toBeFalsy()
            expect(isString(Boolean())).toBeFalsy()
            expect(isString(1.56)).toBeFalsy()
            expect(isString(String())).toBeTruthy()
            expect(isString(Function())).toBeFalsy()
            expect(isString(new Function())).toBeFalsy()
            expect(isString(null)).toBeFalsy()
        })
    })

    describe('Check value is object', () => {
        it('it should return true when value is object', () => {
            expect(isObject('1')).toBeFalsy()
            expect(isObject(1)).toBeFalsy()
            expect(isObject(true)).toBeFalsy()
            expect(isObject(Boolean())).toBeFalsy()
            expect(isObject(1.56)).toBeFalsy()
            expect(isObject(String())).toBeFalsy()
            expect(isObject({})).toBeTruthy()
            expect(isObject({ a: 5 })).toBeTruthy()
            expect(isObject(Object())).toBeTruthy()
            expect(isObject(Object({}))).toBeTruthy()
            expect(isObject(Function())).toBeFalsy()
            expect(isObject(new Function())).toBeFalsy()
            expect(isObject(null)).toBeFalsy()
        })
    })

    describe('Check value is array', () => {
        it('it should return true when value is array', () => {
            expect(isArray(1)).toBeFalsy()
            expect(isArray('1')).toBeFalsy()
            expect(isArray(true)).toBeFalsy()
            expect(isArray(Boolean())).toBeFalsy()
            expect(isArray(1.56)).toBeFalsy()
            expect(isArray(String())).toBeFalsy()
            expect(isArray([])).toBeTruthy()
            expect(isArray([1, 2, 3, 4, 5, 6])).toBeTruthy()
            expect(isArray(Array())).toBeTruthy()
            expect(isArray({ a: 5 })).toBeFalsy()
            expect(isArray(Object())).toBeFalsy()
            expect(isArray(Object({}))).toBeFalsy()
            expect(isArray(Function())).toBeFalsy()
            expect(isArray(new Function())).toBeFalsy()
            expect(isArray(null)).toBeFalsy()
        })
    })

    describe('Check value is json', () => {
        it('it should return true when value is json', () => {
            expect(isJSON('{ a: 5 }')).toBeFalsy()
            expect(isJSON('1')).toBeFalsy()
            expect(isJSON(true)).toBeFalsy()
            expect(isJSON(Boolean())).toBeFalsy()
            expect(isJSON(1.56)).toBeFalsy()
            expect(isJSON(String())).toBeFalsy()
            expect(isJSON([])).toBeFalsy()
            expect(isJSON([1, 2, 3, 4, 5, 6])).toBeFalsy()
            expect(isJSON(Array())).toBeFalsy()
            expect(isJSON({ a: 5 })).toBeFalsy()
            expect(isJSON(Object())).toBeFalsy()
            expect(isJSON(Object({}))).toBeFalsy()
            expect(isJSON(Function())).toBeFalsy()
            expect(isJSON(new Function())).toBeFalsy()
            expect(isJSON(null)).toBeFalsy()
            expect(isJSON("{\"a\": \"5\"}")).toBeFalsy()
            expect(isJSON(JSON.stringify({ a: 5 }))).toBeFalsy()
        })
    })

    describe('Check value is real number', () => {
        it('it should return true when value is real number', () => {
            expect(isRealNumber(1)).toBeFalsy()
            expect(isRealNumber(1.1)).toBeTruthy()
            expect(isRealNumber('1')).toBeFalsy()
            expect(isRealNumber('test')).toBeFalsy()
            expect(isRealNumber(true)).toBeFalsy()
            expect(isRealNumber(null)).toBeFalsy()
        })
    })

    describe('Check value is alpha numeric', () => {
        it('it should return true when value is alpha numeric', () => {
            expect(isAlphaNumeric(1)).toBeTruthy()
            expect(isAlphaNumeric(1.1)).toBeFalsy()
            expect(isAlphaNumeric('1')).toBeTruthy()
            expect(isAlphaNumeric('test')).toBeTruthy()
            expect(isAlphaNumeric('1test')).toBeTruthy()
            expect(isAlphaNumeric('1test&')).toBeFalsy()
            expect(isAlphaNumeric(true)).toBeFalsy()
            expect(isAlphaNumeric(null)).toBeFalsy()
        })
    })
}
