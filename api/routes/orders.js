const express = require('express')

// Controllers
const OrdersController = require('./../controllers/orders')

// Auth
const checkAuth = require('./../middleware/check-auth')

const router = express.Router()

router.get('/', checkAuth, OrdersController.getAll)
router.get('/:orderID', checkAuth, OrdersController.getOne)
router.post('/', checkAuth, OrdersController.create)
router.patch('/:orderID', checkAuth, OrdersController.update)
router.delete('/:orderID', checkAuth, OrdersController.delete)

module.exports = router