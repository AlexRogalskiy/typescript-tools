import fs from 'fs'

export async function makeDir(root: string, options = { recursive: true }): Promise<void> {
    return fs.promises.mkdir(root, options)
}
