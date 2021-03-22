import { Checkers, Commons, Objects } from '../src'
import { StringPair } from '../typings/general-types'

export namespace Objects_Test {
    import extend = Objects.extend
    import hash = Commons.hash
    import isObject = Checkers.isObject

    beforeAll(() => {
        console.log('Objects test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('Objects test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Check objects extension by object call', () => {
        const obj: StringPair = { left: '1', right: '3' }
        const obj2 = Object['__extends__'](obj, {
            test: () => 5,
            __hash__: function () {
                return hash(this.left, this.right)
            },
            __equals__: function (obj) {
                return (
                    isObject(obj) &&
                    Object['__equals__'](this.left, obj.left) &&
                    Object['__equals__'](this.right, obj.right)
                )
            },
        })

        it('it should return valid extended object', () => {
            expect(obj2['__hash__']()).toEqual('1aee48a1ce9885851ed10b486ed333ee181944db')
            expect(obj2['__equals__'](obj2)).toBeTruthy()
            expect(obj2['test']()).toEqual(5)
        })
    })

    describe('Check objects extension by function call', () => {
        const obj: StringPair = { left: '1', right: '3' }
        const obj2 = extend(obj, {
            test: () => 5,
            __hash__: function () {
                return hash(this.left, this.right)
            },
            __equals__: function (obj) {
                return (
                    isObject(obj) &&
                    Object['__equals__'](this.left, obj.left) &&
                    Object['__equals__'](this.right, obj.right)
                )
            },
        })

        it('it should return valid extended object', () => {
            expect(obj2['__hash__']()).toEqual('1aee48a1ce9885851ed10b486ed333ee181944db')
            expect(obj2['__equals__'](obj2)).toBeTruthy()
            expect(obj2['test']()).toEqual(5)
        })
    })
}
