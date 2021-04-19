import { ValidatorMethod } from '../typings/mediator-types'

export default class Validator {
    private validators: ValidatorMethod[]

    constructor(validators: ValidatorMethod[]) {
        this.validators = validators
    }

    isValid(): boolean {
        for (const item of this.validators) {
            if (item() !== true) {
                return false
            }
        }

        return true
    }

    addValidators(validators: ValidatorMethod[]): void {
        this.validators.push(...validators)
    }

    setValidators(validators: ValidatorMethod[]): void {
        this.validators = validators
    }

    getValidators(): ValidatorMethod[] {
        return this.validators
    }
}
