const express = require('express')
const mongoose = require('mongoose')

const Product = require('./../../models/product')

const router = express.Router()

router.get('/', (req, res, next) => {

    Product.find({})
    .then(docs => {
        res.status(200).json({
            msg: "GET route /products",
            products: docs
        })
    })
    .catch(err => console.log(err))
})

router.get('/:productID', (req, res, next) => {
    const {productID} = req.params

    Product.findById(productID)
    .then(doc => {
        res.status(200).json({
            msg: "GET route /products/:productID",
            product: doc
        })
    })
    .catch(err => console.log(err))
})

router.post('/', (req, res, next) => {
    const {name, price} = req.body
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name,
        price
    })

    product.save()
    .then(res => console.log(res))
    .catch(err => console.log(err))

    res.status(201).json({
        msg: "POST product was created!",
        product
    })
})

router.put('/:productID', (req, res, next) => {
    const {productID} = req.params

    Product.findById(id)
    .then(doc => {
        res.status(200).json({
            msg: "PUT route /products/:productID",
            id: productID
        })
    })
    .catch(err => console.log(err))
})

router.patch('/:productID', (req, res, next) => {
    const {productID} = req.params

    res.status(200).json({
        msg: "PATCH route /products/:productID",
        id: productID
    })
})

router.delete('/:productID', (req, res, next) => {
    const {productID} = req.params

    res.status(200).json({
        msg: "DELETE route /products/:productID",
        id: productID
    })
})

module.exports = router