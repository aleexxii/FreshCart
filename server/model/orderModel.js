const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderDate : {
        type : Date,
        default : Date.now()
    },
    paymentMethod : {
        type : String,
        required : true
    },
    orderStatus : {
        type : String,
        default : 'Order Placed'
    },
    address : {
        type : String,
        required : true
    },
    transaction_Amt : {
        type : Number,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    products : {
        type : Array,
        required : true
    }
},{
    timestamps : true
})

const Order = mongoose.model( 'order', orderSchema )
module.exports = Order