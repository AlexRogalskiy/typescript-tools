import * as fs from 'fs'
import { existsSync, mkdirSync, promises } from 'fs'
import * as path from 'path'
import { join } from 'path'

export namespace Files {
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

    export const checkFilesExist = async (fileList: string[]): Promise<boolean> => {
        return fileList.every(async (file: string) => {
            return await checkFileExist(file)
        })
    }

    export const rmdirRecursive = (baseDir: string): void => {
        for (let entry of fs.readdirSync(baseDir)) {
            entry = path.join(baseDir, entry)
            if (fs.statSync(entry).isDirectory()) {
                rmdirRecursive(entry)
            } else {
                fs.unlinkSync(entry)
            }
        }
        fs.rmdirSync(baseDir)
    }
}
