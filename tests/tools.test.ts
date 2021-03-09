import { describe, test } from '@jest/globals'

import { StringBuilder } from '../tools/stringbuilder'
import { Point } from '../tools/point'

export namespace Tools_Test {

    export namespace StringBuilder_Test {
        beforeAll(() => {
            console.log("StringBuilder test suite started")
            console.time("Execution time took")
        })

        afterAll(() => {
            console.log("StringBuilder test suite finished")
            console.timeEnd("Execution time took")
        })

        describe("Test string builder methods", () => {
            test('it should be a valid result string', () => {
                const sb = new StringBuilder()
                expect(sb + '').toEqual('')

                sb.add('hello').add(', ').add('world')
                expect(sb + '').toEqual('hello, world')

                sb.reset()
                expect(StringBuilder.add('abc') + '').toEqual('abc')

                sb.reset()

                StringBuilder.add('abc')
                StringBuilder.add(' ')
                StringBuilder.add('def')
                StringBuilder.add(' ')

                expect(StringBuilder.add('cat') + ' === ' + 'abc def cat').toEqual('abc def cat === abc def cat')

                expect(sb.toString()).toEqual('abc def cat')
                expect(sb).toEqual({ "data": "abc def cat" })
                expect(sb.valueOf()).toEqual('abc def cat')
            })
        })
    }

    export namespace Point_Test {
        beforeAll(() => {
            console.log("Point test suite started")
            console.time("Execution time took")
        })

        afterAll(() => {
            console.log("Point test suite finished")
            console.timeEnd("Execution time took")
        })

        describe("Test point methods", () => {
            test('it should be a valid point coordinates', () => {
                const point = new Point(1, 2)

                expect(point).toEqual({ "subscribers": {}, "x": 1, "y": 2 })
                expect(point.toString()).toEqual('(x: 1, y: 2)')

                expect(point.getX()).toEqual(1)
                expect(point.getY()).toEqual(2)
                expect(point.length().toFixed(3)).toEqual('2.236')

                const point2 = new Point(2, 2)
                point2['_'] = new Point(1, 2).valueOf() + new Point(3, 4).valueOf() + new Point(5, 6).valueOf()
                expect(point2.toString()).toEqual('(x: 11, y: 14)')

                point2['_'] = new Point(1, 2).valueOf() * new Point(3, 4).valueOf() * new Point(5, 6).valueOf()
                expect(point2.toString()).toEqual('(x: 20, y: 26)')
            })
        })
    }
}
