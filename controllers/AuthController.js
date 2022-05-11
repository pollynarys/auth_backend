const knex = require('../db')
const AuthService = require('../services/authService')

class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await AuthService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }) //https: true
            return res.json(userData)

        } catch (e) {
            next(e)

        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await AuthService.logout(refreshToken)
            res.clear.cookie('refreshToken')
            return res.json(token) // status 200
        } catch (e) {
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
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body
            const userData = await AuthService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }) //https: true
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AuthController ()
