const express = require('express')
const mongoose = require('mongoose')

const Order = require('./../models/order')
const Product = require('./../models/product')

const checkAuth = require('./../middleware/check-auth')

const router = express.Router()

const baseUrl = process.env.BASE_URL || 'http://localhost:8080'
const ordersUrl = baseUrl + '/orders/'

router.get('/', checkAuth, (req, res, next) => {
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

router.get('/:orderID', checkAuth, (req, res, next) => {
    const {orderID} = req.params

    Order.findById(orderID)
    .select('product quantity _id')
    .then(order => {
        if(!order){
            return res.status(404).json({
                msg: 'Order not found!'
            })
        }

        res.status(200).json({
            msg: 'success',
            order: {
                product: order.product,
                quantity: order.quantity,
                _id: order._id,
                request: {
                    type: 'GET',
                    url: ordersUrl
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

router.post('/', checkAuth, (req, res, next) => {
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

router.patch('/:orderID', checkAuth, (req, res, next) => {
    const {orderID: _id} = req.params
    const order = {}
    for (const ops of req.body){
        order[ops.propName] = ops.value
    }

    Order.update({_id}, {$set: order})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'GET',
                url: ordersUrl + _id
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

router.delete('/:orderID', checkAuth, (req, res, next) => {
    const {orderID: _id} = req.params

    Order.deleteOne({_id})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'POST',
                url: ordersUrl,
                body: {
                    product: 'Object productID',
                    quantity: 'Number'
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

module.exports = router