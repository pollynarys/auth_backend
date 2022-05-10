const knex = require('../db');
const jwt = require('jsonwebtoken')

const checkTokenInDb = async (userId) => {
    const token = await knex('tokens')
        .select('*')
        .where({ user_id: userId })
        .first()
        .returning('refresh_token')
    return !!token
}

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await checkTokenInDb(userId)

        if (tokenData) {
            const user = await knex('tokens')
                .where({ user_id: userId })
                .update({ refresh_token: refreshToken })
                .returning('*')
        } else {
            const trx = await knex.transaction()
            const [token] = await trx('tokens').insert({
                user_id: userId,
                refresh_token: refreshToken,
            }).returning('*')

            await trx.commit()
        }

    }

}

module.exports = new TokenService ()
