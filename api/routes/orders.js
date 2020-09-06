const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        msg: "GET route /orders"
    })
})

router.post('/', (req, res, next) => {
    const {productID, quantity} = req.body
    const order = {
        productID,
        quantity
    }

    res.status(201).json({
        msg: "POST order was created!",
        order
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