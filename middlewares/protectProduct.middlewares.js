/* eslint-disable linebreak-style */

// models
const { Product } = require('../models/product.model');

// utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

exports.protectProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { id } = req.params;

  const product = await Product.findOne({
    where: {
      id,
      userId: currentUser.id,
      status: 'enabled',
    },
  });

  if (!product) return next(new AppError('invalid product id', 404));

  req.product = product;

  next();

  return null;
});
