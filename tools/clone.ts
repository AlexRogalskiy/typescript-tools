import rfdc from 'rfdc'

export const clone = (obj: any, throwOnError = false): any => {
    if (obj == null) {
        return obj
    }

    try {
        // return v8Clone(obj);
        // return jsonClone(obj);
        return rfdc(obj)
    } catch (err) {
        if (throwOnError) {
            throw err
        }
    }

    return undefined
}
