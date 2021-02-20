import { describe, expect } from '@jest/globals'

import { Arrays } from '../src'

export namespace Numbers_Test {
    import average = Arrays.average

    describe('Check average of array elements', () => {
        const array = [6, 3, 8, 2, 3, 2]
        it('if should calculate the average of a number array', () => {
            expect(average(array)).toEqual(4)
        })
    })
}
