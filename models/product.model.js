/* eslint-disable linebreak-style */

// sequelize
const { DataTypes } = require('sequelize');

// utils
const { bd } = require('../utils/database');

const Product = bd.define(
  'products',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: 'enabled',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
);

module.exports = { Product };
