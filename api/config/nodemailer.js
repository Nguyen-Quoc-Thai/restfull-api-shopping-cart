const nodemailer = require("nodemailer")

const user = process.env.HOST_MAIL || 'bathanggayk18@gmail.com'
const pass = process.env.HOST_PASSWORD || 'blogger123'

// create reusable transporter object using the default SMTP transport

exports.sendMail = (receiver) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user, // generated ethereal user
            pass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: '"PA_NQT 👻" <bathanggayk18@gmail.com>', // sender address
        to: receiver, // list of receivers
        subject: "New customer", // Subject line
        text: "Create a new account", // plain text body
        html: "<b>It work!</b>", // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, data) => {
        if(error){
            console.log({
                msg: 'error',
                error
            })
        }else{
            console.log({
                msg: 'success',
                data
            })
        }
    })
}