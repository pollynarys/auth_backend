const knex = require('../db');

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
            throw new Error('uncorrected activation link')
        }

        await knex('users')
            .where({ activation_link: activationLink })
            .update({ is_activated: true })
    }

}

// const checkUserInDb = async ({ username }) => {
//     const [user] = await knex('users')
//         .select('*')
//         .where({ username })
//     return !!user
// }



module.exports = new AuthService()

// module.exports = {
//     checkUserInDb
// }
