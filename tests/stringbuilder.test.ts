import { describe, test } from '@jest/globals'
import { StringBuilder } from '../tools/stringbuilder'

export namespace StringBuilder_Test {

    describe("Test string builder", () => {
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
        })
    })
}
