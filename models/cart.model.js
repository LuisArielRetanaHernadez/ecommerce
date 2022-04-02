/* eslint-disable linebreak-style */

// sequelize
const { DataTypes } = require('sequelize');

// utils
const { bd } = require('../utils/database');

const Cart = bd.define(
  'carts',
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
    status: {
      type: DataTypes.STRING(10),
      defaultValue: 'enabled',
    },
  },
);

module.exports = { Cart };
