export interface Config {
    port: number,
    maxBodySize: string,
    key: string,
}

export default {
    port: parseInt(process.env.PORT) || 3100,
    maxBodySize: process.env.MAX_BODY_SIZE || '1mb',
    key: process.env.AUTH_KEY,
}
