export const env = process.env.NODE_ENV || 'development'

if (env === 'development' || env === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    const config = require('./config.json')
    const envConfig = config[env]
    console.log(envConfig)

    // eslint-disable-next-line github/array-foreach
    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key]
    })
}
