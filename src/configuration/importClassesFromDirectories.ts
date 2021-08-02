import * as path from 'path'

/**
 * Loads all exported classes from the given directory.
 */
export function importClassesFromDirectories(
    directories: string[],
    formats = ['.js', '.ts', '.tsx'],
): Function[] {
    const loadFileClasses = (exported: any, allLoaded: Function[]): Function[] => {
        if (exported instanceof Function) {
            allLoaded.push(exported)
        } else if (exported instanceof Array) {
            for (const i of exported) {
                loadFileClasses(i, allLoaded)
            }
        } else if (exported instanceof Object || typeof exported === 'object') {
            for (const key of Object.keys(exported)) {
                loadFileClasses(exported[key], allLoaded)
            }
        }

        return allLoaded
    }

    const allFiles = directories.reduce((allDirs, dir) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        return allDirs.concat(require('glob').sync(path.normalize(dir)))
    }, [] as string[])

    const dirs = allFiles
        .filter(file => {
            const dtsExtension = file.substring(file.length - 5, file.length)
            return formats.includes(path.extname(file)) && dtsExtension !== '.d.ts'
        })
        .map(file => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require(file)
        })

    return loadFileClasses(dirs, [])
}
