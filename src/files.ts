import {
    accessSync,
    constants,
    existsSync,
    MakeDirectoryOptions,
    mkdirSync,
    promises,
    readdirSync,
    readFile,
    readFileSync,
    rmdirSync,
    statSync,
    unlinkSync,
    writeFileSync,
} from 'fs'
import { isDirectory, isDirectorySync } from 'path-type'
import { dirname, extname, join, resolve } from 'path'
import { randomBytes } from 'crypto'
import { execSync, spawn, SpawnOptions } from 'child_process'

import { Strings } from './strings'

import { Optional } from '../typings/standard-types'
import { Options, Result, ResultMap } from '../typings/domain-types'

export namespace Files {
    import uniqueId = Strings.uniqueId
    import escapeRegExp = Strings.escapeRegExp
    import isBlankString = Strings.isBlankString

    interface ExecResult {
        status: number
        stdout: string
        stderr: string
    }

    export const getConfigFileName = (baseDir: string, configFileName: string): Optional<string> => {
        const configFilePath = resolve(baseDir, configFileName)
        if (existsSync(configFilePath)) {
            return configFilePath
        }

        if (baseDir.length === dirname(baseDir).length) {
            return null
        }

        return getConfigFileName(resolve(baseDir, '../'), configFileName)
    }

    export const getContent = (dir: string, filename: string): string[] => {
        return readFileSync(join(dir, filename), { encoding: 'utf-8' }).split(/\r\n/)
    }

    export const getFilesizeInBytes = (filename: string): number => {
        //return await fs.promises.stat(file)).size
        return statSync(filename).size
    }

    export async function processFiles(files: string[], opts: Options): Promise<ResultMap> {
        const resultMap: ResultMap = {}

        const processString = (fileName: string, content: string, opts: Options): Result => {
            return {
                dest: '',
                error: false,
                fileName,
                message: content,
                settings: {
                    verbose: opts.verbose,
                    dryRun: opts.dryRun,
                },
                src: '',
            }
        }

        const promises = files.map(fileName => {
            if (!existsSync(fileName)) {
                const result: Result = {
                    fileName,
                    settings: null,
                    message: `${fileName} does not exist. process abort.\n`,
                    error: true,
                    src: '',
                    dest: '',
                }
                return Promise.resolve(result)
            }

            const content = readFileSync(fileName).toString()
            return processString(fileName, content, opts)
        })

        // eslint-disable-next-line github/no-then
        return Promise.all<Result>(promises).then(resultList => {
            for (const result of resultList) {
                resultMap[result.fileName] = result
            }
            return resultMap
        })
    }

    export const getDirectory = async (filepath: string): Promise<string> => {
        const filePathIsDirectory = await isDirectory(filepath)

        if (filePathIsDirectory) {
            return filepath
        }

        return dirname(filepath)
    }

    export const getDirectorySync = (filepath: string): string => {
        const filePathIsDirectory = isDirectorySync(filepath)

        if (filePathIsDirectory) {
            return filepath
        }

        return dirname(filepath)
    }

    export const fsReadFileAsync = async (pathname: string, encoding: string): Promise<string> => {
        return new Promise((resolve, reject): void => {
            readFile(pathname, encoding, (error, contents): void => {
                if (error) {
                    reject(error)
                    return
                }

                resolve(contents)
            })
        })
    }

    export const readFileAsyncOrThrow = async (
        filepath: string,
        options: Options = {},
    ): Promise<Optional<string>> => {
        const throwNotFound = options.throwNotFound === true

        try {
            return await fsReadFileAsync(filepath, 'utf8')
        } catch (error) {
            if (!throwNotFound && error.code === 'ENOENT') {
                return null
            }

            throw error
        }
    }

    export const readFileAndSync = (filepath: string, options: Options = {}): Optional<string> => {
        const throwNotFound = options.throwNotFound === true

        try {
            return readFileSync(filepath, 'utf8')
        } catch (error) {
            if (!throwNotFound && error.code === 'ENOENT') {
                return null
            }

            throw error
        }
    }
    export const createFilePath = (locations: { path; name; extension }): string => {
        const date = new Date()
        const timestamp = `${date.getFullYear()}_${
            date.getMonth() + 1
        }_${date.getDate()}_${date.getHours()}_${date.getMinutes()}`

        const { path, name, extension } = locations
        const fileName = `${name}-${timestamp}.${extension}`

        if (!existsSync(path)) {
            mkdirSync(path)
        }

        return join(path, fileName)
    }

