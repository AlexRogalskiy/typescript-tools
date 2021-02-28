import { Arrays } from '../src'

export namespace Arrays_Test {
    import groupBy = Arrays.groupBy;
    import insert = Arrays.insert;
    import list = Arrays.list;
    import rangeBy = Arrays.rangeBy;
    import findArray = Arrays.findArray;

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

    describe('Check insert values into array', () => {
        it('it should perform valid array sequence', () => {
            expect(insert(['a', 'b', 'c', 'd'], 2, 'V', 'W', 'X', 'Y', 'Z').join("-")).toEqual('a-b-V-W-X-Y-Z-c-d')
            expect(insert(['a', 'b', 'c', 'd'], 2, 'V', ['W', 'X', 'Y'], 'Z').join("-")).toEqual('a-b-V-W,X,Y-Z-c-d')
            expect(insert(['a', 'b', 'c', 'd'], 2, ['X', 'Y', 'Z']).join("-")).toEqual('a-b-X,Y,Z-c-d')
            expect(insert(['a', 'b', 'c', 'd'], 2, 'X').join("-")).toEqual('a-b-X-c-d')
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
}
