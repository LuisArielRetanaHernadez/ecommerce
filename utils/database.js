/* eslint-disable linebreak-style */
// sequelize
const { Sequelize } = require('sequelize');

// dotenv
require('dotenv').config();

const bd = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
});

module.exports = { bd };
