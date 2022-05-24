const knex = require('../db')
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

    /**
     * Generate access and refresh tokens
     * @param {{}} payload - Data that is embedded in the token
     * @returns {object} - Access and refresh tokens
     */
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    /**
     * Check access token
     * @param {string} token
     * @returns {object | null} - userData or null in the event of an error
     */
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    /**
     * Check refresh token
     * @param {string} token
     * @returns {object | null} - userData or null in the event of an error
     */
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    /**
     * Save or update refresh token in database
     * @param {string} userId
     * @param {string} refreshToken
     */
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

    /**
     * Remove token in database
     * @param {string} refreshToken
     * @returns {string} - remote token
     */
    async removeToken(refreshToken) {
        const tokenData = await knex('tokens')
            .where({ refreshToken: refreshToken })
            .del()
        return tokenData
    }

    /**
     * Find token in database
     * @param {string} refreshToken
     * @returns {string} - found token
     */
    async findToken(refreshToken) {
        const tokenData = await knex('tokens')
            .select('*')
            .where({ refreshToken: refreshToken })
            .first()
        return tokenData
    }
}

module.exports = new TokenService ()
