import { Checkers, Commons, Objects } from '../src'
import { Pair } from '../typings/general-types'

export namespace Commons_Test {
    import extend = Objects.extend;
    import is = Checkers.is;
    import hash = Commons.hash;

    describe('Check objects extension', () => {
        const obj: Pair<string, string> = { left: '1', right: '3' }
        const obj2 = extend(obj, {
            test: () => 5,
            __hash__: function () {
                return hash(this.left, this.right);
            },
            __equals__: function (obj) {
                return is(obj, Object) && Object['__equals__'](this.left, obj.left) && Object['__equals__'](this.right, obj.right)
            },
        })

        it('it should return valid extended object', () => {
            expect(obj2['__hash__']).toEqual(undefined)
            expect(obj2['__equals__']).toEqual(undefined)
            expect(obj2['test']).toEqual(undefined)
        })
    })
}
