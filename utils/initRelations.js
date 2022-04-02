/* eslint-disable linebreak-style */

// models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Cart } = require('../models/cart.model');

const initRelations = () => {
  // User 1 <--> M Order
  User.hasMany(Order);
  Order.belongsTo(User);

  // User 1 <--> 1 Cart
  User.hasOne(Cart);
  Cart.belongsTo(User);

  // User 1 <--> M Product
  User.hasMany(Product);
  Product.belongsTo(User);

  // Order 1 <--> 1
  Cart.hasOne(Order);
  Order.belongsTo(Cart);

  // Product 1 <--> 1 ProductInCart
  Product.hasOne(ProductInCart);
  ProductInCart.belongsTo(Product);

  // Cart 1 <--> M ProductInCart
  Cart.hasMany(ProductInCart);
  ProductInCart.belongsTo(Cart);
};

module.exports = { initRelations };
