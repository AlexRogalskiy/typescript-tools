import { readFileSync } from 'fs'
import { parse } from 'yamljs'

export default class AppDefinitionParser {
    private _yaml: any

    constructor(file) {
        const contents = readFileSync(file).toString()
        this._yaml = parse(contents)
    }

    getComponents(): any {
        return this._yaml.components
    }
}
