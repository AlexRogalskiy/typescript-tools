import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

import { window, extensions } from 'vscode'

export const baseDir = __dirname

let ext = extensions.getExtension('dyu.fbsgen-vscode')!;
export const targetDir = ext && (ext.extensionPath + '/target') || baseDir

export interface Config {
    templates_dir: string
    user_dir: string
    jar_file: string
}

export function newConfig(templates_dir: string): Config {
    return {
        templates_dir: '',
        user_dir: '',
        jar_file: ''
    }
}

export function getUserDir(): string {
    let dir: string

    switch (process.platform) {
        case 'linux':
            dir = path.join(os.homedir(), '.config')
            break
        case 'darwin':
            dir = path.join(os.homedir(), 'Library', 'Application Support')
            break
        case 'win32':
            dir = process.env.APPDATA!
            break
        default:
            throw Error("Unrecognized OS")
    }

    return path.join(dir, 'Code', 'User')
}

export function mkdirIfNotExist(dir: string, dirToCreate: string): string {
    let newDir = path.join(dir, dirToCreate)
    if (!fs.statSync(newDir).isDirectory())
        fs.mkdirSync(newDir)

    return newDir
}

export function getParentDirIfFile(dir: string): string {
    return fs.statSync(dir).isDirectory() ? dir : path.join(dir, '..')
}

export function isDir(f: string): boolean {
    return fs.statSync(f).isDirectory()
}

export function isFile(f: string): boolean {
    return !fs.statSync(f).isDirectory()
}

export function listDirs(dir: string): Promise<string[]> {
    return list(dir, isDir)
}

export function listFiles(dir: string): Promise<string[]> {
    return list(dir, isFile)
}

export function list(dir: string, fn: (f: string) => boolean): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            let dirs: string[] = []
            for (let f of files) {
                if (fn(path.join(dir, f))) {
                    dirs.push(f)
                }
            }
            if (!dirs.length)
                window.showErrorMessage('No dirs found in ' + dir)

            resolve(dirs)
        })
    })
}

function isReadStream(obj) {
    // some streams are readable but do not have `read()`, however
    // we can reliably detect readability by testing for `resume()`
    return isStream(obj) && typeof obj.resume === 'function';
}

function isWriteStream(obj) {
    return isStream(obj) && typeof obj.write === 'function';
}

function isStream(obj) {
    return obj && typeof obj.pipe === 'function';
}
