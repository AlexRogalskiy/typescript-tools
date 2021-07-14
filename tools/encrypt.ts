import { createCipheriv, createDecipheriv } from 'crypto'

// use the lines below to generate values
// const key = crypto.randomBytes(32).toString("hex");
// const iv = crypto.randomBytes(16).toString("hex");

type EncryptKeys = {
    iv: string
    key: string
}

const ALGORITHM = 'aes-256-cbc'

const getEncryptKeys = (encryptIv: string, encryptKey: string): EncryptKeys => {
    return { iv: encryptIv, key: encryptKey }
}

export const decrypt = (data: string, encryptIv: string, encryptKey: string): string => {
    const { iv, key } = getEncryptKeys(encryptIv, encryptKey)

    const decipher = createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
    const decrypted = decipher.update(Buffer.from(data, 'hex'))

    return Buffer.concat([decrypted, decipher.final()]).toString()
}

export const encrypt = (data: string, encryptIv: string, encryptKey: string): string => {
    const { iv, key } = getEncryptKeys(encryptIv, encryptKey)

    const cipher = createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
    const encrypted = cipher.update(data)

    return Buffer.concat([encrypted, cipher.final()]).toString('hex')
}
