import { Readable } from 'stream'

export namespace ArrayBuffers {
    const ARRAY_BUFFER_TYPES = [
        '[object ArrayBuffer]',
        '[object Int8Array]',
        '[object Uint8Array]',
        '[object Uint8ClampedArray]',
        '[object Int16Array]',
        '[object Uint16Array]',
        '[object Int32Array]',
        '[object Uint32Array]',
        '[object Float32Array]',
        '[object Float64Array]',
    ]

    const isDataView = (obj: any): boolean => {
        return obj && DataView.prototype.isPrototypeOf(obj)
    }

    export const isArrayBuffer = (obj: any): boolean => {
        return isDataView(obj) || ARRAY_BUFFER_TYPES.includes(Object.prototype.toString.call(obj))
    }

    export async function rawBody(readable: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            let bytes = 0
            const chunks: Buffer[] = []
            readable.on('error', reject)
            readable.on('data', chunk => {
                chunks.push(chunk)
                bytes += chunk.length
            })
            readable.on('end', () => {
                resolve(Buffer.concat(chunks, bytes))
            })
        })
    }
}
