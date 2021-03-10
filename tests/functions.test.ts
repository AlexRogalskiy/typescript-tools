import { Functions } from '../src'

export namespace Commons_Test {
    import curry = Functions.curry;
    import polymorph = Functions.polymorph;
    import autoCurry = Functions.autoCurry;
    import getFunctionArgs = Functions.getFunctionArgs;
    import mergeProps = Functions.mergeProps;
    import extend = Functions.extend;

    beforeAll(() => {
        console.log("Functions test suite started")
        console.time("Execution time took")
    })

    afterAll(() => {
        console.log("Functions test suite finished")
        console.timeEnd("Execution time took")
    })

    const sequence = (start: number, end: number): number[] => {
        const result: number[] = []

        for (let i = start; i <= end; i++) {
            result.push(i)
        }

        return result
    }

    describe('Check function curry operation', () => {
        it('it should perform valid curry operation', () => {
            const fn = curry(sequence, 1)

            expect(fn(5).join('-')).toEqual('1-2-3-4-5')
            expect(fn(2).join('-')).toEqual('1-2')
            expect(fn(1).join('-')).toEqual('1')
            expect(fn(10).join('-')).toEqual('1-2-3-4-5-6-7-8-9-10')
        })
    })

    describe('Check polymorph function', () => {
        it('it should return valid value when passed variable number of arguments', () => {
            expect(polymorph((v) => v, (v1, v2) => v1 + v2, (v1, v2, v3) => v1 + v2 + v3)(1, 2)).toEqual(3)
            expect(polymorph((v) => v, (v1, v2) => v1 + v2, (v1, v2, v3) => v1 + v2 + v3)(1, 2, 3)).toEqual(6)
            expect(polymorph((v) => v, (v1, v2) => v1 + v2)(1)).toEqual(1)

            expect(() => polymorph((v) => v, (v1, v2) => v1 + v2)(1, 2, 3)).toThrowError(TypeError)

            const getRectangleArea = polymorph(
                (width, height): number => width * height,
                (x1, y1, x2, y2): number => (x2 - x1) * (y2 - y1)
            )
            expect(getRectangleArea(1, 2)).toEqual(2)
            expect(getRectangleArea(1, 2, 3, 4)).toEqual(4)

            const getStringArgs = polymorph(
                (a: any, b: any, c: any): string => `Three arguments: a=${a}, b=${b}, c=${c}`,
                (ind: number, str: string): string => `Number ${ind} and string ${str}`,
                (regex: string | RegExp, value: any): string => `RegExp ${regex} and value ${value} passed`,
                (fn: Function, bool: boolean): string => `Function ${fn} and boolean ${bool} passed`,
                (fn: Function, ind: number): string => `Function ${fn} and number ${ind} passed`
            )
            expect(getStringArgs(1, 2, 3)).toEqual("Three arguments: a=1, b=2, c=3")
            expect(getStringArgs(1, "qq")).toEqual("Function 1 and number qq passed")
            expect(getStringArgs(() => 5, true)).toEqual("Function () => 5 and number true passed")
            expect(getStringArgs(RegExp('a'), () => 5)).toEqual("Function /a/ and number () => 5 passed")
            expect(getStringArgs(() => 5, 1)).toEqual("Function () => 5 and number 1 passed")
            expect(getStringArgs(/a/, 1)).toEqual("Function /a/ and number 1 passed")
            expect(getStringArgs(/a/, "str")).toEqual("Function /a/ and number str passed")
        })
    })

    describe('Check auto curry operation', () => {
        it('it should perform valid auto curry operation', () => {
            const fn = (a, b) => a + b
            const auto = autoCurry(fn, 3)

            expect(auto(2, 2)(3)).toEqual(5)
        })
    })

    describe('Check auto curry operation', () => {
        it('it should perform valid auto curry operation', () => {
            const fn = (a, b) => a + b
            const auto = autoCurry(fn, 3)

            expect(auto(2, 2)(3)).toEqual(5)
        })
    })

    describe('Check object properties extension', () => {
        it('it should return valid object with source/target properties', () => {
            expect(extend({ a: 4, b: 5 }, { a: 4, b: 6 })).toEqual({ "a": 4, "b": 6 })
            expect(extend({ a: 4, b: 5, c: [] }, { a: 4, b: 6, c: [1, 2, 3] })).toEqual({
                "a": 4,
                "b": 6,
                "c": [1, 2, 3]
            })
            expect(extend({ a: 4, b: 5, c: [1, 2, 4, null] }, {
                a: 4,
                b: 6,
                c: [undefined, 1, 2, 3]
            })).toEqual({ "a": 4, "b": 6, "c": [undefined, 1, 2, 3] })
            expect(extend({}, {})).toEqual({})
        })
    })

    describe('Check objects merge operation', () => {
        it('it should return valid object with merge properties', () => {
            expect(mergeProps({ a: 4, b: 5 }, { a: 4, b: 6 })).toEqual({ a: 4, b: 6 })
            expect(mergeProps({ a: 4, b: 5, c: [] }, { a: 4, b: 6, c: [1, 2, 3] })).toEqual({
                a: 4,
                b: 6,
                c: [1, 2, 3]
            })
            expect(mergeProps({ a: 4, b: 5, c: [1, 2, 4, null] }, {
                a: 4,
                b: 6,
                c: [undefined, 1, 2, 3]
            })).toEqual({
                a: 4,
                b: 6,
                c: [1, 2, 4, null, undefined, 3]
            })
            expect(mergeProps({}, {})).toEqual({})
        })
    })

    describe('Check get function arguments', () => {
        it('it should return valid function arguments', () => {
            function test(arg1, arg2, arg3) {
                return arg1 + arg2 + arg3
            }

            expect(getFunctionArgs(() => 5)).toEqual([])
            expect(getFunctionArgs(test).join('-')).toEqual('arg1-arg2-arg3')
            expect(getFunctionArgs((a, b) => a + b)).toEqual(["a", "b"])
            expect(getFunctionArgs((a: string) => a)).toEqual(["a"])
            expect(getFunctionArgs((a: string, b, c: string) => a + b + c)).toEqual(["a", "b", "c"])
        })
    })
}
