const knex = require('../db')
const CustomError = require('../handlers/errorHandler')
const UserDto = require('../dtos/userDto')
const tokenService = require('../services/tokenService')


class UserService {
    async getAllUsers(req, res) {
        const [user] = await knex('users')
            .select('*')
        if (!user) {
            res.status(404).send({error: {code: 404, message: 'users not found'}})
            return
        }
        res.status(200).send(user)
    }
}

module.exports = new UserService()
