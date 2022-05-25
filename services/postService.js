const knex = require("../db");

class PostService {
    /**
     * Get user all posts
     * @param {object} userId
     * @returns {object} result of search
     */
    async getUsersPosts(userId) {
        const [posts] = await knex('posts')
            .select('*')
            .where({user_id: userId})
        return !!posts
    }

    /**
     * Get all posts
     * @returns {object} result of search
     */
    async getAllPosts() {
        const posts = await knex('posts')
            .select('*')
        return posts
    }

    /**
     * Create post
     * @param {string} title
     * @param {string} content
     * @param {string} userId
     * @returns {object} - new post
     */
    async createPost(title, content, userId) {
        const trx = await knex.transaction()
        const [post] = await trx('post').insert({
            title: title,
            content: content,
            userId: userId
        }).returning('*')

        await trx.commit()
        return post
    }

    /**
     * Delete post
     * @param {object} userId
     * @returns {object} - remote post
     */
    async deletePost(title, userId) {
        const [post] = await knex('posts')
            .where({user_id: userId})
            .where({title: title})
            .del()
        return !!post
    }
}

module.exports = new PostService()
