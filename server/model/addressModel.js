const mongoose = require('mongoose')

const addressShcema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    firstname: {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    district : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    pincode : {
        type : Number,
        required : true
    },
    landmark :{
        type : String,
        required : true
    },
    isDefault :{
        type : Boolean
    }
})

const Address = mongoose.model('Address' , addressShcema)

module.exports = Address
