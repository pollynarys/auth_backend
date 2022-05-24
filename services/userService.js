const knex = require('../db')

class UserService {
    /**
     * Check user in database
     * @param {string} username
     * @returns {object | null} - userData or null in the event of an error
     */
    checkUserInDb = async ({ username }) => {
        const [user] = await knex('users')
            .select('*')
            .where({ username })
        return !!user
    }

    /**
     * Get all users. Available at for authorized users
     */
    async getAllUsers(req, res) {
        const [users] = await knex('users')
            .select('*')
        if (!users) {
            res.status(404).send({error: {code: 404, message: 'users not found'}})
            return
        }
        res.status(200).send(users)
    }
}

module.exports = new UserService()
