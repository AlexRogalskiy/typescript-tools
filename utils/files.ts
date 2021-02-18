import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export const createFilePath = (locations): string => {
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
