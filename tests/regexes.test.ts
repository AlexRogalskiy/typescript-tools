import { isValidRegex } from '../src'

export namespace Regexes_Test {
    beforeAll(() => {
        console.log("Regexes test suite started")
        console.time("Execution time took")
    })

    afterAll(() => {
        console.log("Regexes test suite finished")
        console.timeEnd("Execution time took")
    })

    describe('Check regex expression by parameters', () => {
        it('it should return true when passed valid Regex object', () => {
            expect(isValidRegex(new RegExp('development'))).toBe(true)
        })

        it('it should return true when passed valid Regex object with flag', () => {
            expect(isValidRegex(new RegExp('development', 'i'))).toBe(true)
        })

        it('it should return true when passed valid Regex object with multiple flags', () => {
            expect(isValidRegex(new RegExp('development', 'gi'))).toBe(true)
        })

        it('it should return true when passed valid Regex pattern', () => {
            expect(isValidRegex(/development/)).toBe(true)
        })

        it('it should return true when passed valid Regex pattern with flag', () => {
            expect(isValidRegex(/development/i)).toBe(true)
        })

        it('it should return true when passed valid Regex pattern with multiple flags', () => {
            expect(isValidRegex(/development/gi)).toBe(true)
        })

        it('it should return false when passed non-Regex string', () => {
            expect(isValidRegex('development')).toBe(false)
        })

        it('it should return true when passed valid Regex string', () => {
            expect(isValidRegex('/development/')).toBe(true)
        })

        it('it should return true when passed valid complex Regex string', () => {
            expect(isValidRegex('/(epic|feat|fix|chore)/DEV-\\d{4}/i')).toBe(true)
        })

        it('it should return true when passed valid Regex string with flag', () => {
            expect(isValidRegex('/development/i')).toBe(true)
        })

        it('it should return true when passed valid Regex string with multiple flags', () => {
            expect(isValidRegex('/development/ig')).toBe(true)
        })

        it('it should return false when passed Regex string with invalid flag', () => {
            expect(isValidRegex('/development/x')).toBe(false)
        })
    })
}
