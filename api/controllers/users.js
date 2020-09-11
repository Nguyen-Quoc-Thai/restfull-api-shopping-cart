const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const User = require('./../models/user')
const Token = require('./../models/token')

const { sendMail } = require('./../config/nodemailer')

const baseUrl = process.env.BASE_URL
const usersUrl = baseUrl + '/users/'
const jwtKey = process.env.JWT_KEY

exports.signup =  (req, res, next) => {
    const {name, email, password} = req.body

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
                        name,
                        email,
                        password: encryptedPassword
                    })

                    user.save()
                    .then(newUser => {
                        const token = crypto.randomBytes(16).toString('hex')
                        const tokenObj = new Token({
                            _id: new mongoose.Types.ObjectId(),
                            userID: newUser._id,
                            token
                        })

                        tokenObj.save()
                        .then(userReg => {
                            sendMail(newUser.email, userReg.token)
                        })
                        .catch(error => {
                            res.status(500).json({
                                msg: 'Server error!',
                                error
                            })
                        })

                        res.status(201).json({
                            msg: "success"
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
                        const { email, _id, isVerified } = user[0]
                        const payloadToken = { email, _id }
                        const signOptions = { expiresIn: '8h' }
                        const token = jwt.sign( payloadToken, jwtKey, signOptions )

                        if(!isVerified) {
                            return res.status(401).json({
                                msg: "Your account has not been verified!"
                            })
                        }

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

exports.confirmation = (req, res, next) => {
    const {verifyToken: token} = req.params

    Token.findOne({token})
    .then(tokenObj => {
        if(!tokenObj){
            return res.status(404).json({
                msg: 'Invalid token!'
            })
        }

        User.findOne({_id: tokenObj.userID})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    msg: 'Invalid token!'
                })
            }

            if(user.isVerified){
                return res.status(200).json({
                    msg: 'Your account has already been verified!'
                })
            }

            user.isVerified = true

            user.save((error) => {
                if(error) {
                    return res.status(500).json({
                        msg: 'Server error!',
                        error
                    })
                }

                res.status(200).json({
                    msg: 'The account has been verified! Please log in!'
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
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.resend = (req, res, next) => {
    const {email} = req.body

    if(!email) {
        res.status(404).json({
            msg: 'Email is required!'
        })
    }

    User.findOne({email}).
    then(user => {
        if(!user) {
            return res.status(404).json({
                msg: 'Email not found!'
            })
        }

        if(user.isVerified) {
            return res.status(200).json({
                msg: 'This account has already been verified. Please log in.'
            })
        }

        const token = crypto.randomBytes(16).toString('hex')
        const tokenObj = new Token({
            _id: new mongoose.Types.ObjectId(),
            userID: user._id,
            token
        })

        tokenObj.save()
        .then(userReg => {
            sendMail(email, userReg.token)

            res.status(200).json({
                msg: `A verification email has been sent to ${email}`
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
}