    export const checkFileExist = async (path: string): Promise<boolean> => {
        try {
            await promises.access(path)
            return true
        } catch (error) {
            return false
        }
    }

    export const createRandomDataFile = (numBytes: number): string => {
        const path = join(process.cwd(), uniqueId())
        const buffer = randomBytes(numBytes)

        writeFileSync(path, buffer)

        return path
    }

    export const checkFilesExist = async (fileList: string[]): Promise<boolean> => {
        return fileList.every(async (file: string) => {
            return await checkFileExist(file)
        })
    }

    export const rmdirRecursive = (baseDir: string): void => {
        for (let entry of readdirSync(baseDir)) {
            entry = join(baseDir, entry)
            if (statSync(entry).isDirectory()) {
                rmdirRecursive(entry)
            } else {
                unlinkSync(entry)
            }
        }
        rmdirSync(baseDir)
    }

    export const pathSplit = (value: string): string[] => {
        const d = dirname(value)
        const e = extname(value)
        const f = value.substring(d.length, value.length - e.length).replace(/^\//, '')

        return [d, f, e]
    }

    export const fsReadDir = (pth: string): any => {
        return existsSync(pth) ? readdirSync(pth) : []
    }

    // Get path to root package.
    export const packageRoot = (pth: string): any => {
        while (!existsSync(join(pth, 'package.json'))) {
            pth = dirname(pth)
        }
        return pth
    }

    // Gets requires from code.
    export const packageRequires = (pth: string, a: string[] = []): any => {
        const d = readFileSync(pth, 'utf8')
        const re = /require\('(.*?)'\)/g
        const reqs: string[] = []

        for (let m: RegExpExecArray | null = null; (m = re.exec(d)) != null; m) {
            reqs.push(m[1])
            a.push(m[1])
        }

        if (reqs.length === 0) {
            return a
        }

        const dir = dirname(pth)
        for (const p of reqs) {
            if (p.startsWith('.')) {
                packageRequires(join(dir, p), a)
            }
        }

        return a
    }

    // Download README.md from wiki.
    export const downloadReadme = (pth: string, o): void => {
        const stdio = [0, 1, 2]
        const BIN = `${execSync('npm prefix -g')}/bin/`.replace('\n', '')
        const wiki = 'https://raw.githubusercontent.com/wiki/'
        const url = `${wiki}${o.org}/${o.package_root}/${o.readme}.md`
        execSync(`${BIN}download ${url} > ${pth}`, { stdio })
    }

    export const extractErrorsFromLogs = (outputPath: string): string[] => {
        const out = readFileSync(outputPath, 'utf8')
        const lines = out.split('\n')
        const errors: string[] = []

        for (const line of lines) {
            const errIndex = line.indexOf('FATAL')
            if (errIndex >= 0) {
                const err = line.substring(errIndex)
                errors.push(err)
            }
        }

        return errors
    }

    export const getEnvVariables = async (): Promise<{ [key: string]: string }> => {
        const result: { [key: string]: string } = {}

        for (const key in process.env) {
            result[key] = process.env[key] || ''
        }

        return result
    }

    export const convertItemListToArray = (itemList: DataTransferItemList): DataTransferItem[] => {
        const items: DataTransferItem[] = []

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < itemList.length; i++) {
            items.push(itemList[i])
        }

        return items
    }

    export const getFolderNameFromPathname = (pathname: string): Optional<string> => {
        if (pathname === '/') return null

        return pathname.split('/').slice(-1)[0]
    }

