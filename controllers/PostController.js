const knex = require('../db')
const PostService = require('../services/postService')
const logger = require('../logger/logger')

class PostController {

    async getPostsByUser(req, res, next) {
        try {
            const { userId } = req.query

            const [posts] = await PostService.getUsersPosts(userId)
            if (!posts) {
                res.status(404).send({error: {code: 404, message: 'posts not found'}})
                return
            }
            res.status(200).send(posts)
        } catch (e) {
            logger.error('unable to retrieve posts')
            next(e)
        }

    }

    async getPosts(req, res, next) {
        try {
            const posts = await PostService.getAllPosts()
            if (!posts) {
                res.status(404).send({error: {code: 404, message: 'posts not found'}})
                return
            }
            res.status(200).send(posts)
        } catch (e) {
            logger.error('unable to retrieve posts')
            next(e)
        }

    }

    async createPost(req, res, next) {
        try {
            const { title, content } = req.body
            const { userId } = req.query

            const [post] = await PostService.createPost(title, content, userId)
            if (!post) {
                res.status(404).send({error: {code: 404, message: 'unable to create post'}})
                return
            }
            res.status(200).send(post)
        } catch (e) {
            logger.error('unable to create post')
            next(e)
        }
    }
}

module.exports = new PostController ()
