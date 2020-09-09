const express = require('express')

const upload =  require('./../config/upload')

const ProductsController = require('./../controllers/products')

const checkAuth = require('./../middleware/check-auth')

const router = express.Router()

router.get('/', ProductsController.getAll)
router.get('/:productID', ProductsController.getOne)
router.post('/', checkAuth, upload.single('productImage'), ProductsController.create)
router.patch('/:productID', checkAuth, ProductsController.update)
router.delete('/:productID', checkAuth, ProductsController.delete)

module.exports = router