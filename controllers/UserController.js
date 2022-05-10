const { v4: uuidv4 } = require('uuid')

const knex = require('../db')
const crypto = require('crypto')
const { promisify } = require('util')
const scrypt = promisify(crypto.scrypt)
const tokenService = require('../services/tokenService')
const UserDto = require('../dtos/userDto')
const EmailService = require('../services/emailService');
const AuthService = require('../services/authService')

class UserController {

    async getUsers(req, res) {
        const [user] = await knex('users')
            .select('*')
        if (!user) {
            res.status(404).send({error: {code: 404, message: 'users not found'}})
            return
        }
        res.status(200).send(user)
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

    async createUser(req, res) {
        const { username, email, password } = req.body

        const isUserInDb = await AuthService.checkUserInDb({ username })
        if (isUserInDb) {
            req.status(400).send({ error: {code: 400, message: 'this username already exist' }})
            return
        }
        const salt = crypto.randomBytes(8).toString('hex')
        const derivedKey = await scrypt(password, salt, 64)
        const encryptedPassword = `${salt}:${derivedKey.toString('hex')}`

        // const activationLink = uuid.v4();
        const activationLink = uuidv4();


        const trx = await knex.transaction()
        const [user] = await trx('users').insert({
            username: username,
            password: encryptedPassword,
            email: email,
            is_activated: false,
            activation_link: activationLink
        }).returning('*')


    await trx.commit()
        if (!user) {
            res.status(404).send({error: {code: 404, message: 'user not register'}})
            return
        }

        const userDto = new UserDto(user)
        await EmailService.sendMailActivation(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)

        // await sendMailActivation(email, activationLink)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }) //https: true
        res.status(200).send(user)

        return {
            ...tokens,
            user: userDto
        }
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
