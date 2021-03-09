import { Arrays } from '../src'

export namespace Arrays_Test {
    import groupBy = Arrays.groupBy;
    import insertAll = Arrays.insertAll;
    import list = Arrays.list;
    import rangeBy = Arrays.rangeBy;
    import findArray = Arrays.findArray;
    import insert = Arrays.insert;

    describe('Check iteration on array of elements', () => {
        it('it should perform valid array iteration', () => {
            let array: any[] = []
            let result = 0
            array['forEachParallel'](v => result += v)
            expect(result).toEqual(0)

            array = [1, 2, 3]
            array['forEachParallel'](v => result += v)
            expect(result).toEqual(6)

            array = []
            result = 0
            array['forEachSequential'](v => result += v)
            expect(result).toEqual(0)

            array = [1, 2, 3]
            array['forEachSequential'](v => result += v)
            expect(result).toEqual(6)
        })
    })

    describe('Check list values from array', () => {
        it('it should perform valid array sequence', () => {
            expect(list(1, 2, 3).join("-")).toEqual('1-2-3')
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
            expect(rangeBy(1, 5, 2).join("-")).toEqual('1-3-5')
            expect(rangeBy(1).join("-")).toEqual('1')
            expect(rangeBy(1, 5).join("-")).toEqual('1-2-3-4-5')
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
            expect(groupBy(array, (i) => i.lastName)).toEqual({
                Smit: [
                    { firstName: 'Daphne', lastName: 'Smit', age: 32 },
                    { firstName: 'Maarten', lastName: 'Smit', age: 30 },
                ],
                'Van Voorst': [{ firstName: 'Matt', lastName: 'Van Voorst', age: 30 }],
            })
        })
        it('it should group an array by property and return a grouped object', () => {
            expect(groupBy(array, (i) => i.age)).toEqual({
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
            expect(insertAll(['a', 'b', 'c', 'd'], 2, 'V', 'W', 'X', 'Y', 'Z').join("-")).toEqual('a-b-V-W-X-Y-Z-c-d')
            expect(insertAll(['a', 'b', 'c', 'd'], 2, 'V', ['W', 'X', 'Y'], 'Z').join("-")).toEqual('a-b-V-W,X,Y-Z-c-d')
            expect(insertAll(['a', 'b', 'c', 'd'], 2, ['X', 'Y', 'Z']).join("-")).toEqual('a-b-X,Y,Z-c-d')
            expect(insertAll(['a', 'b', 'c', 'd'], 2, 'X').join("-")).toEqual('a-b-X-c-d')
            expect(insertAll([], 2, 'X').join("-")).toEqual('X')
        })
    })

    describe('Check array insert operator', () => {
        it('it should perform valid array insertion order', () => {
            expect(insert(1, 2, [1, 2, 3, 4, 5]).join("-")).toEqual('1-2-2-3-4-5')
            expect(insert(0, 2, [1, 2, 3, 4, 5]).join("-")).toEqual('2-1-2-3-4-5')
            expect(insert(5, null, [1, 2, 3, 4, 5]).join("-")).toEqual('1-2-3-4-5-')
            expect(insert(5, null, []).join("-")).toEqual('-----')
            expect(insert(5, undefined, []).join("-")).toEqual('-----')
            expect(insert(-5, 2, []).join("-")).toEqual('')
            expect(insert(0, '2', []).join("-")).toEqual('2')
        })
    })
}
