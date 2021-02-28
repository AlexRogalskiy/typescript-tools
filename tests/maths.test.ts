import { Maths } from '../src'

export namespace Maths_Test {
    import Calculations = Maths.Calculations;
    // import getMedian = Maths.Calculations.Algebra.getMedian;

    describe('Check rectangular area calculation', () => {
        const rect = [{ 'x1': 0, 'x2': 2, 'y1': 14, 'y2': 15 }, {
            'x1': 1,
            'x2': 33,
            'y1': 1,
            'y2': 2
        }]

        const rect2 = [{ 'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5 }, {
            'x1': 1,
            'x2': 3,
            'y1': 1,
            'y2': 2
        }, { 'x1': 1.5, 'x2': 3.5, 'y1': 1, 'y2': 2 }]

        const rect3 = [{ 'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5 }, {
            'x1': 0,
            'x2': 2,
            'y1': 1.5,
            'y2': 2.5
        }, { 'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5 }]

        it('it should return valid rectangular area', () => {
            expect(Calculations.Geometry.computeArea(rect)).toEqual(65)
            expect(Calculations.Geometry.computeArea(rect2)).toEqual(8)
            expect(Calculations.Geometry.computeArea(rect3)).toEqual(6)
        })
    })
}
