/* eslint-disable linebreak-style */

// models
const { Product } = require('../models/product.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
// const { Order } = require('../models/order.model');

// utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');
const { Order } = require('../models/order.model');

exports.addProductCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const {
    productId,
    quantity,
  } = req.body;

  const productExists = await Product.findOne({
    where: {
      id: productId,
      status: 'enabled',
    },
  });

  if (!productExists) return next(new AppError('this product is non-existent', 404));

  if (quantity > productExists.quantity) {
    return next(new AppError('the quantity is greater than the approved limit', 404));
  }

  const cart = await Cart.findOne({
    where: {
      userId: currentUser.id,
      status: 'enabled',
    },
  });
  if (!cart) {
    const newCart = await Cart.create({
      userId: currentUser.id,
    });
    await ProductInCart.create({
      cartId: newCart.id,
      productId,
      quantity,
    });
  } else {
    const productExistsCart = await ProductInCart.findOne({
      where: {
        productId,
        cartId: cart.id,
      },
    });
    console.log(productExistsCart);
    if (productExistsCart && productExists.status === 'enabled') {
      return next(new AppError('this product is already in the cart', 404));
    }

    if (productExistsCart && productExists.status === 'disabled') {
      await productExists.update({
        status: 'enabled',
        quantity,
      });
    }

    if (!productExistsCart) {
      await ProductInCart.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }
  }

  return res.status(201).json({
    status: 'success',
    message: 'product added successfully',
  });
});

exports.updateProductCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const {
    productId,
    quantity,
  } = req.body;

  const product = await Product.findOne({
    where: {
      id: productId,
      status: 'enabled',
    },
  });

  if (!product) return next(new AppError('this product is non-existent', 404));

  if (quantity > product.quantity) {
    return next(new AppError('the quantity is greater than the approved limit', 404));
  }

  const cart = await Cart.findOne({
    where: {
      userId: currentUser.id,
      status: 'enabled',
    },
  });

  if (!cart) return next(new AppError('sorry, you do not have a cart enabled', 404));

  const productInCart = await ProductInCart.findOne({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (!productInCart) return next(new AppError('this product is not in the cart'), 404);

  if (quantity === 0) {
    await productInCart.update({
      quantity,
      status: 'disabled',
    });
  } else await productInCart.update({ quantity });

  if (productInCart.status === 'disabled') {
    await productInCart.update({
      quantity,
      status: 'enabled',
    });
  }

  return res.status(204).json({
    status: 'success',
    message: 'product upgraded successfully',
  });
});

exports.deleteProductCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId } = req.params;

  const cart = await Cart.findOne({
    where: {
      userId: currentUser.id,
      status: 'enabled',
    },
  });

  if (!cart) return next(new AppError('you don t have an enabled cart', 404));

  const productInCart = await ProductInCart.findOne({
    where: {
      cartId: cart.id,
      productId,
      status: 'enabled',
    },
  });

  if (!productInCart) return next(new AppError('this product is not in the cart'), 404);

  await productInCart.update({
    status: 'disabled',
  });

  return res.status(204).json({
    status: 'success',
    message: 'product removed from cart successfully',
  });
});

exports.purchaseProdutsCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: {
      userId: currentUser.id,
      status: 'enabled',
    },
  });

  if (!cart) return next(new AppError('you do not have a cart enabled', 404));

  const productInCart = await ProductInCart.findAll({
    where: {
      cartId: cart.id,
      status: 'enabled',
    },
    include: [{
      model: Product,
      where: {
        status: 'enabled',
      },
    }],
  });

  if (!productInCart) return next(new AppError('there are no products in the cart', 4004));

  let totalPrice = 0;

  await Promise.all(
    productInCart.map(async (data) => {
      const product = await Product.findOne({
        where: {
          id: data.productId,
        },
      });

      await data.update({
        status: 'purchased',
      });

      const restQuantity = product.quantity - data.quantity;

      totalPrice += data.quantity * data.product.pice;
      console.log(totalPrice);

      if (restQuantity <= 0) {
        await product.update({
          quantity: restQuantity,
          status: 'disabled',
        });
      } else {
        await product.update({
          quantity: restQuantity,
        });
      }
    }),
  );

  await cart.update({
    status: 'purchased',
  });

  const newOrder = await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: Date.now().toLocaleString(),
    totalPrice,
  });

  return res.status(202).json({
    status: 'success',
    data: newOrder,
    message: 'successful purchase',
  });
});
