const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    code : {
        type : String,
        required : true,
        unique : true
    },
    couponCondition : {
        type : Number,
        required : true
    },
    minPurchase : {
        type : Number,
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    totalCoupon : {
        type : Number,
        required : true
    },
    isActive : {
        type : String,
        default : 'Active'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const coupon = mongoose.model('coupon',couponSchema)
module.exports = coupon