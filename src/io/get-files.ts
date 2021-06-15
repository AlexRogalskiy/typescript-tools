import { readdir } from 'fs'

const getFiles = async (path: string): Promise<string[]> =>
    new Promise((resolve, reject) => {
        readdir(path, (err, files) => {
            if (err) {
                return reject(err)
            }

            resolve(files)
        })
    })

export default getFiles
