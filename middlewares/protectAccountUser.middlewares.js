/* eslint-disable linebreak-style */

// models
const { User } = require('../models/user.model');

// utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

exports.userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: 'enabled',
    },
    attributes: {
      exclude: ['password'],
    },
  });

  if (!user) return next(new AppError('invalid user', 404));

  req.user = user;

  next();

  return null;
});

exports.protectAccount = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { id } = req.params;

  if (+id !== currentUser.id) {
    return next(new AppError('danger, enter your own account'), 404);
  }

  next();

  return null;
});
