/* eslint-disable linebreak-style */

// express
const express = require('express');

// middlewares
const { protectSession } = require('../middlewares/auth.middleware');
const {
  addProductToCartValidation,
  validateResult,
} = require('../middlewares/validators.middlewares');

// controllers
const {
  purchaseProdutsCart,
  addProductCart,
  deleteProductCart,
  updateProductCart,
} = require('../controllers/cart.controller');

const router = express.Router();

router.use(protectSession);

router.patch('/update-cart', updateProductCart);
router.delete('/:productId', deleteProductCart);
router.post('/purchase', purchaseProdutsCart);
router.post(
  '/add-product',
  addProductToCartValidation,
  validateResult,
  addProductCart,
);

module.exports = { cartRouter: router };
