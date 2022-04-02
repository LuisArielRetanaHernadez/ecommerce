/* eslint-disable linebreak-style */

// jwt
const jwt = require('jsonwebtoken');

// util
const { promisify } = require('util');

// models
const { User } = require('../models/user.model');
// const { Product } = require('../models/product.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/AppError');

require('dotenv').config();

exports.protectSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization
        && req.headers.authorization.startsWith('Bearer')
  // eslint-disable-next-line prefer-destructuring
  ) token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('session invalid', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded) return next(new AppError('token invalid', 401));

  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: decoded.id,
      status: 'enabled',
    },
  });

  if (!user) {
    return next(new AppError('user error in login', 401));
  }

  req.currentUser = user;
  next();
  return null;
});
