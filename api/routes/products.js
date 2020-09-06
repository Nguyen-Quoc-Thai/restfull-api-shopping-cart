const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {   
    res.status(200).json({
        msg: "GET route /products"
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        msg: "POST route /products"
    })
})

router.put('/:productID', (req, res, next) => {
    const {productID} = req.params

    res.status(200).json({
        msg: "PUT route /products/:productID",
        id: productID
    })
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