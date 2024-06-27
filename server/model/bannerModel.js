const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    backgroundImageUrl: {
        type: String,
        // required: true
    },
    badgeText: {
        type: String,
        // required: true
    },
    badgeColor: {
        type: String,
        default: 'bg-danger'
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        required: true
    },
    buttonText: {
        type: String,
        default: 'Shop Deals Now'
    },
    buttonUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
