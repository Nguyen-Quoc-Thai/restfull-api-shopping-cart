const nodemailer = require("nodemailer")

const user = process.env.HOST_MAIL
const pass = process.env.HOST_PASSWORD
const baseUrl = process.env.BASE_URL

// create reusable transporter object using the default SMTP transport

exports.sendMail = (receiver, token) => {
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

    const url = `${baseUrl}/users/signup/confirmation/${token}`

    const mailOptions = {
        from: '"Request verify ✔ "<bathanggayk18@gmail.com>', // sender address
        to: receiver, // list of receivers
        subject: "New user", // Subject line
        text: "Verify your account !", // plain text body
        html: `<b>Click the link below to verify</b> <hr> <a href=${url}>${url}</a>`, // html body
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