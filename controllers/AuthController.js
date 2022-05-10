const knex = require("../db");
const AuthService = require('../services/authService')

class AuthController {
    async login(req, res, next) {
        try {

        } catch (e) {

        }
    }

    async logout(req, res) {
        try {

        } catch (e) {

        }

    }

    async activate(req, res) {
        try {
            const activationLink = req.params.link
            await AuthService.activate(activationLink)
            console.log('req.params.link', req.params.link, 'link', activationLink)
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            console.log(e)
        }
    }

    async refresh(req, res) {
        try {

        } catch (e) {

        }
    }
}

module.exports = new AuthController ()
