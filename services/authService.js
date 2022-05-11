const knex = require('../db')
const CustomError = require('../handlers/errorHandler')
const UserDto = require('../dtos/userDto')
const tokenService = require('../services/tokenService')


class AuthService {

    checkUserInDb = async ({ username }) => {
        const [user] = await knex('users')
            .select('*')
            .where({ username })
        return !!user
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
        const isPassCompare = await bcrypt.compare(password, user.password)
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

