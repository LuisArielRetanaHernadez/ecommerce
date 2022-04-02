/* eslint-disable linebreak-style */

// bcrypt
const bcrypt = require('bcryptjs');

// jwt
const jwt = require('jsonwebtoken');

// models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');

// utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

// dotenv
require('dotenv').config();

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
      status: 'enabled',
    },
  });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return next(new AppError('invalid credentials', 404));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookiesOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 60 * 60 * 1000,
    ),
  };

  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

  res.cookie('jwt', token, cookiesOptions);

  user.password = undefined;

  return res.status(200).json({
    status: 'success',
    data: {
      user,
      token,
    },
    message: 'successfully logged in',
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const {
    username,
    password,
    email,
  } = req.body;

  const saltBcry = await bcrypt.genSalt(15);
  const passwordBcry = await bcrypt.hash(password, saltBcry);

  const newUser = await User.create({
    username,
    email,
    password: passwordBcry,
  });

  if (!newUser) return next(new AppError('error, existing data', 404));

  newUser.password = undefined;

  return res.status(202).json({
    status: 'success',
    data: newUser,
    message: 'user created successfully',
  });
});

exports.getProductsByUserId = catchAsync(async (req, res) => {
  const { id } = req.currentUser;

  const products = await Product.findAll({
    where: {
      userId: id,
      status: 'enabled',
    },
  });

  return res.status(202).json({
    status: 'success',
    data: products,
    message: 'products found successfully',
  });
});

exports.patchUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const {
    username,
    email,
  } = req.body;

  await user.update({
    username,
    email,
  });

  if (!user) return next(new AppError('error, duplicate data or incorrect data', 404));

  return res.status(204).json({
    status: 'success',
    message: 'data updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  user.update({
    status: 'disabled',
  });

  return res.status(204).json({
    status: 'success',
    message: 'successfully deleted user',
  });
});

exports.getOrdersOfUser = catchAsync(async (req, res) => {
  const { id } = req.currentUser;

  const ordersOfUser = await Order.findAll({
    where: {
      userId: id,
    },
    include: [{
      model: Cart,
      include: [{
        model: ProductInCart,
        include: [{
          model: Product,
        }],
      }],
    }],
  });

  return res.status(202).json({
    status: 'success',
    data: ordersOfUser,
    message: 'user commands successfully',
  });
});

exports.getOrderOfUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const orderOfUser = Order.findOne({
    where: {
      userId: id,
    },
    include: [{
      model: Cart,
      include: [{
        model: ProductInCart,
        include: [{
          model: Product,
        }],
      }],
    }],
  });

  return res.status(202).json({
    status: 'success',
    data: orderOfUser,
    message: 'user commands successfully',
  });
});
