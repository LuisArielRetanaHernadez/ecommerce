/* eslint-disable linebreak-style */

// express
const express = require('express');

// middlewares
const { protectSession } = require('../middlewares/auth.middleware');
const {
  protectAccount,
  userExists,
} = require('../middlewares/protectAccountUser.middlewares');

// controllers
const {
  createUser,
  loginUser,
  patchUser,
  deleteUser,
  getProductsByUserId,
  getOrderOfUser,
  getOrdersOfUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);

router.use(protectSession);

router.get('/me', getProductsByUserId);
router.get('/orders', getOrdersOfUser);
router.get('/orders/:id', userExists, protectAccount, getOrderOfUser);

router.use('/:id', userExists)
  .route('/:id')
  .delete(protectAccount, deleteUser)
  .patch(protectAccount, patchUser);

module.exports = { userRouter: router };
