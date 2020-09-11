const mongoose = require('mongoose')

const orderScheme = mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId },
    product: {type: mongoose.Types.ObjectId, required: true, ref: 'Product'},
    quantity: {type: Number,  default: 1},
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
})

module.exports = mongoose.model('Order', orderScheme)