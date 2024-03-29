import hasha from 'hasha'
import mkdirp from 'mkdirp'
import dirSync from 'tmp'
import YAML from 'json2yaml'
import beautify from 'js-beautify'
import {
    accessSync,
    constants,
    existsSync,
    MakeDirectoryOptions,
    mkdirSync,
    PathLike,
    promises,
    readdirSync,
    readFileSync,
    rmdirSync,
    statSync,
    unlinkSync,
    writeFileSync,
} from 'fs'
import { readFile } from 'fs-extra'
import { isDirectory, isDirectorySync } from 'path-type'
import { basename, dirname, extname, isAbsolute, join, parse as parsePath, relative, resolve } from 'path'
import { randomBytes } from 'crypto'
import { execSync, spawn, SpawnOptions, spawnSync } from 'child_process'

import { Optional } from '../../typings/standard-types'
import { Options, Result, ResultMap } from '../../typings/domain-types'

import { Cache } from '../../tools/cache'

import { Errors, Logging, parseJavaVersion, Strings } from '../index'

export namespace Files {
    import uniqueId = Strings.uniqueId
    import escapeRegExp = Strings.escapeRegExp
    import isBlankString = Strings.isBlankString
    import errorLogs = Logging.errorLogs
    import joinPath = Strings.joinPath

    const cache = new Cache()

    interface ExecResult {
        status: number
        stdout: string
        stderr: string
    }

    const packagePath = (project: string): string => {
        return join(__dirname, '../', project, 'package.json')
    }

    export const JSONtoCSV = (arr: any[], columns: string[], delimiter = ','): string =>
        [
            columns.join(delimiter),
            ...arr.map(obj =>
                columns.reduce(
                    (acc, key) => `${acc}${!acc.length ? '' : delimiter}"${!obj[key] ? '' : obj[key]}"`,
                    '',
                ),
            ),
        ].join('\n')

    export const readFileLines = (filename: string): string[] =>
        readFileSync(filename).toString('utf-8').split('\n')

