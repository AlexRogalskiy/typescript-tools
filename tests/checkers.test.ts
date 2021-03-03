import { ALPHA_REGEX, ArrayBuffers, Checkers, Errors } from '../src'
import checkRange = Checkers.checkRange;

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
    import is = Checkers.is;
    import isObjectLiteral = Checkers.isObjectLiteral;
    import isHostObject = Checkers.isHostObject;
    import isHostMethod = Checkers.isHostMethod;
    import checkType = Checkers.checkType;
    import ValidationError = Errors.ValidationError;
    import checkNumber = Checkers.checkNumber;
    import checkDate = Checkers.checkDate;
    import checkObject = Checkers.checkObject;
    import checkString = Checkers.checkString;
    import checkBoolean = Checkers.checkBoolean;
    import checkFunction = Checkers.checkFunction;
    import checkNull = Checkers.checkNull;
    import checkUndefined = Checkers.checkUndefined;
    import checkArray = Checkers.checkArray;
    import checkJson = Checkers.checkJson;
    import isFloat = Checkers.isFloat;
    import isInteger = Checkers.isInteger;
    import isPositiveDecimal = Checkers.isPositiveDecimal;
    import isIterable = Checkers.isIterable;
    import areEqualNumbers = Checkers.areEqualNumbers;
    import isArrayIndex = Checkers.isArrayIndex;
    import isArrayBuffer = ArrayBuffers.isArrayBuffer;
    import isArrayBuffer2 = Checkers.isArrayBuffer;
    import isBuffer = Checkers.isBuffer;
    import isValidSymbol = Checkers.isValidSymbol;
    import isObjectWith = Checkers.isObjectWith;
    import isNull = Checkers.isNull;
    import isUndefined = Checkers.isUndefined;
    import isArray2 = Checkers.isArray2;
    import isPropertyInRange = Checkers.isPropertyInRange;
    import isDomElement = Checkers.isDomElement;
    import isRegExp = Checkers.isRegExp;
    import isNullOrUndefined = Checkers.isNullOrUndefined;
    import isDigit = Checkers.isDigit;
    import isSet = Checkers.isSet;
    import checkEmail = Checkers.checkEmail;
    import checkUrl = Checkers.checkUrl;
    import checkPhone = Checkers.checkPhone;
    import checkDateBy = Checkers.checkDateBy;

    describe('Check value is in range', () => {
        it('it should return true when value is in range without bounds', () => {
            expect(isInRange(1, 0, 6)).toBeTruthy()
            expect(isInRange(7, 0, 6)).toBeFalsy()
            expect(isInRange(7, 0, 7)).toBeFalsy()
            expect(isInRange(7, 0, 8)).toBeTruthy()
            expect(isInRange(5.6, 0, 7)).toBeTruthy()
            expect(isInRange(0, 0, 7)).toBeFalsy()
        })

        it('it should return true when value is in range with bounds', () => {
            expect(isInRange(1, 0, 6, true)).toBeTruthy()
            expect(isInRange(7, 0, 6, true)).toBeFalsy()
            expect(isInRange(7, 0, 7, true)).toBeTruthy()
            expect(isInRange(7, 0, 8, true)).toBeTruthy()
            expect(isInRange(5.6, 0, 7, true)).toBeTruthy()
            expect(isInRange(0, 0, 7, true)).toBeTruthy()
        })
    })

    describe('Check value is integer', () => {
        it('it should return true when value is integer', () => {
            expect(isIntNumber(1)).toBeTruthy()
            expect(isIntNumber(1.1)).toBeFalsy()
            expect(isIntNumber('1')).toBeFalsy()
            expect(isIntNumber('test')).toBeFalsy()
            expect(isIntNumber([])).toBeFalsy()
            expect(isIntNumber(true)).toBeFalsy()
            expect(isIntNumber(null)).toBeFalsy()
            expect(isIntNumber(undefined)).toBeFalsy()
        })
    })

    describe('Check value is null', () => {
        it('it should return true when value is null', () => {
            expect(isNull(1)).toBeFalsy()
            expect(isNull(1.1)).toBeFalsy()
            expect(isNull('1')).toBeFalsy()
            expect(isNull('test')).toBeFalsy()
            expect(isNull([])).toBeFalsy()
            expect(isNull(true)).toBeFalsy()
            expect(isNull(null)).toBeTruthy()
            expect(isNull(undefined)).toBeFalsy()
        })
    })

    describe('Check value is undefined', () => {
        it('it should return true when value is undefined', () => {
            expect(isUndefined(1)).toBeFalsy()
            expect(isUndefined(1.1)).toBeFalsy()
            expect(isUndefined('1')).toBeFalsy()
            expect(isUndefined('test')).toBeFalsy()
            expect(isUndefined([])).toBeFalsy()
            expect(isUndefined(true)).toBeFalsy()
            expect(isUndefined(null)).toBeFalsy()
            expect(isUndefined(undefined)).toBeTruthy()
        })
    })

    describe('Check value is date', () => {
        it('it should return true when value is date', () => {
            expect(isDate(1)).toBeFalsy()
            expect(isDate('1')).toBeFalsy()
            expect(isDate(new Date())).toBeTruthy()
            expect(isDate(new Date('2020-02-02'))).toBeTruthy()
            expect(isDate(null)).toBeFalsy()
            expect(isDate(undefined)).toBeFalsy()
            expect(isDate(() => 5)).toBeFalsy()
            expect(isDate([])).toBeFalsy()
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
            expect(isBoolean(undefined)).toBeFalsy()
            expect(isBoolean(() => 5)).toBeFalsy()
        })
    })

    describe('Check value is DOM element', () => {
        it('it should return true when value is DOM element', () => {
            expect(isDomElement(1)).toBeFalsy()
            expect(isDomElement('1')).toBeFalsy()
            expect(isDomElement(true)).toBeFalsy()
            expect(isDomElement(Boolean())).toBeFalsy()
            expect(isDomElement(Boolean(true))).toBeFalsy()
            expect(isDomElement(null)).toBeFalsy()
            expect(isDomElement(undefined)).toBeFalsy()
            expect(isDomElement(() => 5)).toBeFalsy()
        })
    })

    describe('Check value is regex expression', () => {
        it('it should return true when value is regex expression', () => {
            expect(isRegExp(1)).toBeFalsy()
            expect(isRegExp('1')).toBeFalsy()
            expect(isRegExp(true)).toBeFalsy()
            expect(isRegExp(Boolean())).toBeFalsy()
            expect(isRegExp(Boolean(true))).toBeFalsy()
            expect(isRegExp(null)).toBeFalsy()
            expect(isRegExp(undefined)).toBeFalsy()
            expect(isRegExp(() => 5)).toBeFalsy()
            expect(isRegExp('/^$/')).toBeFalsy()

            expect(isRegExp(ALPHA_REGEX)).toBeTruthy()
            expect(isRegExp(new RegExp(''))).toBeTruthy()
            expect(isRegExp(new RegExp(ALPHA_REGEX))).toBeTruthy()
        })
    })

    describe('Check value is null or undefined', () => {
        it('it should return true when value is null or undefined', () => {
            expect(isNullOrUndefined(1)).toBeFalsy()
            expect(isNullOrUndefined('1')).toBeFalsy()
            expect(isNullOrUndefined(true)).toBeFalsy()
            expect(isNullOrUndefined(Boolean())).toBeFalsy()
            expect(isNullOrUndefined(Boolean(true))).toBeFalsy()
            expect(isNullOrUndefined(() => 5)).toBeFalsy()

            expect(isNullOrUndefined(null)).toBeTruthy()
            expect(isNullOrUndefined(undefined)).toBeTruthy()
        })
    })

    describe('Check value is email address', () => {
        it('it should return true when value is valid email address', () => {
            expect(checkEmail('1')).toBeFalsy()
            expect(checkEmail('mail@')).toBeFalsy()
            expect(checkEmail('mail@ru')).toBeFalsy()

            expect(checkEmail('mail@domain.ru')).toBeTruthy()
        })
    })

    describe('Check value is url address', () => {
        it('it should return true when value is valid url address', () => {
            expect(checkUrl('1')).toBeFalsy()
            expect(checkUrl('mail@')).toBeFalsy()
            expect(checkUrl('mail@ru')).toBeFalsy()
            expect(checkUrl('mail@domain.ru')).toBeFalsy()
            expect(checkUrl('https://')).toBeFalsy()

            expect(checkUrl('https://domain.com')).toBeTruthy()
        })
    })

    describe('Check value is phone address', () => {
        it('it should return true when value is valid phone address', () => {
            expect(checkPhone('1')).toBeFalsy()
            expect(checkPhone('555')).toBeFalsy()
            expect(checkPhone('555-55')).toBeFalsy()

            expect(checkPhone('555-555-5555')).toBeTruthy()
        })
    })

    describe('Check value is date', () => {
        it('it should return true when value is valid date', () => {
            expect(checkDateBy('1')).toBeFalsy()
            expect(checkDateBy('555')).toBeFalsy()
            expect(checkDateBy('555-55')).toBeFalsy()

            expect(checkDateBy('02/02/20')).toBeTruthy()
            expect(checkDateBy('02/02/202')).toBeTruthy()
            expect(checkDateBy('02/02/2020')).toBeTruthy()
        })
    })

    describe('Check value is digit', () => {
        it('it should return true when value is digit', () => {
            expect(isDigit('1')).toBeTruthy()
            expect(isDigit(String('1'))).toBeTruthy()
            expect(isDigit(String('1a'))).toBeTruthy()

            expect(isDigit(String('a'))).toBeFalsy()
            expect(isDigit(String('a1'))).toBeFalsy()
            expect(isDigit('')).toBeFalsy()
        })
    })

    describe('Check value is not null or undefined', () => {
        it('it should return true when value is not null or undefined', () => {
            expect(isSet(1)).toBeTruthy()
            expect(isSet('1')).toBeTruthy()
            expect(isSet(true)).toBeTruthy()
            expect(isSet(Boolean())).toBeTruthy()
            expect(isSet(Boolean(true))).toBeTruthy()
            expect(isSet(() => 5)).toBeTruthy()

            expect(isSet(null)).toBeFalsy()
            expect(isSet(undefined)).toBeFalsy()
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
            expect(isNumeric(undefined)).toBeFalsy()
            expect(isNumeric([])).toBeFalsy()
            expect(isNumeric(() => 5)).toBeFalsy()
        })
    })

    describe('Check value is function', () => {
        it('it should return true when value is function', () => {
            expect(isFunction(1)).toBeFalsy()
            expect(isFunction('1')).toBeFalsy()
            expect(isFunction(true)).toBeFalsy()
            expect(isFunction(Boolean())).toBeFalsy()
            expect(isFunction(1.56)).toBeFalsy()
            expect(isFunction(() => 5)).toBeTruthy()
            expect(isFunction(Function())).toBeTruthy()
            expect(isFunction(new Function())).toBeTruthy()
            expect(isFunction(null)).toBeFalsy()
            expect(isFunction(undefined)).toBeFalsy()
            expect(isFunction([])).toBeFalsy()
        })
    })

    describe('Check value is power of two', () => {
        it('it should return true when value is power of two', () => {
            expect(isPowerOfTwo(1)).toBeTruthy()
            expect(isPowerOfTwo(1.57)).toBeFalsy()
            expect(isPowerOfTwo(4)).toBeTruthy()
            expect(isPowerOfTwo(8)).toBeTruthy()
            expect(isPowerOfTwo(9)).toBeFalsy()
            expect(isPowerOfTwo(64)).toBeTruthy()
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
            expect(isString(undefined)).toBeFalsy()
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
            expect(isObject(undefined)).toBeFalsy()
        })
    })

    describe('Check value is array buffer', () => {
        it('it should return true when value is array buffer', () => {
            expect(isArrayBuffer('1')).toBeFalsy()
            expect(isArrayBuffer(1)).toBeFalsy()
            expect(isArrayBuffer(true)).toBeFalsy()
            expect(isArrayBuffer(Boolean())).toBeFalsy()
            expect(isArrayBuffer(1.56)).toBeFalsy()
            expect(isArrayBuffer(String())).toBeFalsy()
            expect(isArrayBuffer({})).toBeFalsy()
            expect(isArrayBuffer({ a: 5 })).toBeFalsy()
            expect(isArrayBuffer(Object())).toBeFalsy()
            expect(isArrayBuffer(Object({}))).toBeFalsy()
            expect(isArrayBuffer(Function())).toBeFalsy()
            expect(isArrayBuffer(new Function())).toBeFalsy()
            expect(isArrayBuffer(null)).toBeFalsy()
            expect(isArrayBuffer(undefined)).toBeFalsy()

            expect(isArrayBuffer(new ArrayBuffer(1))).toBeTruthy()
            expect(isArrayBuffer(new Int8Array(1))).toBeTruthy()
            expect(isArrayBuffer(new Uint8Array(1))).toBeTruthy()
            expect(isArrayBuffer(new Uint8ClampedArray(1))).toBeTruthy()
            expect(isArrayBuffer(new Int16Array(1))).toBeTruthy()
            expect(isArrayBuffer(new Uint16Array(1))).toBeTruthy()
            expect(isArrayBuffer(new Int32Array(1))).toBeTruthy()
            expect(isArrayBuffer(new Uint32Array(1))).toBeTruthy()
            expect(isArrayBuffer(new Float32Array(1))).toBeTruthy()
            expect(isArrayBuffer(new Float64Array(1))).toBeTruthy()
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
            expect(isArray(undefined)).toBeFalsy()

            expect(isArray2(1)).toBeFalsy()
            expect(isArray2('1')).toBeFalsy()
            expect(isArray2(true)).toBeFalsy()
            expect(isArray2(Boolean())).toBeFalsy()
            expect(isArray2(1.56)).toBeFalsy()
            expect(isArray2(String())).toBeFalsy()
            expect(isArray2([])).toBeTruthy()
            expect(isArray2([1, 2, 3, 4, 5, 6])).toBeTruthy()
            expect(isArray2(Array())).toBeTruthy()
            expect(isArray2({ a: 5 })).toBeFalsy()
            expect(isArray2(Object())).toBeFalsy()
            expect(isArray2(Object({}))).toBeFalsy()
            expect(isArray2(Function())).toBeFalsy()
            expect(isArray2(new Function())).toBeFalsy()
            expect(isArray2(null)).toBeFalsy()
            expect(isArray2(undefined)).toBeFalsy()
        })
    })

    describe('Check value is json', () => {
        it('it should return true when value is json', () => {
            expect(isJSON('{ a: 5 }')).toBeFalsy()
            expect(isJSON(undefined)).toBeFalsy()
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
            expect(isRealNumber(undefined)).toBeFalsy()
            expect(isRealNumber([])).toBeFalsy()
        })
    })

    describe('Check value is float number', () => {
        it('it should return true when value is float number', () => {
            expect(isFloat(1)).toBeFalsy()
            expect(isFloat(1.1)).toBeTruthy()
            expect(isFloat('1')).toBeFalsy()
            expect(isFloat('test')).toBeFalsy()
            expect(isFloat(true)).toBeFalsy()
            expect(isFloat(null)).toBeFalsy()
            expect(isFloat(undefined)).toBeFalsy()
            expect(isFloat([])).toBeFalsy()
        })
    })

    describe('Check property is in range', () => {
        it('it should return true when property value is in range', () => {
            expect(isPropertyInRange({ 'a': 5 }, 'a', 1, 6)).toBeUndefined()
            expect(isPropertyInRange({ 'a': 0 }, 'a', 0, 1, true)).toBeUndefined()
            expect(isPropertyInRange({ 'a': 1 }, 'a', 0, 1, true)).toBeUndefined()

            expect(() => isPropertyInRange({ 'a': 5 }, 'b', 1, 4)).toThrowError(ValidationError)
            expect(() => isPropertyInRange({ 'a': 5 }, 'a', 1, 4)).toThrowError(ValidationError)
            expect(() => isPropertyInRange({}, 'a', 1, 4)).toThrowError(ValidationError)
            expect(() => isPropertyInRange(null, 'a', 1, 4)).toThrowError(ValidationError)
            expect(() => isPropertyInRange(undefined, 'a', 1, 4)).toThrowError(ValidationError)
        })
    })

    describe('Check value is integer number', () => {
        it('it should return true when value is integer number', () => {
            expect(isInteger(1)).toBeTruthy()
            expect(isInteger(-1)).toBeTruthy()
            expect(isInteger(1.1)).toBeFalsy()
            expect(isInteger('1')).toBeFalsy()
            expect(isInteger('test')).toBeFalsy()
            expect(isInteger(true)).toBeFalsy()
            expect(isInteger(null)).toBeFalsy()
            expect(isInteger(undefined)).toBeFalsy()
            expect(isInteger([])).toBeFalsy()
        })
    })

    describe('Check value is positive decimal number', () => {
        it('it should return true when value is positive decimal number', () => {
            expect(isPositiveDecimal(1)).toBeTruthy()
            expect(isPositiveDecimal(1.1)).toBeTruthy()
            expect(isPositiveDecimal(-1.1)).toBeFalsy()
            expect(isPositiveDecimal('1')).toBeFalsy()
            expect(isPositiveDecimal('test')).toBeFalsy()
            expect(isPositiveDecimal(true)).toBeFalsy()
            expect(isPositiveDecimal(null)).toBeFalsy()
            expect(isPositiveDecimal(undefined)).toBeFalsy()
            expect(isPositiveDecimal([])).toBeFalsy()
        })
    })

    describe('Check value is iterable', () => {
        it('it should return true when value is iterable', () => {
            expect(isIterable(1)).toBeFalsy()
            expect(isIterable(1.1)).toBeFalsy()
            expect(isIterable(-1.1)).toBeFalsy()
            expect(isIterable('1')).toBeTruthy()
            expect(isIterable('test')).toBeTruthy()
            expect(isIterable(true)).toBeFalsy()
            expect(isIterable(null)).toBeFalsy()
            expect(isIterable([])).toBeTruthy()
            expect(isIterable(new Function())).toBeFalsy()
            expect(isIterable(Array())).toBeTruthy()
            expect(isIterable(Date())).toBeTruthy()
            expect(isIterable(Boolean())).toBeFalsy()
            expect(isIterable(String())).toBeTruthy()
            expect(isIterable({})).toBeFalsy()
            expect(isIterable({ [Symbol.iterator]: null })).toBeFalsy()

            expect(() => isIterable(undefined)).toThrowError(TypeError)
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
            expect(isAlphaNumeric(undefined)).toBeFalsy()
            expect(isAlphaNumeric([])).toBeFalsy()
        })
    })

    describe('Check value is object type', () => {
        it('it should return true when value is valid object type', () => {
            expect(is(1, 'number')).toBeTruthy()
            expect(is(1.1, 'string')).toBeFalsy()
            expect(is('1', 'string')).toBeTruthy()
            expect(is('test', 'string')).toBeTruthy()
            expect(is('true', 'string')).toBeTruthy()
            expect(is('1test&', 'number')).toBeFalsy()
            expect(is(true, 'boolean')).toBeTruthy()
            expect(is(null, 'object')).toBeFalsy()
            expect(is(null, 'null')).toBeTruthy()
            expect(is(undefined, 'undefined')).toBeTruthy()
            expect(is(Date(), 'string')).toBeTruthy()
            expect(is(new Date(), 'date')).toBeTruthy()
            expect(is(new Function(), 'function')).toBeTruthy()
            expect(is(() => 5, 'function')).toBeTruthy()
        })
    })

    describe('Check number values are equal with a precision', () => {
        it('it should return true when values are equal', () => {
            expect(areEqualNumbers(4.11, 4.12)).toBeFalsy()
            expect(areEqualNumbers(4, 5)).toBeFalsy()
            expect(areEqualNumbers(0, 0)).toBeTruthy()
            expect(areEqualNumbers(4 + Number.EPSILON / 2, 4)).toBeTruthy()
            expect(areEqualNumbers(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1)).toBeFalsy()
        })
    })

    describe('Check number is an array index', () => {
        it('it should return true when number is valid array index', () => {
            expect(isArrayIndex('1')).toBeTruthy()
            expect(isArrayIndex('test')).toBeFalsy()
            expect(isArrayIndex('0')).toBeTruthy()
            expect(isArrayIndex('-1')).toBeFalsy()
            expect(isArrayIndex(Number.EPSILON.toString())).toBeFalsy()
            expect(isArrayIndex(Number.MAX_SAFE_INTEGER.toString())).toBeFalsy()
        })
    })

    describe('Check value is an object literal', () => {
        it('it should return true when value is valid object literal', () => {
            expect(isObjectLiteral({})).toBeTruthy()
            expect(isObjectLiteral({ a: 5 })).toBeTruthy()
            expect(isObjectLiteral(1.1)).toBeFalsy()
            expect(isObjectLiteral('1')).toBeFalsy()
            expect(isObjectLiteral('test')).toBeFalsy()
            expect(isObjectLiteral('true')).toBeFalsy()
            expect(isObjectLiteral('1test&')).toBeFalsy()
            expect(isObjectLiteral(true)).toBeFalsy()
            expect(isObjectLiteral(null)).toBeFalsy()
            expect(isObjectLiteral(undefined)).toBeFalsy()
        })
    })

    describe('Check value is a symbol', () => {
        it('it should return true when value is valid symbol', () => {
            expect(isValidSymbol({})).toBeFalsy()
            expect(isValidSymbol({ a: 5 })).toBeFalsy()
            expect(isValidSymbol(1.1)).toBeFalsy()
            expect(isValidSymbol('1')).toBeFalsy()
            expect(isValidSymbol([])).toBeFalsy()
            expect(isValidSymbol(() => 5)).toBeFalsy()
            expect(isValidSymbol('test')).toBeTruthy()
            expect(isValidSymbol('true')).toBeTruthy()
            expect(isValidSymbol('1test&')).toBeFalsy()
            expect(isValidSymbol(true)).toBeFalsy()
            expect(isValidSymbol(null)).toBeFalsy()
            expect(isValidSymbol(undefined)).toBeFalsy()
        })
    })

    describe('Check value is a symbol', () => {
        it('it should return true when value is a alid symbol', () => {
            expect(isObjectWith({}, 'a')).toBeFalsy()
            expect(isObjectWith({ a: {} }, 'a')).toBeTruthy()
            expect(isObjectWith({ a: 5 }, 'b')).toBeFalsy()
            expect(isObjectWith(1.1, 'a')).toBeFalsy()
            expect(isObjectWith('1', 'a')).toBeFalsy()
            expect(isObjectWith('test', 'a')).toBeFalsy()
            expect(isObjectWith('true', 'a')).toBeFalsy()
            expect(isObjectWith('1test&', 'a')).toBeFalsy()
            expect(isObjectWith(true, 'a')).toBeFalsy()

            expect(() => isObjectWith(null, 'a')).toThrowError(TypeError)
            expect(() => isObjectWith(undefined, 'a')).toThrowError(TypeError)
        })
    })

    describe('Check value is an array buffer', () => {
        it('it should return true when value is a valid array buffer', () => {
            expect(isArrayBuffer2({})).toBeFalsy()
            expect(isArrayBuffer2({ a: 5 })).toBeFalsy()
            expect(isArrayBuffer2(1.1)).toBeFalsy()
            expect(isArrayBuffer2('1')).toBeFalsy()
            expect(isArrayBuffer2('test')).toBeFalsy()
            expect(isArrayBuffer2('true')).toBeFalsy()
            expect(isArrayBuffer2('1test&')).toBeFalsy()
            expect(isArrayBuffer2(true)).toBeFalsy()
            expect(isArrayBuffer2(null)).toBeFalsy()
            expect(isArrayBuffer2(undefined)).toBeFalsy()

            expect(isArrayBuffer2(new ArrayBuffer(1))).toBeTruthy()
            expect(isArrayBuffer2(new Int8Array(1))).toBeTruthy()
            expect(isArrayBuffer2(new Uint8Array(1))).toBeTruthy()
            expect(isArrayBuffer2(new Uint8ClampedArray(1))).toBeTruthy()
            expect(isArrayBuffer2(new Int16Array(1))).toBeTruthy()
            expect(isArrayBuffer2(new Uint16Array(1))).toBeTruthy()
            expect(isArrayBuffer2(new Int32Array(1))).toBeTruthy()
            expect(isArrayBuffer2(new Uint32Array(1))).toBeTruthy()
            expect(isArrayBuffer2(new Float32Array(1))).toBeTruthy()
            expect(isArrayBuffer2(new Float64Array(1))).toBeTruthy()
        })
    })

    describe('Check value is an object buffer', () => {
        it('it should return true when value is a valid object buffer', () => {
            expect(isBuffer({})).toBeFalsy()
            expect(isBuffer({ a: 5 })).toBeFalsy()
            expect(isBuffer(1.1)).toBeFalsy()
            expect(isBuffer('1')).toBeFalsy()
            expect(isBuffer('test')).toBeFalsy()
            expect(isBuffer('true')).toBeFalsy()
            expect(isBuffer('1test&')).toBeFalsy()
            expect(isBuffer(true)).toBeFalsy()
            expect(isBuffer(null)).toBeFalsy()
            expect(isBuffer(undefined)).toBeFalsy()

            expect(isBuffer(new ArrayBuffer(1))).toBeTruthy()
            expect(isBuffer(new Int8Array(1))).toBeTruthy()
            expect(isBuffer(new Int8Array(1))).toBeTruthy()
            expect(isBuffer(new Uint8Array(1))).toBeTruthy()
            expect(isBuffer(new Uint8ClampedArray(1))).toBeTruthy()
            expect(isBuffer(new Int16Array(1))).toBeTruthy()
            expect(isBuffer(new Uint16Array(1))).toBeTruthy()
            expect(isBuffer(new Int32Array(1))).toBeTruthy()
            expect(isBuffer(new Uint32Array(1))).toBeTruthy()
            expect(isBuffer(new Float32Array(1))).toBeTruthy()
            expect(isBuffer(new Float64Array(1))).toBeTruthy()
        })
    })

    describe('Check value is a host object', () => {
        it('it should return true when value is a host object', () => {
            expect(isHostObject({}, 'toString')).toBeFalsy()
            expect(isHostObject({}, 'toLocaleString')).toBeFalsy()
            expect(isHostObject({ a: {} }, 'a')).toBeTruthy()
            expect(isHostObject({ a: 5 }, 'b')).toBeFalsy()
            expect(isHostObject(null, 'b')).toBeFalsy()
            expect(isHostObject(undefined, 'b')).toBeFalsy()
        })
    })

    describe('Check value is a host method', () => {
        it('it should return true when value is a host method', () => {
            expect(isHostMethod({}, 'toString')).toBeTruthy()
            expect(isHostMethod({}, 'toLocaleString')).toBeTruthy()
            expect(isHostMethod({ a: {} }, 'a')).toBeTruthy()
            expect(isHostMethod({ a: 5 }, 'b')).toBeFalsy()
            expect(isHostMethod({ a: v => v }, 'a')).toBeTruthy()
            expect(isHostMethod(null, 'b')).toBeFalsy()
            expect(isHostMethod(undefined, 'b')).toBeFalsy()
        })
    })

    describe('Check value is a valid object type', () => {
        it('it should return true when value is a valid object type', () => {
            expect(checkType({}, 'object')).toBeUndefined()
            expect(checkType(true, 'boolean')).toBeUndefined()
            expect(checkType({ a: {} }, 'object')).toBeUndefined()
            expect(checkType((v) => v, 'function')).toBeUndefined()
            expect(checkType('a', 'string')).toBeUndefined()
            expect(checkType(null, 'null')).toBeUndefined()
            expect(checkType(undefined, 'undefined')).toBeUndefined()
            expect(checkType(Date(), 'string')).toBeUndefined()
            expect(checkType(new Date(), 'date')).toBeUndefined()

            expect(() => checkType(new Date('2012-01-26T13:51:50.417Z'), 'test')).toThrowError(ValidationError)
            expect(() => checkType('1number', 'number')).toThrowError(ValidationError)
            expect(() => checkType({}, 'string')).toThrowError(ValidationError)
            expect(() => checkType({}, 'function')).toThrowError(ValidationError)
            expect(() => checkType(3, 'boolean')).toThrowError(ValidationError)
            expect(() => checkType(Date(), 'date')).toThrowError(ValidationError)
            expect(() => checkType('test', 'object')).toThrowError(ValidationError)
            expect(() => checkType(undefined, 'object')).toThrowError(ValidationError)
            expect(() => checkType(null, 'object')).toThrowError(ValidationError)
        })
    })

    describe('Check index is in array range', () => {
        it('it should return true when index is in array range', () => {
            expect(checkRange(3, [1, 2, 3, 4])).toBeUndefined()
            expect(checkRange(0, [1])).toBeUndefined()

            expect(() => checkRange(0, [])).toThrow('Invalid index: 0. not in range:')
            expect(() => checkRange(1, [1])).toThrow('Invalid index: 1. not in range: 1')
        })
    })

    describe('Check value is a valid number', () => {
        it('it should throw error when value is not a valid number', () => {
            expect(checkNumber(Number())).toBeUndefined()
            expect(checkNumber(3)).toBeUndefined()

            expect(() => checkNumber('3')).toThrowError(ValidationError)
            expect(() => checkNumber({})).toThrowError(ValidationError)
            expect(() => checkNumber({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkNumber({})).toThrowError(ValidationError)
            expect(() => checkNumber(true)).toThrowError(ValidationError)
            expect(() => checkNumber(null)).toThrowError(ValidationError)
            expect(() => checkNumber(undefined)).toThrowError(ValidationError)
        })
    })

    describe('Check value is a valid date', () => {
        it('it should throw error when value is not a valid date', () => {
            expect(checkDate(new Date())).toBeUndefined()

            expect(() => checkDate(Date())).toThrowError(ValidationError)
            expect(() => checkDate('3')).toThrowError(ValidationError)
            expect(() => checkDate({})).toThrowError(ValidationError)
            expect(() => checkDate({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkDate({})).toThrowError(ValidationError)
            expect(() => checkDate(true)).toThrowError(ValidationError)
            expect(() => checkDate(null)).toThrowError(ValidationError)
            expect(() => checkDate(undefined)).toThrowError(ValidationError)
        })
    })

    describe('Check value is a valid object', () => {
        it('it should throw error when value is not a valid object', () => {
            expect(checkObject(Object())).toBeUndefined()
            expect(checkObject(new Object({}))).toBeUndefined()
            expect(checkObject({})).toBeUndefined()
            expect(checkObject({ a: 5 })).toBeUndefined()

            expect(() => checkObject(new Object('{}'))).toThrowError(ValidationError)
            expect(() => checkObject('3')).toThrowError(ValidationError)
            expect(() => checkObject('{}')).toThrowError(ValidationError)
            expect(() => checkObject(true)).toThrowError(ValidationError)
            expect(() => checkObject(null)).toThrowError(ValidationError)
            expect(() => checkObject(undefined)).toThrowError(ValidationError)
        })
    })

    describe('Check value is a valid string', () => {
        it('it should throw error when value is not a valid string', () => {
            expect(checkString('')).toBeUndefined()
            expect(checkString("null")).toBeUndefined()

            expect(() => checkString(3)).toThrowError(ValidationError)
            expect(() => checkString({})).toThrowError(ValidationError)
            expect(() => checkString({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkString({})).toThrowError(ValidationError)
            expect(() => checkString(true)).toThrowError(ValidationError)
            expect(() => checkString(null)).toThrowError(ValidationError)
            expect(() => checkString(undefined)).toThrowError(ValidationError)
        })
    })

    describe('Check value is a valid boolean', () => {
        it('it should throw error when value is not a valid boolean', () => {
            expect(checkBoolean(true)).toBeUndefined()
            expect(checkBoolean(Boolean())).toBeUndefined()

            expect(() => checkBoolean(3)).toThrowError(ValidationError)
            expect(() => checkBoolean({})).toThrowError(ValidationError)
            expect(() => checkBoolean({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkBoolean({})).toThrowError(ValidationError)
            expect(() => checkBoolean('true')).toThrowError(ValidationError)
            expect(() => checkBoolean(null)).toThrowError(ValidationError)
            expect(() => checkBoolean(undefined)).toThrowError(ValidationError)
        })
    })

    describe('Check value is a valid function', () => {
        it('it should throw error when value is not a valid function', () => {
            expect(checkFunction(() => 5)).toBeUndefined()
            expect(checkFunction(new Function())).toBeUndefined()

            expect(() => checkFunction(3)).toThrowError(ValidationError)
            expect(() => checkFunction({})).toThrowError(ValidationError)
            expect(() => checkFunction({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkFunction({})).toThrowError(ValidationError)
            expect(() => checkFunction(true)).toThrowError(ValidationError)
            expect(() => checkFunction('true')).toThrowError(ValidationError)
            expect(() => checkFunction(null)).toThrowError(ValidationError)
            expect(() => checkFunction(undefined)).toThrowError(ValidationError)
        })
    })

    describe('Check value is null', () => {
        it('it should throw error when value is not null', () => {
            expect(checkNull(null)).toBeUndefined()

            expect(() => checkNull(new Function())).toThrowError(ValidationError)
            expect(() => checkNull(3)).toThrowError(ValidationError)
            expect(() => checkNull({})).toThrowError(ValidationError)
            expect(() => checkNull({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkNull({})).toThrowError(ValidationError)
            expect(() => checkNull('true')).toThrowError(ValidationError)
            expect(() => checkNull(true)).toThrowError(ValidationError)
            expect(() => checkNull('null')).toThrowError(ValidationError)
            expect(() => checkNull(undefined)).toThrowError(ValidationError)
        })
    })

    describe('Check value is undefined', () => {
        it('it should throw error when value is not undefined', () => {
            expect(checkUndefined(undefined)).toBeUndefined()

            expect(() => checkUndefined(new Function())).toThrowError(ValidationError)
            expect(() => checkUndefined(3)).toThrowError(ValidationError)
            expect(() => checkUndefined({})).toThrowError(ValidationError)
            expect(() => checkUndefined({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkUndefined({})).toThrowError(ValidationError)
            expect(() => checkUndefined(true)).toThrowError(ValidationError)
            expect(() => checkUndefined('null')).toThrowError(ValidationError)
            expect(() => checkUndefined(null)).toThrowError(ValidationError)
        })
    })

    describe('Check value is json', () => {
        it('it should throw error when value is not json', () => {
            expect(() => checkJson(undefined)).toThrowError(ValidationError)
            expect(() => checkJson(new Function())).toThrowError(ValidationError)
            expect(() => checkJson(3)).toThrowError(ValidationError)
            expect(() => checkJson({})).toThrowError(ValidationError)
            expect(() => checkJson({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkJson({})).toThrowError(ValidationError)
            expect(() => checkJson(true)).toThrowError(ValidationError)
            expect(() => checkJson('null')).toThrowError(ValidationError)
            expect(() => checkJson(null)).toThrowError(ValidationError)
        })
    })

    describe('Check value is array', () => {
        it('it should throw error when value is not array', () => {
            expect(checkArray([])).toBeUndefined()
            expect(checkArray(Array())).toBeUndefined()

            expect(() => checkArray(undefined)).toThrowError(ValidationError)
            expect(() => checkArray(new Function())).toThrowError(ValidationError)
            expect(() => checkArray(3)).toThrowError(ValidationError)
            expect(() => checkArray({})).toThrowError(ValidationError)
            expect(() => checkArray({ a: 5 })).toThrowError(ValidationError)
            expect(() => checkArray({})).toThrowError(ValidationError)
            expect(() => checkArray(true)).toThrowError(ValidationError)
            expect(() => checkArray('null')).toThrowError(ValidationError)
            expect(() => checkArray(null)).toThrowError(ValidationError)
        })
    })
}
