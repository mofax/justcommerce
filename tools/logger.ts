import pino from 'pino'

const logger = pino({
    prettyPrint: process.env.NODE_ENV !== "production"
})

export { logger }