/* eslint-disable linebreak-style */

// models
const { Product } = require('../models/product.model');

// utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    quantity,
    pice,
  } = req.body;

  if (quantity <= 0) return next(new AppError('product quantity must be greater than 0', 404));

  const product = await Product.create({
    title,
    description,
    quantity,
    pice,
    userId: req.currentUser.id,
  });

  return res.status(202).json({
    status: 'success',
    data: product,
    message: 'successfully created product',
  });
});

exports.getProductsEnabled = catchAsync(async (req, res) => {
  const produts = await Product.findAll({
    where: {
      status: 'enabled',
    },
  });

  return res.status(202).json({
    status: 'success',
    data: produts,
    message: 'products successfully',
  });
});

exports.getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: {
      id,
      status: 'enabled',
    },
  });

  return res.status(202).json({
    status: 'success',
    data: product,
    message: 'products successfully',
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const { product } = req;

  await product.update({
    status: 'disabled',
  });

  return res.status(204).json({
    status: 'success',
    message: 'product removed successfully',
  });
});

exports.patchProduct = catchAsync(async (req, res) => {
  const { product } = req;
  const {
    title,
    description,
    pice,
    quantity,
  } = req.body;

  await product.update({
    title,
    description,
    pice,
    quantity,
  });

  return res.status(204).json({
    status: 'success',
    message: 'product upgraded successfully',
  });
});
