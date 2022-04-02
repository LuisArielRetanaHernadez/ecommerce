/* eslint-disable linebreak-style */

// sequelize
const { DataTypes } = require('sequelize');

// utils
const { bd } = require('../utils/database');

const User = bd.define(
  'users',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: 'enabled',
    },
  },
);

module.exports = { User };
