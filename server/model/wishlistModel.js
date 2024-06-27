const { name } = require('ejs')
const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    products : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'products'
            }
        }
    ]
})

const wishlist = mongoose.model('wishlist',wishlistSchema)
module.exports = wishlist