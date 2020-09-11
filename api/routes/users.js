const express = require('express')

const UsersController = require('./../controllers/users')

const router = express.Router()

router.post('/signup', UsersController.signup)
router.get('/signup/confirmation/:verifyToken', UsersController.confirmation)
router.post('/signup/resend', UsersController.resend)
router.post('/login', UsersController.login)
router.delete('/:userID', UsersController.delete)

module.exports = router