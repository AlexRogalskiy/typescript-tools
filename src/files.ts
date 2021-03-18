import {
    existsSync,
    mkdirSync,
    promises,
    readdirSync,
    readFileSync,
    rmdirSync,
    statSync,
    unlinkSync,
    writeFileSync,
    readFile,
} from 'fs'
import { isDirectory, isDirectorySync } from 'path-type'
import { join, dirname, extname } from 'path'
import { randomBytes } from 'crypto'
import { execSync } from 'child_process'

import { Strings } from './strings'

import { Optional } from '../typings/standard-types'

export namespace Files {
    import uniqueId = Strings.uniqueId

    interface Options {
        throwNotFound?: boolean
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

    export const ensureDirExists = (dir: string): void => {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }
    }

    export const getFileJson = (path: string): any => {
        try {
            const rawContent = readFileSync(path, 'utf-8')
            return JSON.parse(rawContent)
        } catch (ex) {
            throw new Error(`An error occurred while parsing the contents of the file: ${path}. Error: ${ex}`)
        }
    }
}
