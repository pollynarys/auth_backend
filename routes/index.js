const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
const AuthController = require('../controllers/AuthController')
const asyncHandler = require('express')
const Router = require('express');
const router = new Router()

router.get('/api/user/get_users', UserController.getUsers)
router.get('/api/user/:userId/get_user', UserController.getUser)
router.post('/api/user/create_user', UserController.createUser)
router.put('/api/user/update_user', UserController.updateUser)
router.delete('/api/user/:userId/delete_user', UserController.deleteUser)

router.get('/api/posts/:userId/get_posts', PostController.getPosts)
router.get('/api/posts/get_posts', PostController.getPostsByUser)
router.post('/api/posts/create_post', PostController.createPost)

router.post('/api/auth/login', AuthController.login)
router.post('/api/auth/logout', AuthController.logout)

router.get('/api/auth/activate/:link', AuthController.activate)
router.get('/api/auth/refresh', AuthController.refresh)


module.exports = router
