const mongoose = require('mongoose')

// Define the Schema for the Category Model
const categorySchema = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    },
    description: {
        type: String
    },
    discount: {
        type: Number
    },
    deletedAt: {
        type: String,
        default: 'listed'
    },
    image: [{
        type : String
    }]
})

const Category = mongoose.model('Category',categorySchema)
module.exports = Category