    export const isFolderNameValid = (name: string): boolean => {
        if (name.length === 0) return false
        // eslint-disable-next-line no-control-regex
        return !new RegExp(/[<>:"\\/|?*\x00-\x1F]/g).test(name)
    }

    export const isFolderPathnameValid = (pathname: string): boolean => {
        if (pathname === '/') return true
        if (!pathname.startsWith('/')) return false

        const [, ...folderNames] = pathname.split('/')

        return folderNames.every(isFolderNameValid)
    }

    export const isSubPathname = (rootPathname: string, targetPathname: string): boolean => {
        return new RegExp(`^${escapeRegExp(rootPathname)}/.+`).test(targetPathname)
    }

    export const isDirectSubPathname = (rootPathname: string, targetPathname: string): boolean => {
        return new RegExp(
            `^${rootPathname === '/' ? '' : escapeRegExp(rootPathname)}/[^<>:"\\/|?*\x00-\x1F]+$`,
        ).test(targetPathname)
    }

    export const filterByExtension = (fileNames: string[], extension = '.json'): string[] => {
        return fileNames.filter(fileName => fileName.endsWith(extension))
    }

    export const appendFileProtocol = (pathname: string): string => {
        return `file://${pathname.replace(/\\/g, '/')}`
    }

    export const readAsText = async (file: File): Promise<string> => {
        return new Promise((res, rej) => {
            const reader = new FileReader()
            reader.onload = e => res(e.target?.result as string)
            reader.onerror = () => {
                reader.abort()
                rej(new Error('Cannot read input file'))
            }
            reader.readAsText(file)
        })
    }

    export const convertFileListToArray = (fileList: FileList): File[] => {
        const files: File[] = []

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < fileList.length; i++) {
            files.push(fileList[i])
        }

        return files
    }

    export const inspectDataTransfer = (dataTransfer: DataTransfer): any => {
        if (process.env.NODE_ENV === 'production') {
            return
        }

        const items = convertItemListToArray(dataTransfer.items).map(item => {
            return {
                type: item.type,
                kind: item.kind,
                file: item.getAsFile(),
            }
        })

        const files = convertFileListToArray(dataTransfer.files).map(file => {
            return {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
            }
        })

        console.log({
            items,
            files,
        })
    }

    export const ensureDirExists = (
        dir: string,
        options: MakeDirectoryOptions = { recursive: true },
    ): void => {
        existsSync(dir) || mkdirSync(dir, options)
    }

    export const getFileJson = (path: string): any => {
        try {
            const rawContent = readFileSync(path, 'utf-8')
            return JSON.parse(rawContent)
        } catch (ex) {
            throw new Error(`An error occurred while parsing the contents of the file: ${path}. Error: ${ex}`)
        }
    }

    export const isValidFile = (fileName: string, extension = '.json'): boolean => {
        return !isBlankString(fileName) && fileName.endsWith(extension) && checkFileExists(fileName)
    }

    export const checkFileExists = (fileName: string, mode = constants.F_OK | constants.R_OK): boolean => {
        try {
            accessSync(fileName, mode)

            return true
        } catch (err) {
            return false
        }
    }

    /**
     * @param {string} filePath
     * @returns {any}
     */
    export const readJsonFile = (filePath: string): string => {
        try {
            return JSON.parse(readFileSync(filePath).toString())
        } catch (error) {
            console.error(`ParseError in file: ${filePath}`)
            throw error
        }
    }

    export const collectFileName = (dirName: string): string[] => {
        let fileName: string[] = []

        // eslint-disable-next-line github/array-foreach
        readdirSync(dirName).forEach((name: string) => {
            const newName = `${dirName}/${name}`
            const stats = statSync(newName)
            if (stats.isDirectory()) {
                fileName = fileName.concat(collectFileName(newName))
            } else if (stats.isFile()) {
                fileName.push(newName)
            }
        })

        return fileName
    }

    export const exec = async (cmd: string, args: string[], options: SpawnOptions): Promise<ExecResult> => {
        const process = spawn(cmd, args, options)

        let stdout = ''
        let stderr = ''

        process.stdout && process.stdout.on('data', (data: Buffer) => (stdout += data.toString()))
        process.stderr && process.stderr.on('data', (data: Buffer) => (stderr += data.toString()))

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, _reject) => {
            process.on('exit', (status: number) => {
                resolve({
                    status,
                    stdout,
                    stderr,
                })
            })
        })
    }
}
