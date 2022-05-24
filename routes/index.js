const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
const AuthController = require('../controllers/AuthController')
const Router = require('express')
const router = new Router()
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.post('/api/auth/register',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    AuthController.register)
router.post('/api/auth/login', AuthController.login)
router.post('/api/auth/logout', AuthController.logout)

router.get('/api/auth/activate/:link', AuthController.activate)
router.get('/api/auth/refresh', AuthController.refresh)

// router.get('/api/user/get_users', authMiddleware, UserController.getUsers)
router.get('/api/user/get_users', roleMiddleware(['admin']), UserController.getUsers)

router.get('/api/user/:userId/get_user', UserController.getUser)
router.put('/api/user/update_user', UserController.updateUser)
router.delete('/api/user/:userId/delete_user', UserController.deleteUser)

router.get('/api/posts/:userId/get_posts', PostController.getPosts)
router.get('/api/posts/get_posts', PostController.getPostsByUser)
router.post('/api/posts/create_post', PostController.createPost)

module.exports = router
