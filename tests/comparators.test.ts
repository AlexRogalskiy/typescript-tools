import {Comparators} from '../src'

export namespace Comparators_Test {
    import compareByOrder = Comparators.compareByOrder
    import compare = Comparators.compare
    import compareByLocale = Comparators.compareByLocale
    import compareIgnoreCase = Comparators.compareIgnoreCase
    import compareByLocaleIgnoreCase = Comparators.compareByLocaleIgnoreCase
    import compareByLength = Comparators.compareByLength
    import compareByPropertyKey = Comparators.compareByPropertyKey
    import compareByPropertyDefault = Comparators.compareByProp
    import compareByProperty = Comparators.compareByProperty
    import compareByPropertyOrder = Comparators.compareByPropertyOrder
    import compareBy = Comparators.compareBy
    import compareByProperties = Comparators.compareByProps
    import compareByLocaleOptions = Comparators.compareByLocaleOptions
    import normalizeAndCompare = Comparators.normalizeAndCompare
    beforeAll(() => {
        console.log('Comparators test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('Comparators test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Comparator', () => {
        it('should compare with default comparator function', () => {
            const comparator = new Comparators.BaseComparator();

            expect(comparator.equal(0, 0)).toBe(true);
            expect(comparator.equal(0, 1)).toBe(false);
            expect(comparator.equal('a', 'a')).toBe(true);
            expect(comparator.lessThan(1, 2)).toBe(true);
            expect(comparator.lessThan(-1, 2)).toBe(true);
            expect(comparator.lessThan('a', 'b')).toBe(true);
            expect(comparator.lessThan('a', 'ab')).toBe(true);
            expect(comparator.lessThan(10, 2)).toBe(false);
            expect(comparator.lessThanOrEqual(10, 2)).toBe(false);
            expect(comparator.lessThanOrEqual(1, 1)).toBe(true);
            expect(comparator.lessThanOrEqual(0, 0)).toBe(true);
            expect(comparator.greaterThan(0, 0)).toBe(false);
            expect(comparator.greaterThan(10, 0)).toBe(true);
            expect(comparator.greaterThanOrEqual(10, 0)).toBe(true);
            expect(comparator.greaterThanOrEqual(10, 10)).toBe(true);
            expect(comparator.greaterThanOrEqual(0, 10)).toBe(false);
        });

        it('should compare with custom comparator function', () => {
            const comparator = new Comparators.BaseComparator<string>((a, b) => {
                if (a.length === b.length) {
                    return 0;
                }

                return a.length < b.length ? -1 : 1;
            });

            expect(comparator.equal('a', 'b')).toBe(true);
            expect(comparator.equal('a', '')).toBe(false);
            expect(comparator.lessThan('b', 'aa')).toBe(true);
            expect(comparator.greaterThanOrEqual('a', 'aa')).toBe(false);
            expect(comparator.greaterThanOrEqual('aa', 'a')).toBe(true);
            expect(comparator.greaterThanOrEqual('a', 'a')).toBe(true);

            comparator.reverse();

            expect(comparator.equal('a', 'b')).toBe(true);
            expect(comparator.equal('a', '')).toBe(false);
            expect(comparator.lessThan('b', 'aa')).toBe(false);
            expect(comparator.greaterThanOrEqual('a', 'aa')).toBe(true);
            expect(comparator.greaterThanOrEqual('aa', 'a')).toBe(false);
            expect(comparator.greaterThanOrEqual('a', 'a')).toBe(true);
        });
    });

    describe('Check string comparison result', () => {
        it('it should return valid result when comparing strings by order', () => {
            expect(compareByOrder(1, 1)).toEqual(0)
            expect(compareByOrder(1, 2)).toEqual(-1)
            expect(compareByOrder(2, 1)).toEqual(1)

            expect(compareByOrder('test', 'test')).toEqual(0)
            expect(compareByOrder('test', 'retest')).toEqual(1)
            expect(compareByOrder('retest', 'test')).toEqual(-1)

            expect(compareByOrder(true, true)).toEqual(0)
            expect(compareByOrder(true, false)).toEqual(1)
            expect(compareByOrder(false, true)).toEqual(-1)
        })

        it('it should return valid result when comparing strings by default', () => {
            expect(compare(1, 1)).toEqual(-0)
            expect(compare(1, 2)).toEqual(-1)
            expect(compare(2, 1)).toEqual(1)

            expect(compare('test', 'test')).toEqual(-0)
            expect(compare('test', 'retest')).toEqual(1)
            expect(compare('retest', 'test')).toEqual(-1)

            expect(compare(true, true)).toEqual(-0)
            expect(compare(true, false)).toEqual(1)
            expect(compare(false, true)).toEqual(-1)
        })

        it('it should return valid result when comparing strings by locale', () => {
            expect(compareByLocale('1', '1')).toEqual(0)
            expect(compareByLocale('1', '2')).toEqual(-1)
            expect(compareByLocale('2', '1')).toEqual(1)

            expect(compareByLocale('test', 'test')).toEqual(0)
            expect(compareByLocale('test', 'retest')).toEqual(1)
            expect(compareByLocale('retest', 'test')).toEqual(-1)

            expect(compareByLocale('true', 'true')).toEqual(0)
            expect(compareByLocale('true', 'false')).toEqual(1)
            expect(compareByLocale('false', 'true')).toEqual(-1)
        })

        it('it should return valid result when comparing strings by ignore case', () => {
            const a = 'Things Work Out Best For Those Who Make The Best Of How Things Work Out.'
            const b = 'Things work out best for those who make the best of how things work out.'
            expect(compareIgnoreCase(a, b)).toEqual(0)

            expect(compareIgnoreCase('1', '1')).toEqual(0)
            expect(compareIgnoreCase('1', '2')).toEqual(-1)
            expect(compareIgnoreCase('2', '1')).toEqual(1)

            expect(compareIgnoreCase('test', 'test')).toEqual(0)
            expect(compareIgnoreCase('test', 'Retest')).toEqual(1)
            expect(compareIgnoreCase('retest', 'test')).toEqual(-1)

            expect(compareIgnoreCase('true', 'True')).toEqual(0)
            expect(compareIgnoreCase('true', 'falsE')).toEqual(1)
            expect(compareIgnoreCase('false', 'true')).toEqual(-1)
        })

        it('it should return valid result when comparing strings with locale ignore case', () => {
            expect(compareByLocaleIgnoreCase('1', '1')).toEqual(0)
            expect(compareByLocaleIgnoreCase('1', '2')).toEqual(-1)
            expect(compareByLocaleIgnoreCase('2', '1')).toEqual(1)

            expect(compareByLocaleIgnoreCase('test', 'tEst')).toEqual(0)
            expect(compareByLocaleIgnoreCase('test', 'retest')).toEqual(1)
            expect(compareByLocaleIgnoreCase('retest', 'test')).toEqual(-1)

            expect(compareByLocaleIgnoreCase('true', 'true')).toEqual(0)
            expect(compareByLocaleIgnoreCase('true', 'false')).toEqual(1)
            expect(compareByLocaleIgnoreCase('false', 'true')).toEqual(-1)
        })

        it('it should return valid result when comparing strings by length', () => {
            expect(compareByLength('1', '1')).toEqual(0)
            expect(compareByLength('1', '21')).toEqual(-1)
            expect(compareByLength('21', '1')).toEqual(1)

            expect(compareByLength('test', 'tEst')).toEqual(0)
            expect(compareByLength('test', 'retest')).toEqual(-1)
            expect(compareByLength('retest', 'test')).toEqual(1)

            expect(compareByLength('true', 'true')).toEqual(0)
            expect(compareByLength('true', 'false')).toEqual(-1)
            expect(compareByLength('false', 'true')).toEqual(1)
        })

        it('it should return valid result when comparing objects by property key', () => {
            const a = { a: 'test' }
            const b = { a: 'retest' }

            expect(compareByPropertyKey('a')(a, a)).toEqual(0)
            expect(compareByPropertyKey('a', compareByOrder)(a, b)).toEqual(1)
            expect(compareByPropertyKey('a', compare)(a, b)).toEqual(1)
            expect(compareByPropertyKey<any>('a', compareByLocale)(a, b)).toEqual(1)
            expect(compareByPropertyKey<any>('a', compareIgnoreCase)(a, b)).toEqual(1)
            expect(compareByPropertyKey<any>('a', compareByLocaleIgnoreCase)(a, b)).toEqual(1)
            expect(compareByPropertyKey<any>('a', compareByLength)(a, b)).toEqual(-1)
        })

        it('it should return valid result when comparing objects by property key with default comparator', () => {
            const a = { a: 'test' }
            const b = { a: 'retest' }

            expect(compareByPropertyDefault('a')(a, a)).toEqual(0)
            expect(compareByPropertyDefault('a')(a, b)).toEqual(1)
            expect(compareByPropertyDefault('a', compareByOrder)(a, b)).toEqual(1)
            expect(compareByPropertyDefault('a', compare)(a, b)).toEqual(1)
            expect(compareByPropertyDefault<any>('a', compareByLocale)(a, b)).toEqual(1)
            expect(compareByPropertyDefault<any>('a', compareIgnoreCase)(a, b)).toEqual(1)
            expect(compareByPropertyDefault<any>('a', compareByLocaleIgnoreCase)(a, b)).toEqual(1)
            expect(compareByPropertyDefault<any>('a', compareByLength)(a, b)).toEqual(-1)
        })

        it('it should return valid result when comparing objects by property', () => {
            const a = { a: 'test' }
            const b = { a: 'retest' }

            expect(compareByProperty(a, a, 'a')).toEqual(0)
            expect(compareByProperty(a, b, 'a')).toEqual(1)
            expect(compareByProperty(a, b, 'a')).toEqual(1)
            expect(compareByProperty(a, b, 'a')).toEqual(1)
            expect(compareByProperty(a, b, 'a')).toEqual(1)
            expect(compareByProperty(a, b, 'a')).toEqual(1)
            expect(compareByProperty(a, b, 'a')).toEqual(1)
            expect(compareByProperty(a, b, 'a')).toEqual(1)
        })

        it('it should return valid result when comparing objects by property order', () => {
            let a = { a: 'test' }
            let b = { a: 'retest' }
            expect(compareByPropertyOrder(a, a, 'a')).toEqual(0)
            expect(compareByPropertyOrder(a, b, 'a')).toEqual(1)
            expect(compareByPropertyOrder(a, b, 'a', 'desc')).toEqual(-1)

            a = { a: 'hello' }
            b = { a: 'world' }
            expect(compareByPropertyOrder(a, b, 'a')).toEqual(-1)
            expect(compareByPropertyOrder(a, b, 'a', 'desc')).toEqual(1)

            a = { a: '12345' }
            b = { a: '54321' }
            expect(compareByPropertyOrder(a, b, 'a')).toEqual(-1)
            expect(compareByPropertyOrder(a, b, 'a', 'desc')).toEqual(1)
        })

        it('it should return valid result when comparing objects by compound comparator', () => {
            const a = 'test'
            const b = 'retest'
            let complexComparator = compareBy(compareByOrder, compareByLength)

            expect(complexComparator(a, a)).toEqual(0)
            expect(complexComparator(a, b)).toEqual(1)

            const a2 = 'tEst'
            const b2 = 'rEtest'
            complexComparator = compareBy(compareByLocaleIgnoreCase, compare)

            expect(complexComparator(a2, a2)).toEqual(0)
            expect(complexComparator(a2, b2)).toEqual(1)
        })

        it('it should return valid result when comparing objects by properties and order mode', () => {
            const a = { a: 'test', b: '12345' }
            const b = { a: 'retest', b: '54321' }

            expect(compareByProperties(a, a, 'asc', 'a')).toEqual(0)
            expect(compareByProperties(a, a, 'desc', 'a')).toEqual(0)

            expect(compareByProperties(a, b, 'desc', 'a')).toEqual(-1)
            expect(compareByProperties(a, b, 'desc', 'b')).toEqual(1)
            expect(compareByProperties(a, b, 'desc', 'b')).toEqual(1)

            const a2 = {
                a: {
                    c: '1',
                    d: Number.MIN_VALUE,
                },
                b: '12345',
            }
            const b2 = {
                a: {
                    c: '',
                    d: 1,
                },
                b: '54321',
            }

            expect(compareByProperties(a2, a2, 'asc', 'a', 'd')).toEqual(0)
            expect(compareByProperties(a2, a2, 'desc', 'a', 'd')).toEqual(0)

            expect(compareByProperties(a2, a2, 'asc', 'a', 'c')).toEqual(0)
            expect(compareByProperties(a2, b2, 'asc', 'a', 'd')).toEqual(-1)
            expect(compareByProperties(a2, b2, 'desc', 'a', 'c')).toEqual(-1)
            expect(compareByProperties(a2, b2, 'desc', 'a', 'd')).toEqual(1)
        })

        it('it should return valid result when comparing objects by locale options', () => {
            const a = 'test'
            const b = 'retest'

            expect(compareByLocaleOptions(a, a)).toEqual(0)
            expect(compareByLocaleOptions(a, b)).toEqual(1)

            const a2 = 'tEst'
            const b2 = 'rEtest'

            expect(compareByLocaleOptions(a2, a2)).toEqual(0)
            expect(compareByLocaleOptions(a2, b2)).toEqual(1)
        })

        it('it should return valid result when comparing strings with normalizing', () => {
            const a = 'abctest'
            const b = 'retestabc'

            expect(normalizeAndCompare(a, a, 'NFC')).toEqual(0)
            expect(normalizeAndCompare(a, b, 'abc')).toEqual(-1)

            const a2 = 'deftEst'
            const b2 = 'rEtestcmp'

            expect(normalizeAndCompare(a2, a2, 'NFD')).toEqual(0)
            expect(normalizeAndCompare(a2, b2, 'cmp')).toEqual(-1)
        })
    })
}
