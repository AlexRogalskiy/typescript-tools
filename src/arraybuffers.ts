export namespace ArrayBuffers {
    const ARRAY_BUFFER_TYPES = [
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
}