    export const JSONToFile = (obj: any, filename: string): void =>
        writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2))

    export const generateFileName = (fileName: string, fileFormat: string): string => {
        const now = new Date()
        return `${fileName}_${now.toISOString().slice(0, 10)}_${`0${now.getHours()}`.slice(
            -2,
        )}-${`0${now.getMinutes()}`.slice(-2)}-${`0${now.getSeconds()}`.slice(-2)}${fileFormat}`
    }

    // https://gist.github.com/kethinov/6658166
    export const walk = async (dir: string, fileList: string[] = []): Promise<string[]> => {
        const files = await fsReadDir(dir)

        for (const file of files) {
            const filepath = join(dir, file)
            const stat = statSync(filepath)

            if (stat.isDirectory()) {
                fileList = await walk(filepath, fileList)
            } else {
                fileList.push(filepath)
            }
        }

        return fileList
    }

    // Takes a filename or foldername, strips the extension
    // gets the part between the "[]" brackets.
    // It will return `null` if there are no brackets
    // and therefore no segment.
    export const getSegmentName = (segment: string): string | null => {
        const { name } = parsePath(segment)

        if (name.startsWith('[') && name.endsWith(']')) {
            return name.slice(1, -1)
        }

        return null
    }

    export const readFileSync2 = (filename: string): string => readFileSync(filename).toString('utf8')

    export const getAbsolutePath = (unresolvedPath: string): string => {
        const { dir, name } = parsePath(unresolvedPath)
        const parts = joinPath(dir, name).split('/')

        return parts.map(part => part.replace(/\[.*]/, '1')).join('/')
    }

    export const readPkg = (project: string): any => {
        const packageJsonPath = packagePath(project)
        return JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    }

    export const writePkg = (project: string, pkg: string): void => {
        const packageJsonPath = packagePath(project)
        const text = JSON.stringify(pkg, null, 2)
        return writeFileSync(packageJsonPath, `${text}\n`)
    }

    export const writeFileWithCliOptions = async (
        output: string,
        contents: string,
        workingDir?: string,
    ): Promise<string> => {
        const outputPath = isAbsolute(output) ? output : join(workingDir || '.', output)
        try {
            await mkdirp.sync(dirname(outputPath))
            await promises.writeFile(outputPath, contents)

            return outputPath
        } catch (e) {
            throw Errors.valueError(`Failed to write to "${outputPath}"`, e)
        }
    }

    export const getHtmlContent = (htmlPath: string): string => {
        const htmlContent = readFileSync(htmlPath, 'utf-8')
        return htmlContent.replace(/script src="([^"]*)"/g, (_, src) => {
            const realSource = `vscode-resource:${resolve(htmlPath, '..', src)}`
            return `script src="${realSource}"`
        })
    }

    export const writeToFile = (value: ArrayLike<number> | ArrayBufferLike, fileName: string): void => {
        const bytes = new Uint8Array(value)
        writeFileSync(fileName, Buffer.from(bytes))
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

    export const iterateFolder = (dir: PathLike, callback: any, filter?: any): void => {
        const dirs = readdirSync(dir)
        for (const file of dirs) {
            const absPath = `${dir}/${file}`

            if (filter && !filter(absPath, file)) {
                return
            }

            if (statSync(absPath).isDirectory()) {
                iterateFolder(absPath, callback)
            } else {
                callback(absPath, file)
            }
        }
    }

    export const withTmpDir = async <T>(handler: (dir: string) => Promise<T>): Promise<T> => {
        const { name: dir, removeCallback: cleanUp } = dirSync({
            unsafeCleanup: true,
        })

        try {
            return await handler(dir)
        } finally {
            cleanUp()
        }
    }

    /**
     * Adjusts the base path of all the paths in an LCOV file
     * The paths in the LCOV file will be joined with the provided base path
     * @param lcovFile a string containing an entire LCOV file
     * @param basePath the base path to join with the LCOV file paths
     */
    export const adjustLcovBasePath = (lcovFile: string, basePath: string): string =>
        lcovFile.replace(/^SF:(.+)$/gm, (_, match) => `SF:${join(basePath, match)}`)

    /**
     * Given a Git URL, computes a semi-human-readable name for a folder in which to
     * clone the repository.
     */
    export const cacheDirFromUrl = (url: URL): string => {
        const proto = url.protocol.replace(/:$/, '')
        const host = url.hostname
        const hash = hasha(url.pathname, {
            algorithm: 'sha256',
        }).substr(0, 7)

        return `crate-registry-${proto}-${host}-${hash}`
    }

    export const readFileAsText = async (file: Blob): Promise<string> => {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = evt => resolve(String(evt.target?.result))
            reader.onerror = err => reject(err)
            reader.readAsText(file)
        })
    }

    export const readFileAsArrayBuffer = async (file: Blob): Promise<string> => {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = evt => resolve(String(evt.target?.result))
            reader.onerror = err => reject(err)
            reader.readAsArrayBuffer(file)
        })
    }

    export const pathWithoutExtension = (fullPath: string, extension: string): string => {
        return join(dirname(fullPath), basename(fullPath, extension))
    }

    export const graphQLSchemaFilename = (baseName: string): string => {
        const baseMatch = baseName.match(/(.*\D)\d+$/)

        if (baseMatch === null) {
            throw Errors.valueError('GraphQL test filename does not correspond to naming schema', {
                baseName,
            })
        }

        return `${baseMatch[1]}.gqlschema`
    }

    export const mapFile = (
        source: string,
        destination: string,
        transform: (content: string) => string,
    ): void => {
        const content = readFileSync(source, 'utf8')
        writeFileSync(destination, transform(content))
    }

    export const downloadFileProtocol = (pkgUrl: URL): Optional<string> => {
        const pkgPath = pkgUrl.toString().replace('file://', '')
        if (!exists(pkgPath)) {
            return null
        }

        return readFileSync(pkgPath, 'utf8')
    }

    export const getBuffer = async (stream: any): Promise<Buffer> => {
        const chunks: Uint8Array[] = []
        let length = 0

        for await (const chunk of stream) {
            chunks.push(chunk)
            length += Buffer.byteLength(chunk)
        }

        if (Buffer.isBuffer(chunks[0])) {
            return Buffer.concat(chunks, length)
        }

        return Buffer.from(chunks.join(''))
    }

    export const checkCwdOption = (options = {}): void => {
        if (!options['cwd']) {
            return
        }

        let stat
        try {
            stat = statSync(options['cwd'])
        } catch {
            return
        }

        if (!stat.isDirectory()) {
            throw new Error('The `cwd` option must be a path to a directory')
        }
    }

    /**
     * Reads the `package.json` data in a given path.
     *
     * Don't cache the data.
     *
     * @param {string} dir - The path to a directory to read.
     * @returns {object|null} The read `package.json` data, or null.
     */
    export const readPackageJson = (dir): any => {
        const filePath = join(dir, 'package.json')

        try {
            const text = readFileSync(filePath, 'utf8')
            const data = JSON.parse(text)

            if (typeof data === 'object' && data !== null) {
                data.filePath = filePath
                return data
            }
        } catch (_err) {
            // do nothing.
        }

        return null
    }

    export const getContent = (dir: string, filename: string): string[] => {
        return readFileSync(join(dir, filename), { encoding: 'utf-8' }).split(/\r\n/)
    }

    /**
     * Check whether the file exists or not.
     * @param {string} filePath The file path to check.
     * @param regex regex to validate by
     * @returns {boolean} `true` if the file exists.
     */
    export const existsCaseSensitive = (
        filePath: string,
        regex = /^(?:[/.]|\.\.|[A-Z]:\\|\\\\)(?:[/\\]\.\.)*$/u,
    ): boolean => {
        let dirPath = filePath

        while (dirPath !== '' && !regex.test(dirPath)) {
            const fileName = basename(dirPath)
            dirPath = dirname(dirPath)

            if (!readdirSync(dirPath).includes(fileName)) {
                return false
            }
        }

        return true
    }

    export const exists = (filePath: string): boolean => {
        let result = cache.get(filePath)
        if (result == null) {
            try {
                const relativePath = relative(process.cwd(), filePath)
                result = statSync(relativePath).isFile() && existsCaseSensitive(relativePath)
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error
                }
                result = false
            }
            cache.set(filePath, result)
        }

        return result
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

    export const writeConfigToFile = (path: string, data: string): any => {
        const extension = getFileExtension(getFileNameFromPath(path))

        const dataType = {
            yml: content => YAML.stringify(content),
            yaml: content => YAML.stringify(content),
            json: content => beautify(JSON.stringify(content)),
            none: content => beautify(JSON.stringify(content)),
            js: content => beautify(`module.exports = ${JSON.stringify(content)}`),
        }

        return dataType[extension || 'none'](data)
    }

    export const extract = (source: string): string =>
        existsSync(source) ? readFileSync(source, 'utf-8') : source

    export const getFileNameFromPath = (path = ''): string => {
        return path.replace(/^.*[\\/]/, '')
    }

    export const getFileExtension = (filename: string): string => {
        return filename.slice((Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1)
    }

    export const isGradleFile = (path: string): boolean => {
        const filename = basename(path).toLowerCase()

        return filename.endsWith('.gradle') || filename.endsWith('.gradle.kts')
    }

    export const isPropsFile = (path: string): boolean => {
        const filename = basename(path).toLowerCase()

        return filename === 'gradle.properties'
    }

    export const toAbsolutePath = (packageFile: string): string => {
        return join(packageFile.replace(/^[/\\]*/, '/'))
    }

    export const readString = async (...paths: string[]): Promise<Buffer> => {
        return readFile(resolve(...paths), 'utf8')
    }

    export const reorderFiles = (packageFiles: string[]): string[] => {
        return packageFiles.sort((x, y) => {
            const xAbs = toAbsolutePath(x)
            const yAbs = toAbsolutePath(y)

            const xDir = dirname(xAbs)
            const yDir = dirname(yAbs)

            if (xDir === yDir) {
                if ((isGradleFile(xAbs) && isGradleFile(yAbs)) || (isPropsFile(xAbs) && isPropsFile(yAbs))) {
                    if (xAbs > yAbs) {
                        return 1
                    }
                    if (xAbs < yAbs) {
                        return -1
                    }
                } else if (isGradleFile(xAbs)) {
                    return 1
                } else if (isGradleFile(yAbs)) {
                    return -1
                }
            } else if (xDir.startsWith(yDir)) {
                return 1
            } else if (yDir.startsWith(xDir)) {
                return -1
            }

            return 0
        })
    }

    export const determineJavaVersion = (): number => {
        try {
            const javaVersionCommand = spawnSync('java', ['-version'], {
                encoding: 'utf8',
                windowsHide: true,
            })

            return parseJavaVersion(javaVersionCommand.stderr)
        } catch (e) {
            errorLogs(e.message)
            return 0
        }
    }
}
