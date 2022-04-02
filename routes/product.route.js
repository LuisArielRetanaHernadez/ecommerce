/* eslint-disable linebreak-style */

// express
const express = require('express');

// middlewares
const { protectSession } = require('../middlewares/auth.middleware');
const { protectProduct } = require('../middlewares/protectProduct.middlewares');

// controllers
const {
  createProduct,
  getProductsEnabled,
  getProductById,
  patchProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const router = express.Router();

router.use(protectSession);

router.route('/')
  .post(createProduct)
  .get(getProductsEnabled);

router.get('/:id', getProductById);

router.use('/:id', protectProduct)
  .route('/:id')
  .patch(patchProduct)
  .delete(deleteProduct);

module.exports = { productRouter: router };
