import winston from 'winston'

export const isDev = process.env.NODE_ENV === 'development'

export const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: isDev ? 'debug' : 'info',
            handleExceptions: true,
        }),
    ],
})
