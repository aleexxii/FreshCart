const mongoose = require('mongoose')

const adminLoginSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

const Admin = mongoose.model('admin' , adminLoginSchema)

module.exports = Admin