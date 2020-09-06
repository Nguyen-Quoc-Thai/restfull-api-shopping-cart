const express = require('express')

const productRouters = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

const app = express()

app.use('/products', productRouters)
app.use('/orders', orderRoutes)

module.exports = app