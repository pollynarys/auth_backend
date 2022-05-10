const knex = require('../db')
const nodemailer = require('nodemailer')

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }
    async sendMailActivation (to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'activation account ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>to activate follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })

    }

}

module.exports = new EmailService ()
