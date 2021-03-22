import { Maths } from '../src'

export namespace Maths_Test {
    export namespace Calculations_Test {
        export namespace Geometry_Test {
            import Calculations = Maths.Calculations

            beforeAll(() => {
                console.log('Geometry test suite started')
                console.time('Execution time took')
            })

            afterAll(() => {
                console.log('Geometry test suite finished')
                console.timeEnd('Execution time took')
            })

            describe('Check rectangular area calculation', () => {
                const rect = [
                    { x1: 0, x2: 2, y1: 14, y2: 15 },
                    {
                        x1: 1,
                        x2: 33,
                        y1: 1,
                        y2: 2,
                    },
                ]

                const rect2 = [
                    { x1: 0, x2: 2, y1: 1.5, y2: 2.5 },
                    {
                        x1: 1,
                        x2: 3,
                        y1: 1,
                        y2: 2,
                    },
                    { x1: 1.5, x2: 3.5, y1: 1, y2: 2 },
                ]

                const rect3 = [
                    { x1: 0, x2: 2, y1: 1.5, y2: 2.5 },
                    {
                        x1: 0,
                        x2: 2,
                        y1: 1.5,
                        y2: 2.5,
                    },
                    { x1: 0, x2: 2, y1: 1.5, y2: 2.5 },
                ]

                it('it should return valid rectangular area', () => {
                    expect(Calculations.Geometry.computeArea(rect)).toEqual(65)
                    expect(Calculations.Geometry.computeArea(rect2)).toEqual(8)
                    expect(Calculations.Geometry.computeArea(rect3)).toEqual(6)
                })
            })

            describe('Check if triangle is squared', () => {
                it('it should return valid squared triangle', () => {
                    expect(
                        Calculations.Geometry.isTriangleSquared([
                            [3, 7],
                            [5, 9],
                            [8, 6],
                        ]),
                    ).toBeTruthy()
                    expect(
                        Calculations.Geometry.isTriangleSquared([
                            [6, 14],
                            [10, 18],
                            [16, 12],
                        ]),
                    ).toBeTruthy()
                })
            })

            describe('Check circle radius in a triangle', () => {
                it('it should return valid inner circle radius of triangle', () => {
                    expect(Calculations.Geometry.getInnerCircleRadius(30, 30, 30)).toEqual(8)
                    expect(Calculations.Geometry.getInnerCircleRadius(1, 4, 6)).toEqual(NaN)
                })

                it('it should return valid outer circle radius of triangle', () => {
                    expect(Calculations.Geometry.getOuterCircleRadius(30, 30, 30)).toEqual(17)
                    expect(Calculations.Geometry.getOuterCircleRadius(1, 4, 6)).toEqual(NaN)
                })
            })
        }

        export namespace Algebra_Test {
            import Calculations = Maths.Calculations

            beforeAll(() => {
                console.log('Algebra test suite started')
                console.time('Execution time took')
            })

            afterAll(() => {
                console.log('Algebra test suite finished')
                console.timeEnd('Execution time took')
            })

            describe('Check greatest common divisor calculation', () => {
                it('it should return valid GCD', () => {
                    expect(Calculations.Algebra.gcd(7, 10)).toEqual(1)
                    expect(Calculations.Algebra.gcd(16, 2)).toEqual(2)
                    expect(Calculations.Algebra.gcd(256, 4)).toEqual(4)
                    expect(Calculations.Algebra.gcd(256, 64)).toEqual(64)

                    expect(Calculations.Algebra.gcd2(7, 10)).toEqual(1)
                    expect(Calculations.Algebra.gcd2(16, 2)).toEqual(2)
                    expect(Calculations.Algebra.gcd2(256, 4)).toEqual(4)
                    expect(Calculations.Algebra.gcd2(256, 64)).toEqual(64)

                    expect(Calculations.Algebra.gcd3(7, 10)).toEqual(1)
                    expect(Calculations.Algebra.gcd3(16, 2)).toEqual(2)
                    expect(Calculations.Algebra.gcd3(256, 4)).toEqual(4)
                    expect(Calculations.Algebra.gcd3(256, 64)).toEqual(64)
                })
            })

            describe('Check power calculation', () => {
                it('it should return valid power', () => {
                    expect(Calculations.Algebra.power(3, 7)).toEqual(2187)
                    expect(Calculations.Algebra.power(2, 5)).toEqual(32)
                    expect(Calculations.Algebra.power(2, 10)).toEqual(1024)
                    expect(Calculations.Algebra.power(1, 2)).toEqual(1)
                })
            })
        }

        export namespace Trigonometry_Test {
            import Calculations = Maths.Calculations

            beforeAll(() => {
                console.log('Trigonometry test suite started')
                console.time('Execution time took')
            })

