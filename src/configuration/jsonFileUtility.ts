import * as fs from 'fs-extra'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class JsonFileUtility {
    static async serializeToFile<T>(path: string, data: T): Promise<void> {
        await fs.ensureFile(path)
        await fs.writeJson(path, data)
    }

    static async deserializeFromFile<T>(path: string): Promise<T | undefined>
    static async deserializeFromFile<T>(path: string, defaultValue: T): Promise<T>
    static async deserializeFromFile<T>(path: string, defaultValue?: T): Promise<T | undefined> {
        try {
            return await fs.readJson(path)
        } catch {
            return defaultValue
        }
    }
}
