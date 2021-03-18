import parseJsonType from 'parse-json'
import yamlType from 'yaml'
import importFreshType from 'import-fresh'

import { Optional } from '../typings/standard-types'

export type Config = any

export type LoaderSync = (filepath: string, content: string) => Optional<Config>

export interface LoadersSync {
    [key: string]: LoaderSync
}

let importFresh: typeof importFreshType
const loadJs = (filepath: string): LoaderSync => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    importFresh = importFresh === undefined ? require('import-fresh') : importFresh

    return importFresh(filepath)
}

let parseJson: typeof parseJsonType
const loadJson = (filepath: string, content: any): LoaderSync => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    parseJson = parseJson === undefined ? require('parse-json') : parseJson

    try {
        return parseJson(content)
    } catch (error) {
        error.message = `JSON Error in ${filepath}:\n${error.message}`
        throw error
    }
}

let yaml: typeof yamlType
const loadYaml = (filepath: string, content: any): LoaderSync => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    yaml = yaml === undefined ? require('yaml') : yaml

    try {
        return yaml.parse(content, { prettyErrors: true })
    } catch (error) {
        error.message = `YAML Error in ${filepath}:\n${error.message}`
        throw error
    }
}

export const loaders: LoadersSync = { loadJs, loadJson, loadYaml }
