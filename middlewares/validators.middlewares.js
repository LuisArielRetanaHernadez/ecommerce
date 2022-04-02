/* eslint-disable linebreak-style */
const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

// Products validations
exports.createProductValidations = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Must provide a valid title'),
  body('description')
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('Must provide a valid description'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
  body('pice')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
];

// END: Products validations

// Cart validations
exports.addProductToCartValidation = [
  body('productId')
    .isNumeric()
    .withMessage('Product id must be a number')
    .custom((value) => value > 0)
    .withMessage('Must provide a valid id'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
];

exports.newUserValidation = [
  body('username')
    .isString()
    .withMessage('the name has to be string types')
    .notEmpty()
    .withMessage('you have to fill in the field'),
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .notEmpty()
    .withMessage('you have to fill in the field'),
  body('password')
    .isLength({ min: 10 })
    .withMessage('The password must be at least 10 characters')
    .notEmpty()
    .withMessage('you have to fill in the field'),
];

exports.loginUserValidation = [
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .notEmpty('you have to fill in the field'),
  body('password')
    .isLength({ min: 10 })
    .withMessage('The password must be at least 10 characters')
    .notEmpty()
    .withMessage('you have to fill in the field'),
];

exports.updateUserValidation = [
  body('email')
    .isEmail()
    .withMessage('Invalid emial')
    .notEmpty()
    .withMessage('you have to fill in the field'),
  body('username')
    .isString()
    .withMessage('the name has to be string types')
    .notEmpty()
    .withMessage('you have to fill in the field'),
];

exports.validateResult = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');

    return next(new AppError(400, errorMsg));
  }

  next();
  return null;
});
