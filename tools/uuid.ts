import uuid from 'uuid'

export namespace UUID {
    export const getUuid = (uuidType = 'v4'): string => {
        if (uuidType === '1' || uuidType === 'v1') {
            return uuid.v1()
        } else if (uuidType === '4' || uuidType === 'v4') {
            return uuid.v4()
        }

        throw new Error(`Invalid UUID type "${uuidType}"`)
    }
}
