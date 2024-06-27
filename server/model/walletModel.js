const mongoose = require('mongoose');
const objectID = mongoose.Schema.Types.ObjectId;

const transactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  type: String,
  transactionDate: {
    type: Date,
    default: Date.now,
  }
}, {
  _id: false 
});

const walletSchema = mongoose.Schema({
  user: {
    type: objectID,
    ref: 'User',
    required: true
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema], 
}, {
  timestamps: true
});

module.exports = mongoose.model('Wallet', walletSchema);