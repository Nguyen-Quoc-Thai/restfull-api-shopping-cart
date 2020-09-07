const express = require('express')
const mongoose = require('mongoose')

const Order = require('./../../models/order')
const Product = require('./../../models/product')

const router = express.Router()

const baseUrl = process.env.BASE_URL || 'http://localhost:8080'
const ordersUrl = baseUrl + '/orders/'

router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .then(orders => {
        res.status(200).json({
            msg: 'success',
            count: orders.length,
            orders: orders.map(order => {
                return {
                    product: order.product,
                    quantity: order.quantity,
                    _id: order._id,
                    request: {
                        type: 'GET',
                        url: ordersUrl + order._id
                    }
                }
            })
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
})

router.post('/', (req, res, next) => {
    const {productID, quantity} = req.body
    const order = new Order ({
        _id: new mongoose.Types.ObjectId(),
        product: productID,
        quantity
    })

    Product.findById(productID)
    .then(product => {
        console.log(1234)
        if(!product){
            return res.status(404).json({
                msg: 'Product not found!'
            })
        }

        order.save()
        .then(newOrder => {
            res.status(201).json({
                msg: 'success',
                order: {
                    product: newOrder.product,
                    quantity: newOrder.quantity,
                    _id: newOrder._id,
                    request:{
                       type: 'GET',
                       url: ordersUrl + newOrder._id
                    }
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: 'Server error!',
                error
            })
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
})

router.put('/:orderID', (req, res, next) => {
    const {orderID} = req.params

    res.status(200).json({
        msg: "PUT route /orders/:orderID",
        id: orderID
    })
})

router.patch('/:orderID', (req, res, next) => {
    const {orderID} = req.params

    res.status(200).json({
        msg: "PATCH route /orders/:orderID",
        id: orderID
    })
})

router.delete('/:orderID', (req, res, next) => {
    const {orderID} = req.params

    res.status(200).json({
        msg: "DELETE route /orders/:orderID",
        id: orderID
    })
})

module.exports = router