            afterAll(() => {
                console.log('Trigonometry test suite finished')
                console.timeEnd('Execution time took')
            })

            describe('Check triangle square calculation', () => {
                it('it should return valid triangle square', () => {
                    expect(Calculations.Trigonometry.log10(100)).toEqual(2)
                    expect(Calculations.Trigonometry.log10(1000)).toEqual(3)
                })
            })
        }

        export namespace Areas_Test {
            import Calculations = Maths.Calculations

            beforeAll(() => {
                console.log('Areas test suite started')
                console.time('Execution time took')
            })

            afterAll(() => {
                console.log('Areas test suite finished')
                console.timeEnd('Execution time took')
            })

            describe('Check triangle square calculation', () => {
                it('it should return valid triangle square', () => {
                    expect(
                        Calculations.Areas.triangleSquare([
                            [3, 7],
                            [5, 9],
                            [8, 6],
                        ]),
                    ).toEqual(6)
                    expect(
                        Calculations.Areas.triangleSquare([
                            [6, 14],
                            [10, 18],
                            [16, 12],
                        ]),
                    ).toEqual(24)
                })
            })
        }

        export namespace Helpers_Test {
            import sum = Maths.Helpers.sum

            beforeAll(() => {
                console.log('Helpers test suite started')
                console.time('Execution time took')
            })

            afterAll(() => {
                console.log('Helpers test suite finished')
                console.timeEnd('Execution time took')
            })

            describe('Check sum calculation by input values', () => {
                it('it should calculate valid sum', () => {
                    expect(sum(3, 7)).toEqual(10)
                    expect(sum(6, 14, 15, 45)).toEqual(80)
                    expect(sum(6, 1, 4, 1, 5, 4, 5)).toEqual(26)
                })
            })
        }

        export namespace Numerals_Test {
            import Numerals = Maths.Numerals

            beforeAll(() => {
                console.log('Numerals test suite started')
                console.time('Execution time took')
            })

            afterAll(() => {
                console.log('Numerals test suite finished')
                console.timeEnd('Execution time took')
            })

            describe('Check fibonacci calculation', () => {
                it('it should return a valid fibonacci number', () => {
                    expect(Numerals.fibonacci2(3)).toEqual(2)
                    expect(Numerals.fibonacci2(5)).toEqual(5)
                    expect(Numerals.fibonacci2(14)).toEqual(377)

                    expect(Numerals.fibonacci3(3)).toEqual([1, 2, 3])
                    expect(Numerals.fibonacci3(5)).toEqual([1, 2, 3, 5, 8])
                    expect(Numerals.fibonacci3(14)).toEqual([
                        1,
                        2,
                        3,
                        5,
                        8,
                        13,
                        21,
                        34,
                        55,
                        89,
                        144,
                        233,
                        377,
                        610,
                    ])

                    expect(Numerals.fibonacci4(3)).toEqual([0, 1, 1])
                    expect(Numerals.fibonacci4(5)).toEqual([0, 1, 1, 2, 3])
                    expect(Numerals.fibonacci4(14)).toEqual([
                        0,
                        1,
                        1,
                        2,
                        3,
                        5,
                        8,
                        13,
                        21,
                        34,
                        55,
                        89,
                        144,
                        233,
                    ])
                })
            })

            describe('Check factorial calculation', () => {
                it('it should return a valid factorial number', () => {
                    expect(Numerals.factfact(3)).toEqual(6)
                    expect(Numerals.factfact(5)).toEqual(120)
                    expect(Numerals.factfact(14)).toEqual(87178291200)

                    expect(Numerals.factorial(3)).toEqual(6)
                    expect(Numerals.factorial(5)).toEqual(120)
                    expect(Numerals.factorial(14)).toEqual(87178291200)

                    expect(Numerals.factorial2(3)).toEqual(6)
                    expect(Numerals.factorial2(5)).toEqual(120)
                    expect(Numerals.factorial2(14)).toEqual(87178291200)

                    expect(Numerals.factorial3(3)).toEqual([6, 2, 1])
                    expect(Numerals.factorial3(5)).toEqual([120, 24, 6, 2, 1])
                    expect(Numerals.factorial3(14)).toEqual([
                        87178291200,
                        6227020800,
                        479001600,
                        39916800,
                        3628800,
                        362880,
                        40320,
                        5040,
                        720,
                        120,
                        24,
                        6,
                        2,
                        1,
                    ])

                    expect(Numerals.factorial4(3)).toEqual(6)
                    expect(Numerals.factorial4(5)).toEqual(120)
                    expect(Numerals.factorial4(14)).toEqual(87178291200)

                    expect(Numerals.factorial5(3)).toEqual(6)
                    expect(Numerals.factorial5(5)).toEqual(120)
                    expect(Numerals.factorial5(14)).toEqual(87178291200)
                })
            })
        }
    }
}
