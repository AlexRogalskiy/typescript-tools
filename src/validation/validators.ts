export namespace Validators {
    export interface StringValidator {
        isAcceptable(value: string): boolean
    }

    const lettersRegexp = /^[A-Za-z]+$/
    const numberRegexp = /^[0-9]+$/

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(value: string): boolean {
            return lettersRegexp.test(value)
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(value: string): boolean {
            return value.length === 5 && numberRegexp.test(value)
        }
    }
}
