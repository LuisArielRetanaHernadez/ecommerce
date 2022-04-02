/* eslint-disable linebreak-style */

// sequelize
const { DataTypes } = require('sequelize');

// utils
const { bd } = require('../utils/database');

const ProductInCart = bd.define(
  'productsInCart',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: 'enabled',
    },
  },
);

module.exports = { ProductInCart };
