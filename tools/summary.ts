/**
 * Get example list from extracted folder
 */
import { join } from 'path'
import { existsSync, lstatSync, readdirSync } from 'fs'

const exists = (path: string): boolean => existsSync(path)
const isDotFile = (name: string): boolean => name.startsWith('.')
const isDirectory = (path: string): boolean => lstatSync(path).isDirectory()

export const summary = (source: string): any => {
    if (!exists(source) || !isDirectory(source)) {
        return []
    }

    return readdirSync(source)
        .filter(name => !isDotFile(name))
        .filter(name => isDirectory(join(source, name)))
}
