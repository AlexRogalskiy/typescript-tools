import { Functions } from '../src'

export namespace Commons_Test {
    import curry = Functions.curry;

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
}
