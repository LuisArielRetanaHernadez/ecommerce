/* eslint-disable linebreak-style */

// express
const express = require('express');

const cookieParser = require('cookie-parser');

// routes
const { userRouter } = require('./routes/user.route');
const { productRouter } = require('./routes/product.route');
const { cartRouter } = require('./routes/cart.route');

// utils
const { globalError } = require('./utils/globalError');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartRouter);
app.use(globalError);

module.exports = { app };
