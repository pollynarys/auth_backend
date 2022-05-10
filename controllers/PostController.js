const knex = require('../db')

class PostController {

    async getPosts(req, res) {
        const [posts] = await knex('posts')
            .select('*')
        if (!posts) {
            res.status(404).send({error: {code: 404, message: 'users not found'}})
            return
        }
        res.status(200).send(posts)
    }

    async getPostsByUser(req, res) {
        const { userId } = req.query

        const posts = await knex('posts')
            .select('*')
            .where({ user_id: userId })
            .first()
        if (!posts) {
            res.status(404).send({error: {code: 404, message: 'posts not found'}})
            return
        }
        res.status(200).send(posts)
    }

    async createPost(req, res) {
        const { title, content, userId } = req.body

        const trx = await knex.transaction()
        const [post] = await trx('post').insert({
            title: title,
            content: content,
            userId: userId
        }).returning('*')

        await trx.commit()
        if (!post) {
            res.status(404).send({error: {code: 404, message: 'post not create'}})
            return
        }
        res.status(200).send(post)
    }

    // async updatePost(req, res) {
    //     const { id, username, userId } = req.body
    //
    //     const user = await knex('user')
    //         .where({ id: id })
    //         .update({ username })
    //         // .update({ password })
    //         .returning('*')
    //     res.status(200).send(user)
    // }

    // async deleteUser(req, res) {
    //     const { userId } = req.params
    //
    //     const user = await knex('user')
    //         .where({ id: userId })
    //         .del()
    //     res.status(200)
    // }

}

module.exports = new PostController ()
