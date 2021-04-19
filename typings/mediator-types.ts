import { Optional } from './standard-types'
// -------------------------------------------------------------------------------------------------
export type ValidatorMethod = () => Optional<boolean>
// -------------------------------------------------------------------------------------------------
export interface Validator {
    /**
     * Returns validation status of all validation methods
     * @returns boolean
     */
    isValid(): boolean

    /**
     * Add validators
     */
    addValidators(validators: ValidatorMethod[]): void

    /**
     * Set validators
     */
    setValidators(validators: ValidatorMethod[]): void

    /**
     * Retrieves all validators
     * @returns ValidatorMethod[]
     */
    getValidators(): ValidatorMethod[]
}
// -------------------------------------------------------------------------------------------------
export interface Storage {
    /**
     * Retrieves storage item
     * @param key - item identifier
     * @returns string | null
     */
    getItem(key: string): Optional<string>

    /**
     * Sets storage item
     * @param key - item identifier
     * @param value - item value
     */
    setItem(key: string, value: string): void

    /**
     * Removes storage item completely
     * @param key - item identifier
     */
    removeItem(key: string): void
}
// -------------------------------------------------------------------------------------------------
export interface State {
    state: any

    /**
     * Retrieves state
     */
    getState(): any
}
// -------------------------------------------------------------------------------------------------
