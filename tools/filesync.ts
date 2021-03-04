import { Base } from './base'
import { existsSync, readFileSync, writeFileSync } from 'fs'

export class FileSync extends Base {
    read(): any {
        // fs.exists is deprecated but not fs.existsSync
        if (existsSync(this.source)) {
            // Read database
            try {
                const data = readFileSync(this.source, 'utf-8').trim()
                // Handle blank file
                return data ? this.deserialize(data) : this.defaultValue
            } catch (e) {
                if (e instanceof SyntaxError) {
                    e.message = `Malformed JSON in file: ${this.source}\n${e.message}`
                }
                throw e
            }
        } else {
            // Initialize
            writeFileSync(this.source, this.serialize(this.defaultValue))
            return this.defaultValue
        }
    }

    write(data): void {
        writeFileSync(this.source, this.serialize(data))
    }
}
