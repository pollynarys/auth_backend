const knex = require('../db')
const CustomError = require('../handlers/errorHandler')
const UserDto = require('../dtos/userDto')
const tokenService = require('../services/tokenService')
const EmailService = require('../services/emailService')
const crypto = require('crypto')
const { promisify } = require('util')
const { v4: uuidv4 } = require('uuid')
const scrypt = promisify(crypto.scrypt)

class AuthService {
    /**
     * Check user in database
     * @param {object} username - Search username
     * @returns {object} result of search
     */
    async checkUserInDb ({ username }) {
        const [user] = await knex('users')
            .select('*')
            .where({ username })
        return !!user
    }

    /**
     * Encrypt the password
     * @param {string} str - password
     * @returns {string} password hash
     */
    async encryptString (str) {
        const salt = crypto.randomBytes(8).toString('hex')
        const derivedKey = await scrypt(str, salt, 64)
        return `${salt}:${derivedKey.toString('hex')}`
    }

    /**
     * Compare password
     * @param {string} str - str
     * @param {string} str - password
     * @returns {string} - decrypted password
     */
    async CompareString (str, password) {

    }


    /**
     * Register user
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @param {string} role
     * @returns {object} access and refresh tokens array, user dto object
     */
    async register(username, email, password, role) {
        const isUserInDb = await this.checkUserInDb({ username })
        if (isUserInDb) {
            throw CustomError.BadRequest('this username already exist')
            return
        }
        const encryptedPassword = await this.encryptString(password)
        const activationLink = uuidv4()

        const trx = await knex.transaction()
        const [user] = await trx('users').insert({
            username: username,
            password: encryptedPassword,
            email: email,
            role: role,
            is_activated: false,
            activation_link: activationLink
        }).returning('*')

        await trx.commit()
        if (!user) {
            throw CustomError.BadRequest('user not register')
            return
        }

        const userDto = new UserDto(user)
        await EmailService.sendMailActivation(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
            ...tokens,
        user: userDto
        }
    }

    /**
     * Activate link
     * @param {string} activationLink
     */
    async activate(activationLink) {
        const [link] = await knex('users')
            .select('*')
            .where({ activation_link: activationLink })

        if (!link) {
            throw CustomError.BadRequest('uncorrected activation link')
        }

        await knex('users')
            .where({ activation_link: activationLink })
            .update({ is_activated: true })
    }

    /**
     * Login user
     * @param {string} email
     * @param {string} password
     * @returns {object} access and refresh tokens array, user dto object
     */
    async login(email, password) {
        const user = await knex('users')
            .select('*')
            .where({ email: email })
            .first()
        if (!user) {
            throw CustomError.BadRequest('user not found')
            return
        }

        const [salt, key] = user.password.split(':')
        const derivedKey = await scrypt(password, salt, 64)
        if (key !== derivedKey.toString('hex')) {
            throw new Error('Wrong username or password')
        }

        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: UserDto
        }
    }

    /**
     * Logout user
     * @param {string} refreshToken
     * @returns {string} token
     */
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    /**
     * Refresh token
     * @param {string} refreshToken
     * @returns {object} access and refresh tokens array, user dto object
     */
    async refresh(refreshToken) {
        if (!refreshToken) throw CustomError.UnauthorizedErr()

        const userData = await tokenService.validateRefreshToken(refreshToken)
        const checkTokenInDb = tokenService.findToken(refreshToken)
        if (!userData || !checkTokenInDb) {
            throw CustomError.UnauthorizedErr()
        }
        const user = await knex('users')
            .select('*')
            .where({ id: userData.userId })
            .first()

        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: UserDto
        }
    }
}

module.exports = new AuthService()

