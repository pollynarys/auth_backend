const knex = require('../db')
const UserService = require('../services/userService')
const logger = require("../logger/logger");

class UserController {

    async getUsers(req, res, next) {
        try {
            const users = UserService.getAllUsers()
            return res.json(users)
        } catch (e) {
            logger.error('Unable to get users')
            next(e)
        }
    }

    async getUser(req, res) {
        const { userId } = req.params

        const user = await knex('users')
            .select('*')
            .where({ id: userId })
            .first()
        if (!user) {
            res.status(404).send({ error: {code: 404, message: 'user not found' }})
            return
        }
        res.status(200).send(user)
    }

    async updateUser(req, res) {
        const { id, username } = req.body

        const user = await knex('users')
            .where({ id: id })
            .update({ username })
            // .update({ password })
            .returning('*')
        res.status(200).send(user)

    }

    async deleteUser(req, res) {
        const { userId } = req.params

        const user = await knex('users')
            .where({ id: userId })
            .del()
        res.status(200)
    }
}

module.exports = new UserController ()
