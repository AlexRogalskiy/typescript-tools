import gzip from 'gzip-size'
import { sync } from 'brotli-size'

export const getCompressedSize = (data: any, compression = 'gzip'): number => {
    let size
    if (compression === 'gzip') {
        size = gzip.sync(data)
    } else if (compression === 'brotli') {
        size = sync(data)
    } else {
        size = Buffer.byteLength(data)
    }

    return size
}
