import { Base } from './base'

export class LocalStorage extends Base {
    read(): string {
        const data = localStorage.getItem(this.source)

        if (data) {
            return this.deserialize(data)
        }

        localStorage.setItem(this.source, this.serialize(this.defaultValue))
        return this.defaultValue
    }

    write(data: any): void {
        localStorage.setItem(this.source, this.serialize(data))
    }
}
