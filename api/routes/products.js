const express = require('express')
const mongoose = require('mongoose')

const Product = require('./../../models/product')

const router = express.Router()

const baseUrl = process.env.BASE_URL || 'http://localhost:8080'
const productsUrl = baseUrl + '/products/'

router.get('/', (req, res, next) => {

    Product.find({})
    .select('name price _id')
    .then(products => {
        const response = {
            msg: 'success',
            count: products.length,
            products: products.map(product => {
                return {
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    request: {
                        type: 'GET',
                        url: productsUrl + product._id
                    }
                }
            })
        }

        res.status(200).json(response)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
})

router.get('/:productID', (req, res, next) => {
    const {productID} = req.params

    Product.findById(productID)
    .select('name price _id')
    .then(product => {

        if(!product){
            return res.status(404).json({
                msg: 'Product not found!'
            })
        }

        res.status(200).json({
            msg: "success",
            product: {
                name: product.name,
                price: product.price,
                _id: product._id,
                request: {
                    type: 'GET',
                    url: productsUrl
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
})

router.post('/', (req, res, next) => {
    const {name, price} = req.body
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name,
        price
    })

    product.save()
    .then(newProduct => {
        res.status(201).json({
            msg: "success",
            product: {
                name: newProduct.name,
                price: newProduct.price,
                _id: newProduct._id,
                request: {
                    type: 'GET',
                    url: productsUrl + newProduct._id
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
})

router.patch('/:productID', (req, res, next) => {
    const {productID: _id} = req.params
    const product = {}
    for (const ops of req.body) {
        product[ops.propName] = ops.value
    }

    Product.update({_id}, {$set: product})
    .then(result => {
        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: productsUrl + _id
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
})

router.delete('/:productID', (req, res, next) => {
    const {productID: _id} = req.params

    Product.remove({_id})
    .then(result => {
        res.status(200).json({
            msg: "success",
            request: {
                type: 'POST',
                url: productsUrl,
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
})

module.exports = router