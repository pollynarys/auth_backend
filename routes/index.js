const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
const AuthController = require('../controllers/AuthController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const { body } = require('express-validator')

const Router = require('express')
const router = new Router()

router.post('/api/auth/register',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    AuthController.register)
router.post('/api/auth/login', AuthController.login)
router.post('/api/auth/logout', AuthController.logout)
router.get('/api/auth/activate/:link', AuthController.activate)
router.get('/api/auth/refresh', AuthController.refresh)

router.get('/api/user/get_users', roleMiddleware(['admin', 'insurer']), UserController.getUsers)
router.get('/api/user/:userId/get_user', UserController.getUser)
router.put('/api/user/update_user', UserController.updateUser)
router.delete('/api/user/:userId/delete_user', UserController.deleteUser)

router.get('/api/posts/:userId/get_posts', authMiddleware, PostController.getPostsByUser)
router.get('/api/posts/get_all_posts', roleMiddleware(['admin']), PostController.getPosts)
router.post('/api/posts/create_post', authMiddleware, PostController.createPost)

module.exports = router
