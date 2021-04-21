import bigInteger, { BigInteger } from 'big-integer'

import { Keys } from '../../typings/general-types'

export namespace SizeUtils {
    export const sizeUnits = Object.freeze([' bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'])

    export const unitsInBytes = Object.freeze({
        KILOBYTE: 1024,
        KB: 1024,
        MEGABYTE: Math.pow(1024, 2),
        MB: Math.pow(1024, 2),
        GIGABYTE: Math.pow(1024, 3),
        GB: Math.pow(1024, 3),
        TERABYTE: Math.pow(1024, 4),
        TB: Math.pow(1024, 4),
        PETABYTE: Math.pow(1024, 5),
        PB: Math.pow(1024, 5),
    })

    // normalize size number or size object to size object.
    export const normalizeSize = (sizeOrBytes: any): any => {
        const { peta = 0, n = sizeOrBytes } = sizeOrBytes
        return peta !== 0 ? sizeOrBytes : { peta, n }
    }

    // Compact a size object to number if possible.
    export const compactSize = (sizeOrBytes: any): number => {
        const { peta, n } = normalizeSize(sizeOrBytes)
        return peta === 0 ? n : sizeOrBytes
    }

    export const toBigInteger = (sizeOrBytes: any): any => {
        const { n, peta } = normalizeSize(sizeOrBytes)

        return _toBigInteger(n, peta)
    }

    export const fromBigInteger = (bi: BigInteger): any => {
        const { quotient, remainder } = bi.divmod(unitsInBytes.PETABYTE)

        return compactSize({
            peta: quotient.toJSNumber(),
            n: remainder.toJSNumber(),
        })
    }

    export const fromSizeAndUnit = (size: BigInteger, unit: Keys<typeof unitsInBytes>): BigInteger => {
        return fromBigInteger(bigInteger(unitsInBytes[unit]).multiply(size))
    }

    export const toSizeAndUnit = (sizeOrBytes: any): any => {
        // eslint-disable-next-line prefer-const
        let { peta, n } = normalizeSize(sizeOrBytes)
        let i = 0

        if (peta > 0) {
            i = 5
            n = peta + n / unitsInBytes.PETABYTE
        }

        while (n / 1024 >= 1) {
            n /= 1024
            ++i
        }

        return {
            size: n,
            unit: sizeUnits[i],
        }
    }

    export const mulBigIntegerReal = (bi: any, real: number): BigInteger => {
        const scalar = Math.floor(real)
        const friction = real % 1

        const { quotient, remainder } = bi.divmod(Number.MAX_SAFE_INTEGER)
        const p1 = Math.floor(quotient * friction)
        const p2 = Math.round(remainder * friction + (quotient % 1) * Number.MAX_SAFE_INTEGER)

        return bigInteger(Number.MAX_SAFE_INTEGER).multiply(p1).add(p2).add(bi.multiply(scalar))
    }

    // This function, if passed a size object, will convert the object to a non exact
    // integer representation of the size object. A difference may happen for sizes above
    // Number.MAX_SAFE_INTEGER because of the inability of floating point numbers to
    // represent very big numbers.
    export const toBytes = (sizeOrBytes: any): number => {
        const { peta, n } = normalizeSize(sizeOrBytes)
        return peta * unitsInBytes.PETABYTE + n
    }

    export const interpolateSizes = (sizeOrBytes1 = 0, sizeOrBytes2 = 0, t): any => {
        const bi1 = toBigInteger(sizeOrBytes1)
        const bi2 = toBigInteger(sizeOrBytes2)

        // Interpolates bi1 and bi2 using the the formola bi1 + (bi2 - bi1) * t
        // where 0 <= t <= 1. The interpolation is written using Numbers because bigInteger
        // does not support multiplication with a fraction. The algorithm it guaranteed to
        // work because t is defined as friction between 0 and 1.
        const { quotient, remainder } = bi2.subtract(bi1).divmod(unitsInBytes.PETABYTE)
        const peta = Math.floor(quotient * t)
        const n = Math.round(remainder * t + (quotient % 1) * unitsInBytes.PETABYTE)

        return fromBigInteger(_toBigInteger(n, peta).add(bi1))
    }

    export const sumSize = (...sizeOrBytesList): any => {
        return fromBigInteger(
            sizeOrBytesList.reduce((sum, size) => sum.add(toBigInteger(size)), bigInteger.zero),
        )
    }

    // Format a size number or size object to human readable string.
    export const formatSize = (sizeOrBytes): any => {
        // eslint-disable-next-line prefer-const
        let { peta, n } = normalizeSize(sizeOrBytes)
        let i = 0

        if (peta > 0) {
            i = 5
            n = peta + n / unitsInBytes.PETABYTE
        }

        while (n / 1024 >= 1) {
            n /= 1024
            ++i
        }

        if (i > 0) {
            n = n.toFixed(n < 10 ? 1 : 0)
        }

        return `${n}${sizeUnits[i]}`
    }

    export const isSizeZero = (sizeOrBytes: number): boolean => {
        const { peta, n } = normalizeSize(sizeOrBytes)
        return peta === 0 && n === 0
    }

    export const compareSize = (sizeOrBytes1, sizeOrBytes2): number => {
        const { peta: p1, n: n1 } = normalizeSize(sizeOrBytes1)
        const { peta: p2, n: n2 } = normalizeSize(sizeOrBytes2)

        return p1 === p2 ? Math.sign(n1 - n2) : Math.sign(p1 - p2)
    }

    // ----------------------------------
    // Internal Helpers
    // ----------------------------------
    export const _toBigInteger = (n, peta): BigInteger => {
        return bigInteger(unitsInBytes.PETABYTE).multiply(peta).add(n)
    }
}
