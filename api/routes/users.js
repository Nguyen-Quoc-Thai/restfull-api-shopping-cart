const express = require('express')

const UsersController = require('./../controllers/users')

const router = express.Router()

router.post('/signup', UsersController.signup)
router.post('/login', UsersController.login)
router.delete('/:userID', UsersController.delete)

module.exports = router