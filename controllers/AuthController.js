const knex = require("../db");
const AuthService = require('../services/authService')

class AuthController {
    async login(req, res, next) {
        try {

        } catch (e) {
            next(e)

        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {
            next(e)

        }

    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await AuthService.activate(activationLink)
            console.log('req.params.link', req.params.link, 'link', activationLink)
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AuthController ()
