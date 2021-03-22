import { Files } from '../src'

export namespace Files_Test {
    import isFolderNameValid = Files.isFolderNameValid
    import isFolderPathnameValid = Files.isFolderPathnameValid
    import isValidFile = Files.isValidFile

    beforeAll(() => {
        console.log('Files test suite started')
        console.time('Execution time took')
    })

    afterAll(() => {
        console.log('Files test suite finished')
        console.timeEnd('Execution time took')
    })

    describe('Check file by types', () => {
        it('it should return true when file type is valid, false - otherwise', () => {
            expect(isValidFile('./package.json')).toBeTruthy()
            expect(isValidFile('./tsconfig.json')).toBeTruthy()

            expect(isValidFile('./README.md', '.md')).toBeTruthy()

            expect(isValidFile('./LICENSE')).toBeFalsy()
        })
    })

    describe('Check folder name supported symbols', () => {
        it('returns false when invalid(including invalid characters)', () => {
            const result = isFolderNameValid('/not/valid')

            expect(result).toBe(false)
        })

        it('returns false when invalid(empty)', () => {
            const result = isFolderNameValid('')

            expect(result).toBe(false)
        })

        it('returns true when valid', () => {
            const result = isFolderNameValid('valid')

            expect(result).toBe(true)
        })
    })

    describe('Check folder name path supported symbols', () => {
        it('returns false when invalid(empty)', () => {
            const result = isFolderPathnameValid('')

            expect(result).toBe(false)
        })

        it('returns false when invalid(double slash)', () => {
            const result = isFolderPathnameValid('/not//valid')

            expect(result).toBe(false)
        })

        it('returns false when invalid(invalid folder name)', () => {
            const result = isFolderPathnameValid('/not?valid')

            expect(result).toBe(false)
        })

        it('returns false when invalid(relative pathname)', () => {
            const result = isFolderPathnameValid('not/valid')

            expect(result).toBe(false)
        })

        it('returns true when valid', () => {
            const result = isFolderPathnameValid('/valid')

            expect(result).toBe(true)
        })
    })
}
