const winston = require('winston')
const Sentry = require('winston-transport-sentry-node').default

const options = {
    sentry: {
        dsn: process.env.SENTRY_DSN,
    },
    level: 'info',
}

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)(),
        new Sentry(options),
    ],
})

module.exports = logger
