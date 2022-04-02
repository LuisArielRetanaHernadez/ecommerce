/* eslint-disable linebreak-style */

// sequelize
const { DataTypes } = require('sequelize');

// utils
const { bd } = require('../utils/database');

const Order = bd.define(
  'orders',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issuedAt: {
      type: DataTypes.STRING(220),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    active: {
      type: DataTypes.STRING(10),
      defaultValue: 'enabled',
    },
  },
);

module.exports = { Order };
