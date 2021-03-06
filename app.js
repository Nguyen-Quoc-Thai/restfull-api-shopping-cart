const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const productRouters = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')

const connectDB = require('./api/config/db')

const app = express()

connectDB()

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use('/products', productRouters)
app.use('/orders', orderRoutes)
app.use('/users', userRoutes)

// Handling errors
app.use((req, res, next) => {
    const error = new Error('Not found!')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        msg: error.message
    })
})

module.exports = app