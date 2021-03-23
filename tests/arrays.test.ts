import { Arrays } from '../src'

export namespace Arrays_Test {
    import groupBy = Arrays.groupBy
    import insertAll = Arrays.insertAll
    import list = Arrays.list
    import rangeBy = Arrays.rangeBy
    import findArray = Arrays.findArray
    import insert = Arrays.insert
    import range = Arrays.range
    import randomElement = Arrays.randomElement
    import sortByNumber = Arrays.sortByNumber
    import sortByString = Arrays.sortByString
    import trimNulls = Arrays.trimNulls

    beforeAll(() => {
        console.log('Arrays test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('Arrays test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Check index of element in array', () => {
        it('it should return index of element in array', () => {
            expect(Array['__index__']([0, 1, 2, 2, 3, 4, 6], 3)).toEqual(4)
            expect(Array['__index__']([0, 1, 2, 2, 3, 4, 6], 4)).toEqual(5)
            expect(Array['__index__']([0, 1, 2, 2, 3, 4, 6], 7)).toEqual(-1)
            expect(Array['__index__']([], 7)).toEqual(-1)

            expect([0, 1, 2, 2, 3, 4, 6]['index'](3)).toEqual(4)
            expect([0, 1, 2, 2, 3, 4, 6]['index'](4)).toEqual(5)
            expect([0, 1, 2, 2, 3, 4, 6]['index'](7)).toEqual(-1)
            expect([]['index'](7)).toEqual(-1)
        })
    })

    describe('Check iteration on array of elements', () => {
        it('it should perform valid array iteration', () => {
            let array: any[] = []
            let result = 0
            array['forEachParallel'](v => (result += v))
            expect(result).toEqual(0)

            array = [1, 2, 3]
            array['forEachParallel'](v => (result += v))
            expect(result).toEqual(6)

            array = []
            result = 0
            array['forEachSequential'](v => (result += v))
            expect(result).toEqual(0)

            array = [1, 2, 3]
            array['forEachSequential'](v => (result += v))
            expect(result).toEqual(6)
        })
    })

    describe('Check listing values from array', () => {
        it('it should return valid array sequence', () => {
            expect(list(1, 2, 3).join('-')).toEqual('1-2-3')
        })
    })

    describe('Check trimming null values from array', () => {
        it('it should return valid array with non-nullable items', () => {
            expect(trimNulls([null, null, 1, 2])).toEqual({
                deleted: 2,
                result: [1, 2],
            })
            expect(trimNulls([1, 2])).toEqual({
                deleted: 0,
                result: [1, 2],
            })
        })
    })

    describe('Check unique values from array', () => {
        it('it should return valid array with unique elements', () => {
            expect([1, 2, 3]['unique']()).toEqual([1, 2, 3])
            expect([1, 2, 3, 4, 3]['unique']()).toEqual([1, 2, 3, 4])
            expect([]['unique']()).toEqual([])
            expect([1, 'a', 'c', null, undefined, null, '1', 1]['unique']()).toEqual([
                1,
                'a',
                'c',
                null,
                undefined,
                '1',
            ])
        })
    })

    describe('Check array by range values generator', () => {
        it('it should return valid array with generated elements', () => {
            expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9])
            expect(range(5, 10, 1)).toEqual([5, 6, 7, 8, 9, 10])
            expect(range(1, 10, -2)).toEqual([])
            expect(range(1, 0, 2)).toEqual([])
        })
    })

    describe('Check random element from array', () => {
        it('it should return random element from array', () => {
            expect(randomElement([1])).toEqual(1)
            expect(randomElement([])).toEqual(undefined)

            let array = [1, 10, 2]
            let elem = randomElement(array)
            expect(array).toContain(elem)

            array = [5, 10, 1]
            elem = randomElement(array)
            expect(array).toContain(elem)
        })
    })

    describe('Check find subarray index in sequence of elements', () => {
        it('it should perform valid subarray index', () => {
            expect(findArray([1, 2, 3, 4, 5], [4, 5])).toEqual(3)
            expect(findArray([1, 2, 3, 4, 5], [5, 5])).toEqual(-1)
            expect(findArray([1, 2, 3, 4, 5], [1, 4])).toEqual(-1)
            expect(findArray([1, 2, 3, 4, 5], [2, 4])).toEqual(-1)
            expect(findArray([1, 2, 3, 4, 5], [2, 3, 4])).toEqual(1)
            expect(findArray([1, 2, 3, 4, 5], [3, 4])).toEqual(2)
            expect(findArray([1, 2, 3, 4, 5], [5])).toEqual(4)
            expect(findArray([1, 2, 3, 4, 5], [0])).toEqual(-1)
            expect(findArray([1, 2, 3, 4, 5], [3, 3])).toEqual(-1)
        })
    })

    describe('Check array range generator', () => {
        it('it should perform valid array range', () => {
            expect(rangeBy(1, 5, 2).join('-')).toEqual('1-3-5')
            expect(rangeBy(1).join('-')).toEqual('1')
            expect(rangeBy(1, 5).join('-')).toEqual('1-2-3-4-5')
        })
    })

    describe('Check object array sort by property number value', () => {
        it('it should perform valid object sort order by string property', () => {
            expect(sortByNumber([{ a: 1 }, { a: 3 }, { a: 0 }, { a: 10 }], 'a')).toEqual([
                { a: 0 },
                { a: 1 },
                { a: 3 },
                { a: 10 },
            ])
            expect(sortByNumber([{ b: 1, c: 2 }], 'a')).toEqual([{ b: 1, c: 2 }])
            expect(sortByNumber([{ c: 5 }, { c: 0 }], 'c')).toEqual([{ c: 0 }, { c: 5 }])
            expect(sortByNumber([{ c: 5 }, { c: 0 }], 'cc')).toEqual([{ c: 5 }, { c: 0 }])
            expect(sortByNumber([], 'c')).toEqual([])
        })
    })

    describe('Check object array sort by property string value', () => {
        it('it should perform valid object sort order by number property', () => {
            expect(sortByString([{ a: 'fddf' }, { a: 'daasdf' }, { a: 'dfdf' }, { a: 'ddf' }], 'a')).toEqual([
                { a: 'daasdf' },
                { a: 'ddf' },
                { a: 'dfdf' },
                { a: 'fddf' },
            ])
            expect(sortByString([{ b: 'dfa', c: 'dfadd' }], 'a')).toEqual([
                {
                    b: 'dfa',
                    c: 'dfadd',
                },
            ])
            expect(sortByString([{ c: 'ddf' }, { c: 'ddfa' }], 'c')).toEqual([{ c: 'ddf' }, { c: 'ddfa' }])
            expect(sortByString([], 'ccddf')).toEqual([])

            expect(() => sortByString([{ c: 'ddf' }, { c: 'ddfa' }], 'cc')).toThrow(TypeError)
        })
    })

    describe('Check groupBy by array', () => {
        const array = [
            {
                firstName: 'Daphne',
                lastName: 'Smit',
                age: 32,
            },
            {
                firstName: 'Matt',
                lastName: 'Van Voorst',
                age: 30,
            },
            {
                firstName: 'Maarten',
                lastName: 'Smit',
                age: 30,
            },
        ]

        it('it should group an array by property and return a grouped object', () => {
            expect(groupBy(array, i => i.lastName)).toEqual({
                'Smit': [
                    { firstName: 'Daphne', lastName: 'Smit', age: 32 },
                    { firstName: 'Maarten', lastName: 'Smit', age: 30 },
                ],
                'Van Voorst': [{ firstName: 'Matt', lastName: 'Van Voorst', age: 30 }],
            })
        })
        it('it should group an array by property and return a grouped object', () => {
            expect(groupBy(array, i => i.age)).toEqual({
                '30': [
                    { firstName: 'Matt', lastName: 'Van Voorst', age: 30 },
                    { firstName: 'Maarten', lastName: 'Smit', age: 30 },
                ],
                '32': [{ firstName: 'Daphne', lastName: 'Smit', age: 32 }],
            })
        })
    })

    describe('Check insert values into array', () => {
        it('it should perform valid array sequence', () => {
            expect(insertAll(['a', 'b', 'c', 'd'], 2, 'V', 'W', 'X', 'Y', 'Z').join('-')).toEqual(
                'a-b-V-W-X-Y-Z-c-d',
            )
            expect(insertAll(['a', 'b', 'c', 'd'], 2, 'V', ['W', 'X', 'Y'], 'Z').join('-')).toEqual(
                'a-b-V-W,X,Y-Z-c-d',
            )
            expect(insertAll(['a', 'b', 'c', 'd'], 2, ['X', 'Y', 'Z']).join('-')).toEqual('a-b-X,Y,Z-c-d')
            expect(insertAll(['a', 'b', 'c', 'd'], 2, 'X').join('-')).toEqual('a-b-X-c-d')
            expect(insertAll([], 2, 'X').join('-')).toEqual('X')
        })
    })

    describe('Check array insert operator', () => {
        it('it should perform valid array insertion order', () => {
            expect(insert(1, 2, [1, 2, 3, 4, 5]).join('-')).toEqual('1-2-2-3-4-5')
            expect(insert(0, 2, [1, 2, 3, 4, 5]).join('-')).toEqual('2-1-2-3-4-5')
            expect(insert(5, null, [1, 2, 3, 4, 5]).join('-')).toEqual('1-2-3-4-5-')
            expect(insert(5, null, []).join('-')).toEqual('-----')
            expect(insert(5, undefined, []).join('-')).toEqual('-----')
            expect(insert(-5, 2, []).join('-')).toEqual('')
            expect(insert(0, '2', []).join('-')).toEqual('2')
        })
    })
}
