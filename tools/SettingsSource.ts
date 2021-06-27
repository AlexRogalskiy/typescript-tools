import type { ISettingsSource } from './ISettingsSource'

export class SettingsSource implements ISettingsSource {
    protected store = new Map<string, any>()

    constructor(protected fallback?: ISettingsSource) {}

    has(key: string): boolean {
        return this.store.has(key) || !!this.fallback?.has(key)
    }

    getValue(key: string): any | undefined {
        if (this.fallback?.has(key)) {
            return this.fallback.getValue(key)
        }
        return this.store.get(key)
    }

    setValue(key: string, value: any): void {
        this.store.set(key, value)
    }
}
