require('dotenv').config()

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 60000
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        acquireTimeout: 30000
    }
}
