const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('./../../models/user')

const router = express.Router()

router.post('/signup', (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(404).json({
            msg: "Email and password are required!"
        })
    }

    User.find({email})
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                msg: "Email has been used!"
            })

        }else{
            bcrypt.hash(password, 10, (error, encryptedPassword) => {
                if(error){
                    return res.status(500).json({
                        msg: 'Server error!',
                        error
                    })

                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email,
                        password: encryptedPassword
                    })

                    user.save()
                    .then(newUser => {
                        res.status(201).json({
                            msg: 'success'
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            msg: 'Server error!',
                            error
                        })
                    })
                }
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
})

module.exports = router