import { Sorting } from '../src'

export namespace Sorting_Test {
    import sortPush = Sorting.sortPush

    const sortFn = (a: number, b: number) => a - b

    beforeAll(() => {
        console.log('Sorting test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('Sorting test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Check sorting push algorithm', () => {
        it('should sort push length=0', () => {
            const a: any[] = []
            const x = -1
            const res = [...a, x].sort(sortFn)

            sortPush(a, x, sortFn)

            expect(a).toEqual(res)
        })

        it('should sort push under', () => {
            const a = [1, 2, 3, 4, 5]
            const x = -1
            const res = [...a, x].sort(sortFn)

            sortPush(a, x, sortFn)

            expect(a).toEqual(res)
        })

        it('should sort push 0', () => {
            const a = [1, 2, 3, 4, 5]
            const x = 1
            const res = [...a, x].sort(sortFn)

            sortPush(a, x, sortFn)

            expect(a).toEqual(res)
        })

        it('should sort push end', () => {
            const a = [1, 2, 3, 4, 5]
            const x = 5
            const res = [...a, x].sort(sortFn)

            sortPush(a, x, sortFn)

            expect(a).toEqual(res)
        })

        it('should sort push over', () => {
            const a = [1, 2, 3, 4, 5]
            const x = 10
            const res = [...a, x].sort(sortFn)

            sortPush(a, x, sortFn)

            expect(a).toEqual(res)
        })

        it('it should replace first element in array', () => {
            const a = [1, 2, 3, 4, 5]
            const x = 10
            const res = [...a, x].sort(sortFn)

            expect(sortPush(a, x, sortFn)).toEqual(res)
        })
    })

    describe('benchmark', () => {
        const n = 200

        const samples = Array.from({ length: 5000 }, () => [
            Math.random(),
            Array.from({ length: n }, () => Math.random()),
        ])
        const s0 = samples.map(([x, arr]: any) => [x, arr.slice()])
        const s1 = samples.map(([x, arr]: any) => [x, arr.slice()])

        it('push + sort', () => {
            for (const [x, arr] of s0) {
                arr.push(x)
                arr.sort(sortFn)
            }
        })
        it('sortPush', () => {
            for (const [x, arr] of s1) {
                sortPush(arr, x, sortFn)
            }
        })
    })
}
