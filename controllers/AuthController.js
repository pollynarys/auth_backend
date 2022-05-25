const AuthService = require('../services/authService')
const logger = require('../logger/logger')
const { MONTH } = require('../const')
const {validationResult} = require('express-validator')
const CustomError = require('../handlers/errorHandler')

class AuthController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next (CustomError.BadRequest('validation error', errors.array()))
            }

            const { username, email , password, role } = req.body
            const userData = await AuthService.register(username, email , password, role)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: MONTH, httpOnly: true, https: true }) //https: true
            res.status(200).send(userData)
        } catch (e) {
            logger.error('Unable to register')
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await AuthService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: MONTH, httpOnly: true }) //https: true
            return res.json(userData)

        } catch (e) {
            logger.error('Unable to login')
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await AuthService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token) // status 200
        } catch (e) {
            logger.error('Unable to logout')
            next(e)
        }

    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await AuthService.activate(activationLink)
            console.log('req.params.link', req.params.link, 'link', activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            logger.error('Unable to get activation link')
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body
            const userData = await AuthService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: MONTH, httpOnly: true }) //https: true
            return res.json(userData)
        } catch (e) {
            logger.error('Unable to refresh token')
            next(e)
        }
    }
}

module.exports = new AuthController ()
