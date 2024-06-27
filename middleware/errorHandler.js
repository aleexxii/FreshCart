const { param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateObjectId = [
  param('productId').custom(value => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ObjectId');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('error-handler', { message: 'Invalid product ID' });
    }
    next();
  }
];

module.exports = { validateObjectId };
