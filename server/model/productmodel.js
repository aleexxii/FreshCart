
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    selectedCategory: {
        type: String,
        required: true
    },
    itemWeight: {
        type : Number,
        value: Number,
        unit: String,
        required: true
    },
    // inStock: Boolean,
    productCode: String,
    stockKeepingUnit: Number,        // stock keeping unit
    status: {
        type: String,
        default: 'Available',
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    selectUnits : {
        type : Number,
        required: true
    },
    description : {
        type : String
    },
    image : [
         String
        // type: Buffer
    ],
    contentType: {
        type: String, // Mime type of the image
        // required: true
    },
    deletedAt : {
        type : String,
        default : 'Not-Deleted'
    },
    discount: {
        type: Number,
        default : 0
    }
},{
    timestamps : true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
