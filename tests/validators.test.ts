import { describe, test } from '@jest/globals'

import { Validators } from '../src'

export namespace Validators_Test {

    describe("Test string validators", () => {
        test('it should be a valid zip/code property',
            async () => {
                // sample data
                const strings = ['Hello', '98052', '101']

                // collection of validators to use
                const validators: { [s: string]: Validators.StringValidator } = {}
                validators['ZIP code'] = new Validators.ZipCodeValidator()
                validators['Letters only'] = new Validators.LettersOnlyValidator()

                // Show whether each string passed each validator
                for (const s of strings) {
                    for (const name in validators) {
                        console.log(`"${s}" - ${validators[name].isAcceptable(s) ? 'matches' : 'does not match'} ${name}`)
                    }
                }
            }
        )
    })
}
