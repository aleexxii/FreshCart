const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    otp : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    createdAt: {
         type: Date, default: Date.now, expires: '60s'
    }
})
const OTP = mongoose.model('user_email_OTP' , otpSchema)
module.exports = OTP