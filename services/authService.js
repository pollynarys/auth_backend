const knex = require('../db')
const CustomError = require('../handlers/errorHandler')
const UserDto = require('../dtos/userDto')
const tokenService = require('../services/tokenService')
const crypto = require('crypto')
const { promisify } = require('util')
const {v4: uuidv4} = require("uuid");
const EmailService = require("../services/emailService");
const scrypt = promisify(crypto.scrypt)

const encryptString = async (str) => {
    const salt = crypto.randomBytes(8).toString('hex')
    const derivedKey = await scrypt(str, salt, 64)
    return `${salt}:${derivedKey.toString('hex')}`
}


class AuthService {

    checkUserInDb = async ({ username }) => {
        const [user] = await knex('users')
            .select('*')
            .where({ username })
        return !!user
    }

    async register(username, email, password) {
        const isUserInDb = await AuthService.checkUserInDb({ username })
        if (isUserInDb) {
            throw CustomError.BadRequest('this username already exist')
            return
        }
        const encryptedPassword = await encryptString(password)
        const activationLink = uuidv4()

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

    async login(email, password) {
        const user = await knex('users')
            .select('*')
            .where({ email: email })
            .first()
        if (!user) {
            throw CustomError.BadRequest('user not found')
            return
        }
        const isPassCompare = await this.encryptString(password)

        if (!isPassCompare) {
            throw CustomError.BadRequest('uncorrected password')
        }
        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: UserDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }


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

