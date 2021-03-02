import { Commons } from '../src'

export namespace Commons_Test {
    import isEmpty = Commons.isEmpty;
    import equals = Commons.equals;
    import hasProperty = Commons.hasProperty;
    import hash = Commons.hash;
    import getUniqueId = Commons.getUniqueId;
    import toPrimitive = Commons.toPrimitive;

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

    describe('Check objects equality', () => {
        it('it should return valid objects equality', () => {
            expect(equals(null, null)).toBeTruthy()
            expect(equals({ a: 5, b: 7 }, { a: 5, b: 8 })).toBeFalsy()
            expect(equals({ a: 5, b: 7 }, { a: 5, b: 7 })).toBeTruthy()
        })
    })

    describe('Check object has property', () => {
        it('it should return valid objects property existence', () => {
            expect(hasProperty(null, 'test')).toBeFalsy()
            expect(hasProperty({ a: 5, b: 7 }, 'a')).toBeTruthy()
            expect(hasProperty({ a: 5, b: 7 }, 'c')).toBeFalsy()
        })
    })

    describe('Check object prototype equality', () => {
        it('it should return valid objects prototype equality', () => {
            const left = new Date("2020-02-02T15:56:00")
            const right = new Date("2020-03-02T15:56:00")
            expect(Date['__equals__'](left, right)).toBeFalsy()
            const now = new Date()
            expect(Date['__equals__'](now, now)).toBeTruthy()

            expect(Number['__equals__'](Number(4), 6)).toBeFalsy()
            expect(Number['__equals__'](Number(4), Number(4))).toBeTruthy()
            expect(Number['__equals__'](Number(4), 4)).toBeTruthy()
            expect(Number['__equals__'](4, 4)).toBeTruthy()

            expect(Boolean['__equals__'](false, true)).toBeFalsy()
            expect(Boolean['__equals__'](true, true)).toBeTruthy()
            expect(Boolean['__equals__'](true, Boolean(true))).toBeTruthy()
            expect(Boolean['__equals__'](Boolean(true), Boolean(true))).toBeTruthy()

            expect(String['__equals__']('test', 'test2')).toBeFalsy()
            expect(String['__equals__']('test', 'test')).toBeTruthy()
            expect(String['__equals__']('test', String('test'))).toBeTruthy()
            expect(String['__equals__'](String('test'), String('test'))).toBeTruthy()

            expect(Object['__equals__']({ a: 5, b: 7 }, { a: 6, b: 7 })).toBeFalsy()
            expect(Object['__equals__']({ a: 5, b: 7 }, { a: 5, b: 7 })).toBeTruthy()

            expect(left['eq'](right)).toBeFalsy()
            expect(now['eq'](now)).toBeTruthy()

            expect(Number(4)['eq'](Number(4))).toBeTruthy()
            expect(4['eq'](Number(4))).toBeTruthy()

            expect(true['eq'](true)).toBeTruthy()
            expect(true['eq'](false)).toBeFalsy()
            expect(Boolean(true)['eq'](true)).toBeTruthy()

            expect('test'['eq']('test')).toBeTruthy()
            expect(String('test')['eq']('test2')).toBeFalsy()
            expect(String('test')['eq']('test')).toBeTruthy()

            expect({}['eq']({})).toBeFalsy()
            expect({ a: 5 }['eq']({ a: 6 })).toBeFalsy()
            expect(Object({ a: 5 })['eq']({ a: 5 })).toBeTruthy()
        })
    })

    describe('Check object hash value', () => {
        it('it should return valid object hash value', () => {
            expect(hash(null, 'test')).toEqual('109085beaaa80ac89858b283a64f7c75d7e5bb12')
            expect(hash({ a: 5, b: 7 }, 'a')).toEqual('997a925f54902b8594409d3fa371cef97f36c058')
            expect(hash({ a: 5, b: 7 }, 'c')).toEqual('997a925f54902b8594409d3fa371cef97f36c058')
            expect(hash(4, 'test')).toEqual('8bda89e4a7dda60fb15e052424675a63e28ea574')
        })
    })

    describe('Check object has empty value', () => {
        it('it should return true when object has empty value', () => {
            expect(isEmpty(null)).toBeTruthy()
            expect(isEmpty(undefined)).toBeTruthy()
            expect(isEmpty({})).toBeTruthy()
            expect(isEmpty([])).toBeTruthy()
            expect(isEmpty(0)).toBeFalsy()
            expect(isEmpty('')).toBeTruthy()
            expect(isEmpty(String())).toBeTruthy()
            expect(isEmpty(new Date())).toBeTruthy()

            expect(isEmpty({ a: 5, b: 7 })).toBeFalsy()
            expect(isEmpty(5)).toBeFalsy()
            expect(isEmpty(true)).toBeFalsy()
            expect(isEmpty(() => 5)).toBeFalsy()
            expect(isEmpty('test')).toBeFalsy()
        })
    })

    describe('Check generate unique element identifier', () => {
        it('it should return valid unique element identifier', () => {
            expect(() => getUniqueId(null)).toThrowError(TypeError)
            expect(() => getUniqueId(undefined)).toThrowError(TypeError)

            expect(getUniqueId({})).toEqual('generated-uid-0')
            expect(getUniqueId({})).toEqual('generated-uid-1')
        })
    })

    describe('Check convert to primitive value', () => {
        it('it should return valid primitive value', () => {
            expect(() => toPrimitive(null)).toThrowError(TypeError)
            expect(toPrimitive(undefined)).toEqual(undefined)

            expect(toPrimitive({})).toEqual('')
            expect(toPrimitive({})).toEqual('')
            expect(toPrimitive(5)).toEqual(5)
            expect(toPrimitive(true)).toEqual(true)
            expect(toPrimitive('test')).toEqual('test')
        })
    })
}
