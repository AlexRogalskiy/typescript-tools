import fs from 'fs'
import path from 'path'

const cache: Record<string, string | undefined> = {}

export const getModuleVersion = (moduleName: string): string | undefined => {
    if (cache[moduleName]) return cache[moduleName]

    try {
        const json = JSON.parse(
            fs.readFileSync(path.join('node_modules', moduleName, 'package.json'), 'utf8'),
        )
        cache[moduleName] = json.version
    } catch (err) {
        cache[moduleName] = undefined
    }

    return cache[moduleName]
}
