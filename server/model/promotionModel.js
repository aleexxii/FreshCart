const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  linkUrl: String,
  position: String, // top-right-promo, bottom-right-promo
});

module.exports = mongoose.model('Promotion', PromotionSchema);
