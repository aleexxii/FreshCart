const mongoose = require('mongoose')


const cartItemSchema = new mongoose.Schema({
    userId: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    couponId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'coupon'
    },
    isCoupon : {
        type : Boolean,
        default : false
    },
  }, {
    timestamps: true
  });

const cartItem = mongoose.model('cartitem' , cartItemSchema )

module.exports = cartItem