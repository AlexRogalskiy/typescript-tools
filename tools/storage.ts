import { Optional } from '../typings/standard-types'

export default class LocalStorage {
    private readonly storage = localStorage

    getItem(key: string): Optional<string> {
        return this.storage.getItem(key)
    }

    setItem(key: string, value: string): void {
        return this.storage.setItem(key, value)
    }

    removeItem(key: string): void {
        return this.storage.removeItem(key)
    }
}
