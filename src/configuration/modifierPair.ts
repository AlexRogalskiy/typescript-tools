export default class ModifierPair {
    readonly openingCharacter: string
    counter = 0
    readonly closingCharacter: string

    constructor(openingCharacter: string, closingCharacter: string, counter?: number) {
        this.openingCharacter = openingCharacter
        this.closingCharacter = closingCharacter

        if (counter !== undefined) {
            this.counter = counter
        }
    }

    Clone(): ModifierPair {
        return new ModifierPair(this.openingCharacter, this.closingCharacter, this.counter)
    }
}
