import { Strings } from '../src'
import stringify = Strings.stringify

export class Base {
    protected readonly defaultValue: any
    protected readonly serialize: any
    protected readonly deserialize: any

    constructor(
        protected readonly source: string,
        { defaultValue = {}, serialize = stringify, deserialize = JSON.parse } = {},
    ) {
        this.source = source
        this.defaultValue = defaultValue
        this.serialize = serialize
        this.deserialize = deserialize
    }
}
