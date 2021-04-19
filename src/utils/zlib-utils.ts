import zlib from 'zlib'

import promisify from 'es6-promisify'

export namespace ZlibUtils {
    const _compress = promisify(zlib.gzip)
    const _decompress = promisify(zlib.gunzip)

    export const writeDumpLog = async (gzip, data: any): Promise<void> => {
        gzip.write('log":[')

        for (let i = 0; i < data.length; ++i) {
            if (i > 0) {
                gzip.write(',')
            }
            gzip.write(await _decompress(data[i]))
        }

        gzip.end(']}')
    }

    export const readDumpLog = async (data: string): Promise<void> => {
        await _compress(JSON.stringify(data))
    }
}
