const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    rating : {
        type : Number
    },
    headline : {
        type : String
    },
    description : {
        type : String
    },
    image : [String]
},{timestamps : true})

const review = mongoose.model('review',reviewSchema)
module.exports = review 