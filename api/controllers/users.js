const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./../models/user')

const { sendMail } = require('./../config/nodemailer')

const baseUrl = process.env.BASE_URL || 'http://localhost:8080'
const usersUrl = baseUrl + '/users/'
const jwtKey = process.env.JWT_KEY || 'Secret_key_JWT'

exports.signup =  (req, res, next) => {
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
            sendMail(email)

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
}

exports.login = (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(404).json({
            msg: 'Email and password are required!'
        })
    }

    User.find({email})
    .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                msg: 'Auth failed!'
            })

        }else{
            bcrypt.compare(password, user[0].password, (error, matched) => {
                if(error){
                    return res.status(404).json({
                        msg: 'Auth failed!'
                    })

                }else{
                    if(matched){
                        const payloadToken = {
                            email: user[0].email,
                            uID: user[0]._id
                        }
                        const signOptions = {
                            expiresIn: '8h'
                        }
                        const token = jwt.sign(
                            payloadToken,
                            jwtKey,
                            signOptions
                        )

                        return res.status(200).json({
                            msg: 'Auth successfully!',
                            token
                        })
                    }
                }

                res.status(404).json({
                    msg: 'Auth failed!'
                })
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.delete =  (req, res, next) => {
    const {userID: _id} = req.params

    User.deleteOne({_id})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'POST',
                url: usersUrl + 'signup',
                body:{
                    email: "String",
                    password: "String"
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
}