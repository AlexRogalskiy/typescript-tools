import * as fs from 'fs'
// until we can finally use: const fs = require('fs').promises;

const read = async (file: string): Promise<any> =>
    new Promise((resolve, reject) => fs.readFile(file, (err, data) => (err ? reject(err) : resolve(data))))

const fileExists = async (filename = ''): Promise<any> =>
    new Promise((resolve, reject) => {
        if (!filename) {
            reject(new Error('Please specify a file name to load!'))
        }
        fs.access(filename, err => (err ? reject(err) : resolve(filename)))
    })

// eslint-disable-next-line github/no-then
module.exports = async file => fileExists(file).then(read)
