const mongoose = require('mongoose')

const productScheme = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
})

module.exports = mongoose.model('Product', productScheme)